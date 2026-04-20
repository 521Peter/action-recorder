import * as _ from "lodash";
import { js as jsBeautify } from "js-beautify";
import { Node, FormElementType } from "@/types";

// 简单的模板替换函数，避免使用eval
function simpleTemplate(template: string, data: Record<string, any>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`<%=\\s*${key}\\s*%>`, "g");
    result = result.replace(regex, String(value));
  }
  return result;
}

// 节点代码生成器
class NodeCodeGenerator {
  private varNameCount: Partial<Record<string, number>> = {};
  private isInIframe: boolean;
  private isInForm: boolean;

  constructor(obj: { isInForm?: boolean; isInIframe?: boolean }) {
    this.isInIframe = obj.isInIframe ?? false;
    this.isInForm = obj.isInForm ?? false;
  }

  generateNodeCode(node: Node, isLastNode: boolean): string[] {
    const varName = this.getMeaningfulVarName(node, isLastNode);
    const elementVar = this.getVariableNames(varName);
    let lines: string[] = [];
    const selector = node.formSelector
      ? node.formSelector + " " + node.selector
      : node.selector;

    // 元素查找和等待
    if (node.waitForElement) {
      if (this.isInIframe) {
        lines.push(
          `const ${elementVar} = await steamBack.waitForElementObserver(\`${selector}\`, iframeDoc.body, 10000, iframeDoc);`,
        );
      } else {
        lines.push(
          `const ${elementVar} = await steamBack.waitForElementObserver(\`${selector}\`);`,
        );
      }
    } else {
      lines.push(
        this.isInForm
          ? `const ${elementVar} = form.querySelector(\`${node.selector}\`);`
          : `const ${elementVar} = document.querySelector(\`${node.selector}\`);`,
      );
    }

    // 滚动操作
    if (node.scroll) {
      lines.push(`await steamBack.scrollToWithPromise(${elementVar});`);
    }

    if (
      node.elementType === FormElementType.DIALOG ||
      node.elementType === FormElementType.SUCCESS_WRAP
    ) {
      lines = [];
    }

    // 核心操作
    const operation = this.generateNodeOperation(
      node,
      elementVar,
      isLastNode,
      this.isInIframe,
    );
    lines.push(...operation.split("\n").filter((line) => line.trim()));

    return lines;
  }

  private getVariableNames(varName: string) {
    let appearCount = this.varNameCount[varName] || 0;
    appearCount++;
    this.varNameCount[varName] = appearCount;

    const suffix = appearCount > 1 ? appearCount.toString() : "";
    return `${varName}Ele${suffix}`;
  }

  // 获取有意义的变量名
  private getMeaningfulVarName(node: Node, isLastNode: boolean): string {
    const { className, id, text } = node;
    const props = _.map([className, id, text], _.lowerCase);
    // 定义关键词数组
    const keywords: Record<string, string> = {
      // menu: "menu",
      // contact: "contact",
      accept: "acceptBtn",
    };
    // 检查是否包含关键词
    const key = _.find(Object.keys(keywords), (keyword) =>
      _.some(props, (prop) => prop.includes(keyword.toLowerCase())),
    );
    if (key) {
      return keywords[key];
    }

    if (node.elementType === FormElementType.CLICK && isLastNode) {
      return `submitBtn`;
    }
    return node.elementType ?? "";
  }

  private generateNodeOperation(
    node: Node,
    targetExpr: string,
    isLastNode: boolean = false,
    isInIframe: boolean = false,
  ): string {
    const waitTimeStr = "await steamBack.wait(1500);";
    let template = "";
    let code = "";
    switch (node.elementType) {
      case FormElementType.CLICK:
        return `${waitTimeStr}\nsteamBack.createClick(${targetExpr});`;
      case FormElementType.EMAIL:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr},user.email || steamBack.generatorApi.generateEmail(),true);`;
      case FormElementType.TEXT:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr}, steamBack.generatorApi.generateText(),true);`;
      case FormElementType.NUMBER:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr}, steamBack.generatorApi.generateNumber()+'',true);`;
      case FormElementType.PASSWORD:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr}, steamBack.generatorApi.generatePassword(),true);`;
      case FormElementType.NAME:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr},user.name || steamBack.generatorApi.generateName(),true);`;
      case FormElementType.FIRST_NAME:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr},user.firstName || steamBack.generatorApi.generateFirstName(),true);`;
      case FormElementType.LAST_NAME:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr},user.lastName || steamBack.generatorApi.generateLastName(),true);`;
      case FormElementType.PHONE:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr}, user.phone || steamBack.generatorApi.generatePhone(),true);`;
      case FormElementType.BIRTHDAY:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr}, steamBack.generatorApi.generateBirthday(),true);`;
      case FormElementType.ZIP:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr}, user.postCode || steamBack.generatorApi.generateZip(),true);`;
      case FormElementType.SELECT:
        return `${waitTimeStr}\nsteamBack.fillSelectField(${targetExpr});`;
      case FormElementType.CITY:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr}, user.city || steamBack.generatorApi.generateCity(),true);`;
      case FormElementType.STATE:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr}, steamBack.generatorApi.generateState(),true);`;
      case FormElementType.ADDRESS:
        return `${waitTimeStr}\nsteamBack.setValue(${targetExpr}, user.address1 || steamBack.generatorApi.generateAddress(),true);`;
      case FormElementType.DIALOG:
        template = `
          const <%= varName %> = await steamBack.locateElement(
            \`<%= nodeSelector %>\`,
            8000
          );
          if (<%= varName %>) {
            steamBack.createClick(<%= varName %>);
          }\n
        `;
        code = simpleTemplate(template, {
          nodeSelector: node.selector,
          varName: targetExpr,
        });
        return code;
      case FormElementType.SUBMIT:
        return `${waitTimeStr}\nsteamBack.createSubmit ? steamBack.createSubmit(${targetExpr}, 'monitor') : steamBack.createClick(${targetExpr});`;
      case FormElementType.SUCCESS_WRAP:
        const { newSearchParams, newHash } = node.options || {};
        if (newSearchParams && Object.keys(newSearchParams).length > 0) {
          const key = Object.keys(newSearchParams)[0];
          template = `
              if (location.search.includes("<%= key %>=")) {
                steamBack.trackInfo("form", "success message found");
                return steamBack.finish("form");
              }
          `;
          code = simpleTemplate(template, { key });
          return code;
        } else if (newHash) {
          template = `
              if (location.hash.includes("<%= hash %>")) {
                steamBack.trackInfo("form", "success message found");
                return steamBack.finish("form");
              }
          `;
          code = simpleTemplate(template, { hash: newHash });
          return code;
        }

        let successText = "";
        if (node.text) {
          successText = node.text.toLowerCase().includes("thank")
            ? "thank"
            : node.text;
        }
        if (node.iframeSelector) {
          template = `
            const successWrapIframe = await steamBack.waitForElementObserver(\`<%= iframeSelector %>\`);
            
            const success = await steamBack.waitForHandle(() => {
              /* @ts-ignore */
              const success = successWrapIframe.contentDocument?.querySelector(\`<%= successSelector %>\`);
              return success && success.innerHTML.toLowerCase().includes("<%= successText %>".toLowerCase());
            });
            if (success) {
              steamBack.trackInfo('form', 'success message found');
              return steamBack.finish('form');
            }
          `;
        } else {
          template = `
            const success = await steamBack.waitForHandle(() => {
              const success = document.querySelector(\`<%= successSelector %>\`);
              return success && success.innerHTML.toLowerCase().includes("<%= successText %>".toLowerCase());
            });
            if (success) {
              steamBack.trackInfo('form', 'success message found');
              return steamBack.finish('form');
            }
          `;
        }

        code = simpleTemplate(template, {
          successSelector: node.formSelector
            ? `${node.formSelector} ${node.selector}`
            : node.selector,
          successText: successText,
          iframeSelector: node.iframeSelector || "",
        });
        return code;
      default:
        console.error("未知类型", node);
        return `// 未知类型: ${node.type}`;
    }
  }
}

// 比较两个URL路径，找出新路径中新增的查询参数和哈希部分
function compareUrls(
  oldPath: string,
  newPath: string,
): { newSearchParams: Record<string, string>; newHash: string | null } {
  try {
    // 解析旧路径
    const oldUrl = new URL(oldPath);
    const oldParams = Object.fromEntries(new URLSearchParams(oldUrl.search));

    // 解析新路径
    const newUrl = new URL(newPath);
    const newParams = new URLSearchParams(newUrl.search);

    // 找出新增的查询参数
    const addedParams: Record<string, string> = {};

    newParams.forEach((value, key) => {
      if (!oldParams.hasOwnProperty(key)) {
        addedParams[key] = value;
      }
    });

    // 检查哈希是否有变化
    let newHash: string | null = null;
    const oldHash = oldUrl.hash;

    if (newUrl.hash && oldHash !== newUrl.hash) {
      newHash = newUrl.hash;
    }

    return {
      newSearchParams: addedParams,
      newHash,
    };
  } catch (error) {
    throw new Error("无效的URL路径");
  }
}

// 生成表单任务
function generateFormTask(nodeList: Node[]) {
  const codeBlocks: string[] = [];
  const normalGenerator = new NodeCodeGenerator({});
  const isInIframe = !!nodeList.some((node) => node.iframeSelector);
  const formGenerator = new NodeCodeGenerator({
    isInForm: true,
    isInIframe: isInIframe,
  });

  // 连续两个点击做特殊处理
  for (let j = 1; j < nodeList.length; j++) {
    const preNode = nodeList[j - 1];
    const currentNode = nodeList[j];
    if (
      preNode.elementType === FormElementType.CLICK &&
      currentNode.elementType === FormElementType.CLICK
    ) {
      currentNode.waitForElement = true;
    }
  }

  // 如果某个节点是isPageReloaded为true，则把它放在所有表单节点的前面
  nodeList.sort((a, b) => (a.isPageReloaded ? -1 : b.isPageReloaded ? 1 : 0));

  // 查出节点是isPageReloaded为true的节点索引
  const pageReloadedIndex = nodeList.findIndex((node) => node.isPageReloaded);
  if (pageReloadedIndex !== -1) {
    const pageReloadedNode = nodeList[pageReloadedIndex];
    const nextNode = nodeList[pageReloadedIndex + 1];
    // 让该节点和下一个节点的url作对比，如果页面加载的节点url发生了变化，则要找出变化的部分，例如：hash或者search
    const options = compareUrls(nextNode.url, pageReloadedNode.url);
    pageReloadedNode.options = options;
  }

  let i = 0;
  while (i < nodeList.length) {
    const currentNode = nodeList[i];

    if (
      currentNode.formSelector &&
      currentNode.elementType !== FormElementType.DIALOG &&
      !currentNode.isPageReloaded
    ) {
      // 找到表单节点，收集所有连续的表单节点
      const formNodes: Node[] = [];
      const formSelector = currentNode.formSelector;

      // 收集所有连续的具有相同formSelector的节点
      while (i < nodeList.length && nodeList[i].formSelector === formSelector) {
        formNodes.push(nodeList[i]);
        i++;
      }

      // 生成表单操作代码
      const formOperations: string[] = [];
      for (let j = 0; j < formNodes.length; j++) {
        const node = formNodes[j];
        const isLastNode = j === formNodes.length - 1;
        const nodeLines = formGenerator.generateNodeCode(node, isLastNode);
        formOperations.push(nodeLines.join("\n"));
      }

      // 如果表单节点里面,有tag为input的节点
      const hasInputTagName = formNodes.some(
        (node) => node.tagName === "input",
      );
      let formCode = "";
      // 仅在表单包含input标签时生成表单模板代码
      if (hasInputTagName) {
        // 使用模板生成表单代码块
        const formTemplate = `
          const form = await steamBack.waitForElementObserver(\`<%= formSelector %>\`);
          if (form) {
            await steamBack.scrollToWithPromise(form);
            const user = await steamBack.getUserInfo();
            steamBack.trackInfo("form", "start fill form");

            <%= formOperations %>
          } else {
            steamBack.trackInfo("form", "form no found");
          }
          `;
        const iframeSelector =
          formNodes.find((node) => node.iframeSelector)?.iframeSelector ?? "";
        const iframeFormTemplate = `
          const iframeEle = await steamBack.waitForElementObserver(\`<%= iframeSelector %>\`);
          /* @ts-ignore */
          const iframeDoc = iframeEle.contentDocument;
          const form = await steamBack.waitForElementObserver(\`<%= formSelector %>\`,iframeDoc.body,10000,iframeDoc);
          if (form) {
            await steamBack.scrollToWithPromise(form);
            const user = await steamBack.getUserInfo();
            steamBack.trackInfo("form", "start fill form");

            <%= formOperations %>
          } else {
            steamBack.trackInfo("form", "form no found");
          }
          `;

        formCode = simpleTemplate(
          iframeSelector ? iframeFormTemplate : formTemplate,
          {
            formSelector,
            formOperations: formOperations.join("\n\n"),
            iframeSelector,
          },
        );
      } else {
        formCode = formOperations.join("\n\n");
      }

      codeBlocks.push(formCode);
    } else {
      // 处理非表单节点
      const nodeLines = normalGenerator.generateNodeCode(currentNode, false);
      codeBlocks.push(nodeLines.join("\n"));
      i++;
    }
  }

  return codeBlocks.join("\n\n");
}

// 生成普通任务
function generateSimpleTask(nodeList: Node[]) {
  nodeList.forEach((node) => (node.waitForElement = true));
  const generator = new NodeCodeGenerator({});

  // 生成节点代码块
  const nodeBlocks: string[] = [];
  for (let i = 0; i < nodeList.length; i++) {
    const node = nodeList[i];
    const isLastNode = false;
    const nodeLines = generator.generateNodeCode(node, isLastNode);
    nodeBlocks.push(nodeLines.join("\n"));
  }
  return nodeBlocks.join("\n\n");
}

function generateTask(pathname: string, nodeList: Node[]) {
  const isFormTask = nodeList.some((node) => node.formSelector);
  // 遍历nodeList节点，如果当前节点的type是scroll，则给下一个节点对象填写scroll=true,并将当前节点删除
  for (let i = 0; i < nodeList.length; i++) {
    const node = nodeList[i];
    if (node && node.type === "scroll" && nodeList[i + 1]) {
      nodeList[i + 1].scroll = true;
      nodeList.splice(i, 1);
      i--;
    }
  }

  // 如果表单提交成功后，跳转到新页面
  if (
    nodeList.length === 1 &&
    nodeList[0].elementType === FormElementType.SUCCESS_WRAP
  ) {
    return `await steamBack.task("${pathname}", async () => {
      steamBack.trackInfo('form', 'success message found');
      steamBack.finish('form');
    });`;
  }

  let task = isFormTask
    ? generateFormTask(nodeList)
    : generateSimpleTask(nodeList);
  const code = simpleTemplate(
    `await steamBack.task("<%= pathname %>", async () => { <%= task %> });`,
    {
      pathname,
      task,
    },
  );
  return code;
}

function getFileName(hostname: string) {
  // 分割域名部分
  const parts = hostname.split(".");
  if (parts[0] == "www") parts.shift();
  return parts.join("-");
}

// 获取url里面的pathname
function getPathname(url: string) {
  let { pathname } = new URL(url);
  if (pathname.endsWith("/") && pathname !== "/") {
    pathname = pathname.slice(0, -1);
  }
  return pathname;
}

function deduplicateAdjacentObjects(arr: any[]) {
  if (arr.length === 0) return arr;

  const result: any[] = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    const previous = arr[i - 1];

    // 检查是否满足去重条件
    const isDuplicate =
      (current.id &&
        previous.id &&
        current.id === previous.id &&
        current.tagName === previous.tagName) ||
      (current.selector &&
        previous.selector &&
        current.selector === previous.selector &&
        current.tagName === previous.tagName);

    if (!isDuplicate) {
      result.push(current);
    }
  }

  return result;
}

function generateCode(sourceData: any[], author: string) {
  const data = deduplicateAdjacentObjects(sourceData);
  const group = _.groupBy(data, (node) => {
    const { origin, pathname } = new URL(node.url);
    return `${origin}${pathname}`;
  });
  const urls = Object.keys(group);
  const startPage = urls[0];
  const pathnames = urls.map((url) => getPathname(url));
  const taskCodeList: string[] = [`await steamBack.start('form');`];
  for (let url of urls.reverse()) {
    const nodeList = group[url] as Node[];
    const pathname = getPathname(url);
    const task = generateTask(pathname, nodeList);
    taskCodeList.push(task);
  }
  // 处理根路径
  if (!pathnames.includes("/")) {
    taskCodeList.push(
      `await steamBack.task("/", async () => { steamBack.finish("normal"); });`,
    );
    pathnames.push("/");
  }
  const defInfo = {
    name: getFileName(new URL(startPage).hostname),
    type: "jobs",
    author,
    urls: pathnames,
  };
  const template = `// <%= startPage %> \n\n  (async steamBack => { <%= taskList %> })(window.onaftersubmit); \n\n window.DefInfo = <%= defInfo %>`;
  const code = simpleTemplate(template, {
    startPage,
    taskList: taskCodeList.join("\n"),
    defInfo: JSON.stringify(defInfo),
  });
  // 美化后的代码
  const beautifiedCode = jsBeautify(code, {
    indent_size: 2,
    indent_char: " ",
    max_preserve_newlines: 2,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    brace_style: "collapse",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: false,
  });
  return beautifiedCode;
}

export { generateCode };
