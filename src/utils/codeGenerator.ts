import { FormElementType, TaskNode, TaskConfig } from "../types";
import { isRandomSelector } from "./genSelector";
import { showToast } from "./toastManager";

// 代码模板定义
interface CodeTemplate {
  taskWrapper: (pathname: string, body: string) => string;
  formCheck: (formSelector: string, formBody: string) => string;
  iframeFormCheck: (
    iframeSelector: string,
    formSelector: string,
    formBody: string
  ) => string;
  formInit: () => string;
  nodeBlock: (lines: string[]) => string;
  successHandling: (selector: string, text?: string) => string;
  iframeSuccessHandling: (selector: string, text?: string) => string;
}

// 用于跟踪options选项的计数器
let optionCounter = 0;

// 获取有意义的变量名
const getMeaningfulVarName = (
  type: FormElementType,
  index: number,
  isLastNode: boolean
): string => {
  if (type === FormElementType.CLICK && isLastNode) {
    return `submitBtn`;
  }
  return type || `element${index}`;
};

const templates: CodeTemplate = {
  taskWrapper: (pathname: string, body: string) =>
    `await steamBack.task(\n  "${pathname}",\n  async () => {\n${body}\n  }\n);`,

  formCheck: (formSelector: string, formBody: string) =>
    `  const form = await steamBack.waitForElementObserver(\`${formSelector}\`);\n  if (form) {\n${formBody}\n  } else {\n    steamBack.trackInfo('form', 'form no found');\n  }`,

  iframeFormCheck: (
    iframeSelector: string,
    formSelector: string,
    formBody: string
  ) =>
    `  const iframeEle = await steamBack.waitForElementObserver(\`${iframeSelector}\`);\n  const iframeDoc = iframeEle.contentDocument;\n  const form = await steamBack.waitForElementObserver(\`${formSelector}\`, iframeDoc.body, 10000, iframeDoc);\n  if (form) {\n${formBody}\n  } else {\n    steamBack.trackInfo('form', 'form no found');\n  }`,

  formInit: () =>
    `    await steamBack.scrollToWithPromise(form);\n    const user = await steamBack.getUserInfo();\n    steamBack.trackInfo('form', 'start fill form');`,

  nodeBlock: (lines: string[]) => lines.map((line) => `    ${line}`).join("\n"),

  successHandling: (selector: string, text?: string) => {
    if (text) {
      return `    const success = await steamBack.waitForElementObserver(\`${selector}\`);\n    if (success) {\n      steamBack.trackInfo('form', 'success wrap found');\n    await steamBack.wait(2000);\n   await steamBack.scrollToWithPromise(success);\n      steamBack.waitForElementVisible(success, (isVisible) => {\n        if (isVisible) {\n          const timer = setInterval(() => {\n            if (success.innerHTML.toLowerCase().includes("${text}".toLowerCase())) {\n              clearInterval(timer);\n              steamBack.trackInfo('form', 'success message is visible');\n              console.log('form submit success!');\n              steamBack.finish('form');\n            }\n          }, 1000);\n        }\n      });\n    } else {\n      steamBack.trackInfo('form', 'success wrap not found');\n    }`;
    }
    return `    const success = await steamBack.waitForElementObserver(\`${selector}\`);\n    if (success) {\n      steamBack.trackInfo('form', 'success message is visible');\n      console.log('form submit success!');\n      steamBack.finish('form');\n    }`;
  },

  iframeSuccessHandling: (selector: string, text?: string) => {
    if (text) {
      return `    const success = await steamBack.waitForElementObserver(\`${selector}\`, iframeDoc.body, 10000, iframeDoc);\n    if (success) {\n      steamBack.trackInfo('form', 'success wrap found');\n    await steamBack.wait(2000);\n   await steamBack.scrollToWithPromise(success);\n      steamBack.waitForElementVisible(success, (isVisible) => {\n        if (isVisible) {\n          const timer = setInterval(() => {\n            if (success.innerHTML.toLowerCase().includes("${text}".toLowerCase())) {\n              clearInterval(timer);\n              steamBack.trackInfo('form', 'success message is visible');\n              console.log('form submit success!');\n              steamBack.finish('form');\n            }\n          }, 1000);\n        }\n      });\n    } else {\n      steamBack.trackInfo('form', 'success wrap not found');\n    }`;
    }
    return `    const success = await steamBack.waitForElementObserver(\`${selector}\`, iframeDoc.body, 10000, iframeDoc);\n    if (success) {\n      steamBack.trackInfo('form', 'success message is visible');\n      console.log('form submit success!');\n      steamBack.finish('form');\n    }`;
  },
};

// 节点代码生成器
class NodeCodeGenerator {
  private typeCount: Partial<Record<FormElementType, number>> = {};
  private isIframe: boolean;

  constructor(isIframe: boolean = false) {
    this.isIframe = isIframe;
  }

  generateNodeCode(
    node: TaskNode,
    index: number,
    isLastNode: boolean
  ): string[] {
    const varName = getMeaningfulVarName(node.type, index, isLastNode);
    const { selectorVar, elementVar } = this.getVariableNames(
      node.type,
      varName
    );

    const lines: string[] = [];

    // 元素查找和等待
    if (node.waitForElement) {
      // lines.push(
      //   `const ${selectorVar} = form.querySelector(\`${node.selector}\`);`
      // );
      const selector = node.parentSelector
        ? `${node.parentSelector} ${node.selector}`
        : node.selector;
      if (this.isIframe) {
        lines.push(
          `const ${elementVar} = await steamBack.waitForElementObserver(\`${selector}\`, iframeDoc.body, 10000, iframeDoc);`
        );
      } else {
        lines.push(
          `const ${elementVar} = await steamBack.waitForElementObserver(\`${selector}\`);`
        );
      }
    } else {
      lines.push(
        `const ${elementVar} = form.querySelector(\`${node.selector}\`);`
      );
    }

    // 滚动操作
    if (node.scroll) {
      lines.push(`await steamBack.scrollToWithPromise(${elementVar});`);
    }

    // 核心操作
    const operation = generateNodeOperation(
      node,
      elementVar,
      isLastNode,
      this.isIframe
    );
    lines.push(...operation.split("\n").filter((line) => line.trim()));

    return lines;
  }

  private getVariableNames(type: FormElementType, varName: string) {
    let appearCount = this.typeCount[type] || 0;
    appearCount++;
    this.typeCount[type] = appearCount;

    const suffix = appearCount > 1 ? appearCount.toString() : "";
    return {
      selectorVar: `${varName}Selector${suffix}`,
      elementVar: `${varName}Ele${suffix}`,
    };
  }
}

export const generateTaskCode = (config: TaskConfig) => {
  console.log("Generating task code with config:", config);

  // 验证配置
  const validationError = validateConfig(config);
  if (validationError) {
    showToast.warning("警告", validationError);
    return "";
  }

  const nodes = config.node.filter((node) => node.selector);
  optionCounter = 0;

  // 检查是否有iframe选择器
  const isIframe = !!config.iframeSelector;
  const generator = new NodeCodeGenerator(isIframe);

  // 生成节点代码块
  const nodeBlocks: string[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const isLastNode = i === nodes.length - 1;
    const nodeLines = generator.generateNodeCode(node, i, isLastNode);
    nodeBlocks.push(templates.nodeBlock(nodeLines));
  }

  // 组装最终代码
  const pathname = new URL(config.url).pathname;
  const formInitCode = templates.formInit();
  const nodesCode = nodeBlocks.join("\n\n");

  // 根据是否有iframe选择器来决定使用哪种成功处理方式
  const successCode = config.successSelector
    ? isIframe
      ? templates.iframeSuccessHandling(
        config.successSelector,
        config.successText
      )
      : templates.successHandling(config.successSelector, config.successText)
    : "";

  const formBody = [formInitCode, nodesCode, successCode]
    .filter(Boolean)
    .join("\n\n");

  // 根据是否有iframe选择器来决定使用哪种form检查方式
  const formCheckCode = isIframe
    ? templates.iframeFormCheck(
      config.iframeSelector!,
      config.formSelector,
      formBody
    )
    : templates.formCheck(config.formSelector, formBody);

  const finalCode = templates.taskWrapper(pathname, formCheckCode);

  return finalCode;
};

// 配置验证函数
function validateConfig(config: TaskConfig): string | null {
  if (!config.formSelector) {
    return "请填写form选择器1";
  }
  if (isRandomSelector(config.formSelector)) {
    return "form选择器不合法";
  }
  if (config.successSelector && isRandomSelector(config.successSelector)) {
    return "成功选择器不合法";
  }
  if (config.successText && !config.successSelector) {
    return "缺少成功选择器";
  }
  return null;
}

// 生成点击操作代码
const generateClickOperation = (
  targetExpr: string,
  waitTimeStr: string,
  isLastNode: boolean
): string => {
  const clickCode = isLastNode
    ? `steamBack.createSubmit ? steamBack.createSubmit(${targetExpr}, 'monitor') : steamBack.createClick(${targetExpr});`
    : `steamBack.createClick(${targetExpr});`;

  return `${waitTimeStr}\n${clickCode}`;
};

const generateNodeOperation = (
  node: TaskNode,
  targetExpr: string,
  isLastNode: boolean = false,
  isIframe: boolean = false
): string => {
  const waitTimeStr = "await steamBack.wait(1500);";
  switch (node.type) {
    case FormElementType.CLICK:
      return generateClickOperation(targetExpr, waitTimeStr, isLastNode);
    case FormElementType.OPTIONS: {
      optionCounter++;
      const optionsVarName = `option${optionCounter}`;
      const selectorQuery = isIframe
        ? `iframeDoc.querySelectorAll(\`${node.selector}\`)`
        : `document.querySelectorAll(\`${node.selector}\`)`;
      return [
        waitTimeStr,
        `const ${optionsVarName} = ${selectorQuery};`,
        `steamBack.createClick(steamBack.generatorApi.getRandomElement(${optionsVarName}));`,
      ].join("\n");
    }
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
    default:
      return `// 未知类型: ${node.type}`;
  }
};
