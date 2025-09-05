import { FormElementType } from "../types";


// 标签文本提取器 
class LabelExtractor {
  static getLabelText(inputSelector: string, doc: Document = document): string {
    const input = doc.querySelector(inputSelector);
    if (!input) return "";

    // 按优先级尝试不同的标签获取方式
    const strategies = [
      () => this.getLabelByFor(input, doc),
      () => this.getLabelByParent(input),
      () => this.getLabelBySibling(input),
      () => this.getLabelByParentSibling(input),
      () => this.getPlaceholderAsLabel(input),
    ];

    for (const strategy of strategies) {
      const label = strategy();
      if (label) return label;
    }

    return "";
  }

  private static getLabelByFor(input: Element, doc: Document): string {
    if (!input.id) return "";
    const labelByFor = doc.querySelector(`label[for="${input.id}"]`) as HTMLLabelElement;
    return labelByFor?.innerText.trim() || "";
  }

  private static getLabelByParent(input: Element): string {
    const parentLabel = input.parentElement?.closest("label") as HTMLLabelElement;
    return parentLabel?.innerText.trim() || "";
  }

  private static getLabelBySibling(input: Element): string {
    const siblings = input.parentElement?.children || [];
    for (const sibling of Array.from(siblings)) {
      if (sibling.tagName === "LABEL") {
        return (sibling as HTMLLabelElement).innerText.trim();
      }
    }
    return "";
  }

  private static getLabelByParentSibling(input: Element): string {
    const parent = input.parentElement;
    const parentSiblings = parent?.parentElement?.children || [];
    for (const sibling of Array.from(parentSiblings)) {
      if (sibling !== parent && sibling.tagName === "LABEL") {
        return (sibling as HTMLLabelElement).innerText.trim();
      }
    }
    return "";
  }

  private static getPlaceholderAsLabel(input: Element): string {
    return (input as HTMLInputElement).placeholder || "";
  }
}

// 类型检测器
class ElementTypeDetector {
  private static readonly labelPatterns = {
    [FormElementType.EMAIL]: ["email"],
    [FormElementType.PASSWORD]: ["password", "pwd"],
    [FormElementType.FIRST_NAME]: ["firstname", "first name", "first", "fname"],
    [FormElementType.LAST_NAME]: ["lastname", "last name", "last", "lname"],
    [FormElementType.NAME]: ["full"],
    [FormElementType.PHONE]: ["phone", "telephone", "tel"],
    [FormElementType.BIRTHDAY]: ["birth", "dob"],
    [FormElementType.ZIP]: ["zip", "postal", "code"],
    [FormElementType.NUMBER]: ["number", "num"],
    [FormElementType.CITY]: ["city"],
    [FormElementType.STATE]: ["state"],
    [FormElementType.ADDRESS]: ["address"],
  };

  private static readonly selectorPatterns = {
    [FormElementType.OPTIONS]: ["queryselectorall"],
    [FormElementType.CLICK]: ["button", "btn", "submit"],
    [FormElementType.EMAIL]: ["email"],
    [FormElementType.PASSWORD]: ["password", "pwd"],
    [FormElementType.FIRST_NAME]: ["firstname", "first_name", "fname", "first"],
    [FormElementType.LAST_NAME]: ["lastname", "last_name", "lname", "last"],
    [FormElementType.PHONE]: ["phone", "tel"],
    [FormElementType.BIRTHDAY]: ["birth", "dob"],
    [FormElementType.ZIP]: ["zip", "postal", "code", "loc"],
    [FormElementType.NUMBER]: ["number", "num"],
    [FormElementType.TEXT]: ["search"],
  };

  static determineElementType(element: Element, selector: string, doc: Document = document): FormElementType {
    const tagName = element.tagName.toLowerCase();
    const type = element.getAttribute("type");

    // 基于标签的基础类型判断
    const baseType = this.getBaseTypeByTag(tagName, type);
    if (baseType !== FormElementType.TEXT) {
      return baseType;
    }

    // 基于标签文本的类型检测
    const labelType = this.detectTypeByLabel(selector, doc);
    if (labelType) return labelType;

    // 基于选择器的类型检测
    return this.detectTypeBySelector(selector);
  }

  private static getBaseTypeByTag(tagName: string, type: string | null): FormElementType {
    const typeMap: Record<string, FormElementType> = {
      select: FormElementType.SELECT,
      button: FormElementType.CLICK,
      textarea: FormElementType.TEXT,
    };

    if (typeMap[tagName]) {
      return typeMap[tagName];
    }

    if (tagName === "input" && type) {
      const inputTypeMap: Record<string, FormElementType> = {
        password: FormElementType.PASSWORD,
        email: FormElementType.EMAIL,
        number: FormElementType.NUMBER,
        checkbox: FormElementType.CLICK,
        radio: FormElementType.CLICK,
        button: FormElementType.CLICK,
      };
      return inputTypeMap[type] || FormElementType.TEXT;
    }

    return tagName === "input" ? FormElementType.TEXT : FormElementType.CLICK;
  }

  private static detectTypeByLabel(inputSelector: string, doc: Document = document): FormElementType | null {
    const labelText = LabelExtractor.getLabelText(inputSelector, doc);
    if (!labelText) return null;

    const lowerLabelText = labelText.toLowerCase();

    for (const [type, patterns] of Object.entries(this.labelPatterns)) {
      if (patterns.some(pattern => lowerLabelText.includes(pattern))) {
        return type as FormElementType;
      }
    }

    return null;
  }

  private static detectTypeBySelector(selector: string): FormElementType {
    const lowerSelector = selector.toLowerCase();

    for (const [type, patterns] of Object.entries(this.selectorPatterns)) {
      if (patterns.some(pattern => lowerSelector.includes(pattern))) {
        return type as FormElementType;
      }
    }

    return FormElementType.TEXT;
  }
}

// 导出配置类供外部使用
export { LabelExtractor, ElementTypeDetector };