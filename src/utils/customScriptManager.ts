/**
 * 脚本管理器类
 * 处理用户自定义脚本的注入功能
 */
export class CustomScriptManager {
    constructor() {
        this.setupMessageListeners();
    }

    /**
     * 设置消息监听器
     * 监听来自内容脚本的注入请求
     */
    setupMessageListeners() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            // 处理脚本执行请求
            if (message.action === "executeScript" && sender.tab) {
                this.executeScriptWithFallback(message, sender);
            }
        });
    }

    /**
     * 使用多种方法执行脚本注入，带有降级策略
     * @param message - 包含脚本内容的消息对象
     * @param sender - 消息发送者信息
     */
    async executeScriptWithFallback(message: any, sender: any) {
        if (!sender.tab) return;

        // 定义多种注入方法，按优先级排序
        const injectionMethods = [
            () => this.injectViaScripting(sender.tab.id, message.script), // 方法1：现代scripting API
            () => this.injectViaContentScript(sender.tab.id, message.script), // 方法2：内容脚本通信
            () => this.injectViaTabsExecuteScript(sender.tab.id, message.script), // 方法3：传统executeScript
        ];

        // 依次尝试每种注入方法
        for (const method of injectionMethods) {
            try {
                await method();
                console.log("脚本注入成功");
                return;
            } catch (error) {
                console.warn("注入方法失败:", error);
            }
        }

        console.error("所有注入方法都失败了");
    }

    /**
     * 方法1：使用现代的chrome.scripting API注入
     * 这是Chrome扩展v3的推荐方法
     * @param tabId - 标签页ID
     * @param script - 要注入的脚本内容
     */
    async injectViaScripting(tabId: number, script: string) {
        return chrome.scripting.executeScript({
            target: { tabId },
            func: (scriptContent: string) => {
                // 页面内的多种注入策略
                const strategies = [
                    // 策略1：Function构造器执行（优先使用，避免CSP限制）
                    () => {
                        const func = new Function(scriptContent);
                        func();
                    },
                    // 策略2：标准的DOM脚本注入（备选方案）
                    () => {
                        const scriptEl = document.createElement("script");
                        scriptEl.textContent = scriptContent;
                        (
                            document.head ||
                            document.documentElement ||
                            document.body
                        ).appendChild(scriptEl);
                        scriptEl.remove();
                    },
                    // 策略3：iframe沙盒执行（针对有问题的脚本）
                    () => {
                        const iframe = document.createElement("iframe");
                        iframe.style.display = "none";
                        document.body.appendChild(iframe);
                        const iframeDoc =
                            iframe.contentDocument || iframe.contentWindow!.document;

                        // 在iframe中也使用Function构造器，避免CSP问题
                        const iframeScript = iframeDoc.createElement("script");
                        iframeScript.textContent = `
              try {
                const executeCode = new Function(${JSON.stringify(scriptContent)});
                executeCode();
              } catch(e) {
                parent.console.error('脚本执行错误:', e);
              }
            `;
                        iframeDoc.head.appendChild(iframeScript);
                        // 100ms后清理iframe
                        setTimeout(() => document.body.removeChild(iframe), 100);
                    },
                ];

                // 依次尝试每种策略
                for (const strategy of strategies) {
                    try {
                        strategy();
                        return;
                    } catch (e) {
                        console.warn("策略失败:", e);
                    }
                }
            },
            args: [script],
            world: "MAIN", // 在主世界中执行，可以访问页面变量
        });
    }

    /**
     * 方法2：通过内容脚本通信注入
     * 发送消息给内容脚本，让其执行注入
     * @param tabId - 标签页ID
     * @param script - 要注入的脚本内容
     */
    async injectViaContentScript(tabId: number, script: string) {
        return chrome.tabs.sendMessage(tabId, {
            action: "injectDirectly",
            script: script,
        });
    }

    /**
     * 方法3：传统的executeScript方法（备用方案）
     * 使用eval执行脚本（最后手段）
     * @param tabId - 标签页ID
     * @param script - 要注入的脚本内容
     */
    async injectViaTabsExecuteScript(tabId: number, script: string) {
        return chrome.scripting.executeScript({
            target: { tabId },
            func: (scriptContent: string) => {
                // 直接使用eval执行（不推荐，但作为最后手段）
                eval(scriptContent);
            },
            args: [script],
            world: "MAIN",
        });
    }
}