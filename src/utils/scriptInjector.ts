import { minify } from "terser";

/**
 * 脚本注入器类
 * 增强型内容脚本 - 多重注入策略
 * 借鉴油猴（Tampermonkey）的强大注入方法
 * 自动注入模式 - 无需用户权限确认
 * 重构自 ScriptInjector，优化了结构和可维护性
 */
export class ScriptInjector {
  private injectionAttempts: number = 0;
  private maxAttempts: number = 3;
  private injectionMethods: Array<
    (file: string, callback?: () => void) => boolean
  >;

  constructor() {
    // 注入方法数组，按优先级排序
    this.injectionMethods = [
      this.injectViaScriptTag.bind(this), // 方法1：脚本标签注入
      this.injectViaTextContent.bind(this), // 方法2：文本内容注入
      this.injectViaEval.bind(this), // 方法3：Eval注入（最后手段）
    ];
  }

  /**
   * 方法1：传统的脚本标签注入
   * 通过创建<script>标签并设置src属性来注入脚本
   * @param file - 脚本文件URL
   * @param onloadCallback - 加载完成回调函数
   * @returns 是否成功
   */
  injectViaScriptTag(file: string, onloadCallback?: () => void): boolean {
    // 寻找合适的DOM节点来插入脚本
    const targetNode =
      document.head || document.documentElement || document.body;
    if (!targetNode) return false;

    // 创建script元素
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", file);

    // 设置加载成功回调
    script.onload = () => {
      script.remove(); // 执行完毕后移除脚本标签
      if (onloadCallback) onloadCallback();
    };

    // 设置加载失败回调，尝试下一种方法
    script.onerror = () => {
      console.warn("脚本标签注入失败，尝试备用方法");
      this.tryNextInjectionMethod(file, onloadCallback);
    };

    try {
      targetNode.appendChild(script);
      return true;
    } catch (e) {
      console.warn("脚本标签注入异常:", e);
      return false;
    }
  }

  /**
   * 方法2：直接文本内容注入
   * 使用Function构造器来避免CSP限制
   * @param scriptContent - 脚本内容
   * @param onloadCallback - 执行完成回调函数
   * @returns 是否成功
   */
  injectViaTextContent(
    scriptContent: string,
    onloadCallback?: () => void
  ): boolean {
    try {
      // 使用Function构造器来避免CSP限制
      const executeCode = new Function(scriptContent);
      executeCode();
      if (onloadCallback) onloadCallback();
      return true;
    } catch (e) {
      console.warn("文本内容注入失败:", e);
      // 如果Function构造器也失败，尝试传统方式作为备选
      try {
        const targetNode =
          document.head || document.documentElement || document.body;
        if (targetNode) {
          const script = document.createElement("script");
          script.textContent = scriptContent;
          targetNode.appendChild(script);
          script.remove();
          if (onloadCallback) onloadCallback();
          return true;
        }
      } catch (fallbackError) {
        console.warn("备选注入方式也失败:", fallbackError);
      }
      return false;
    }
  }

  /**
   * 方法3：基于Eval的注入（最后手段）
   * 使用Function构造器来执行脚本，避免直接使用eval
   * @param scriptContent - 脚本内容
   * @param onloadCallback - 执行完成回调函数
   * @returns 是否成功
   */
  injectViaEval(scriptContent: string, onloadCallback?: () => void): boolean {
    try {
      // 使用Function构造器创建函数并执行，比直接eval更安全
      const func = new Function(scriptContent);
      func();
      if (onloadCallback) onloadCallback();
      return true;
    } catch (e) {
      console.warn("Eval注入失败:", e);
      return false;
    }
  }

  /**
   * 尝试下一种注入方法
   * 当前方法失败时自动切换到下一种方法
   * @param file - 脚本文件或内容
   * @param onloadCallback - 回调函数
   */
  tryNextInjectionMethod(file: string, onloadCallback?: () => void): void {
    // 检查是否已达到最大尝试次数
    if (this.injectionAttempts >= this.maxAttempts) {
      console.error("所有注入方法都失败了");
      return;
    }

    // 增加尝试次数并获取下一个方法
    this.injectionAttempts++;
    const method = this.injectionMethods[this.injectionAttempts - 1];

    // 如果是扩展文件URL，需要先获取内容
    if (file.startsWith("chrome-extension://")) {
      fetch(file)
        .then((response) => response.text())
        .then((content) => method(content, onloadCallback))
        .catch(() => this.tryNextInjectionMethod(file, onloadCallback));
    } else {
      method(file, onloadCallback);
    }
  }

  /**
   * 执行脚本注入
   * 先注入基础脚本，然后注入用户自定义脚本
   */
  executeInjection(): void {
    // 首先注入基础脚本（上游初始化脚本）
    this.injectViaScriptTag(
      chrome.runtime.getURL("src/injected_script.js"),
      () => {
        // 然后注入用户自定义脚本
        chrome.storage.local.get("customScript", async (data) => {
          const removeTrailingSemicolon = (str: string) => {
            str = str.trim();
            if (str.endsWith(";")) {
              str = str.slice(0, -1);
            }
            return str;
          };
          if (data.customScript) {
            // 移除注释
            const codeWithoutComments = await removeComments(data.customScript);
            // 移除 trailing semicolon
            const finalScript = `window.onaftersubmit.setDefaultParams('{"user":"test","test":"1"}');window.onaftersubmit.setISDev(true);window.onaftersubmit.setResetScript(${JSON.stringify(
              removeTrailingSemicolon(codeWithoutComments)
            )})`;
            console.warn("用户自定义脚本", `${finalScript}`);
            // 发送消息给后台脚本执行用户脚本
            chrome.runtime.sendMessage({
              action: "executeScript",
              script: finalScript,
            });
          }
        });
      }
    );
  }

  /**
   * 使用多种时机策略初始化注入
   * 确保在各种页面加载状态下都能成功注入
   */
  initializeWithMultipleTiming(): void {
    // 策略1：如果页面已经加载完成，立即执行
    if (document.readyState !== "loading") {
      this.executeInjection();
    }

    // 策略2：DOM内容加载完成时执行
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.executeInjection();
      });
    }
  }
}

/**
 * 移除JavaScript代码中的注释
 * @param code 原始代码
 * @returns 移除注释后的代码
 */
async function removeComments(code: string): Promise<string> {
  const result = await minify(code, {
    compress: false,
    mangle: false,
    format: {
      comments: false,
    },
  });
  return result.code ?? "";
}
export { removeComments };
