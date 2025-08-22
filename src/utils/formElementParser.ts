import { generateUniqueSelector } from "./genSelector";
import { FormElementType, FormElement, FormGroup, FormGroups } from "../types";

// 配置管理 
class FormElementConfig {
  // 表单元素类型的友好名称映射
  static readonly elementTypeLabels: Record<FormElementType, string> = {
    email: "电子邮件",
    text: "文本",
    click: "点击",
    number: "数字",
    password: "密码",
    name: "姓名",
    firstName: "名",
    lastName: "姓",
    phone: "电话",
    birthday: "生日",
    zip: "邮编",
    options: "选项",
    select: "下拉选择",
    city: "城市",
    links: "链接",
    state: "州",
    address: "地址",
    file: "文件",
  };

  // 获取元素类型对应的颜色
  static readonly colorMap: Record<FormElementType, string> = {
    email: "blue",
    password: "red",
    text: "gray",
    number: "purple",
    click: "orange",
    name: "teal",
    firstName: "teal",
    lastName: "teal",
    phone: "green",
    birthday: "pink",
    zip: "cyan",
    options: "yellow",
    select: "yellow",
    city: "green",
    links: "blue",
    state: "green",
    address: "green",
    file: "purple",
  };

  static getTypeColor(type: FormElementType): string {
    return this.colorMap[type] || "gray";
  }
}

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
        file: FormElementType.FILE,
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

// 元素序列化器 
class ElementSerializer {
  static serializeElement(el: FormElement): FormElement {
    return {
      type: el.type,
      selector: el.selector,
      tag: el.tag,
      attributes: el.attributes,
      rect: el.rect,
      position: {
        top: el.rect.top,
        left: el.rect.left,
        width: el.rect.width,
        height: el.rect.height,
      },
      iframeIndex: el.iframeIndex,
      parentSelector: el.parentSelector,
    };
  }

  static serializeFormGroups(formGroups: FormGroups): FormGroups {
    const serializedData: FormGroups = { forms: {} };

    for (const [formId, formGroup] of Object.entries(formGroups.forms)) {
      serializedData.forms[formId] = {
        name: formGroup.name,
        action: formGroup.action,
        method: formGroup.method,
        elements: formGroup.elements.map(el => this.serializeElement(el)),
        selector: formGroup.selector,
        iframeSelector: formGroup.iframeSelector,
      };
    }

    return serializedData;
  }
}

// 元素排序器 
class ElementSorter {
  static sortElementsByPosition(formGroups: FormGroups): void {
    for (const formGroup of Object.values(formGroups.forms)) {
      formGroup.elements.sort(this.compareElementPositions);
    }
  }

  private static compareElementPositions(a: FormElement, b: FormElement): number {
    const rectA = a.rect;
    const rectB = b.rect;

    // 如果两个元素垂直位置差距较小，优先按水平位置排序
    if (Math.abs(rectA.top - rectB.top) < 10) {
      return rectA.left - rectB.left;
    }

    return rectA.top - rectB.top;
  }
}

// iframe解析器
class IframeParser {
  private formGroups: FormGroups;
  private formCounter: number;

  constructor(formGroups: FormGroups, formCounter: number) {
    this.formGroups = formGroups;
    this.formCounter = formCounter;
  }

  parseAllIframes(): void {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe, index) => {
      try {
        this.parseIframeContent(iframe, index);
      } catch (error) {
        console.warn(`无法访问iframe内容 (索引: ${index}):`, error);
      }
    });
  }

  private parseIframeContent(iframe: HTMLIFrameElement, iframeIndex: number): void {
    const iframeDoc = this.getIframeDocument(iframe);
    if (!iframeDoc) return;

    // 解析iframe内的表单
    this.parseIframeForms(iframeDoc, iframeIndex, generateUniqueSelector(iframe));
  }

  private getIframeDocument(iframe: HTMLIFrameElement): Document | null {
    try {
      // 尝试访问iframe的contentDocument
      if (iframe.contentDocument) {
        return iframe.contentDocument;
      }

      // 尝试通过contentWindow访问
      if (iframe.contentWindow?.document) {
        return iframe.contentWindow.document;
      }

      return null;
    } catch (error) {
      // 跨域或其他安全限制
      return null;
    }
  }

  private parseIframeForms(iframeDoc: Document, iframeIndex: number, iframeSelector: string): void {
    const forms = iframeDoc.querySelectorAll("form");

    forms.forEach((form, formIndex) => {
      const formId = this.generateIframeFormId(iframeIndex, form, formIndex);

      this.formGroups.forms[formId] = {
        elements: [],
        name: this.getIframeFormName(form, iframeIndex, formIndex),
        action: form.getAttribute("action") || "",
        method: form.getAttribute("method") || "get",
        selector: generateUniqueSelector(form),
        iframeSelector: iframeSelector,
      };

      const formElements = form.querySelectorAll("input, button, select, textarea");
      formElements.forEach(element => {
        const parsedElement = this.parseIframeElement(element, form, iframeDoc, iframeIndex);
        if (parsedElement) {
          this.formGroups.forms[formId].elements.push(parsedElement);
        }
      });
    });
  }

  private parseIframeElement(element: Element, form: Element, iframeDoc: Document, iframeIndex: number): FormElement | null {
    const selector = generateUniqueSelector(element, form);
    if (!selector) return null;

    const type = ElementTypeDetector.determineElementType(element, selector, iframeDoc);
    const parentSelector = generateUniqueSelector(form);

    return {
      element: element,
      type: type,
      selector: selector,
      rect: element.getBoundingClientRect(),
      tag: element.tagName.toLowerCase(),
      attributes: this.getElementAttributes(element),
      iframeIndex: iframeIndex,
      parentSelector: parentSelector,
    };
  }

  private generateIframeFormId(iframeIndex: number, form: Element, formIndex: number): string {
    const formId = form.id || `form_${formIndex}`;
    return `iframe_${iframeIndex}_${formId}`;
  }

  private getIframeFormName(form: Element, iframeIndex: number, formIndex: number): string {
    const formName = form.getAttribute("name");
    const baseName = formName || `表单 ${formIndex + 1}`;
    return `iframe ${iframeIndex + 1} - ${baseName}`;
  }

  private getElementAttributes(element: Element): Record<string, string> {
    const attributes: Record<string, string> = {};
    for (const attr of Array.from(element.attributes)) {
      attributes[attr.name] = attr.value;
    }
    return attributes;
  }
}

// DOM观察器 
class DOMObserver {
  private observer: MutationObserver | null = null;
  private debounceTimer: number | null = null;
  private readonly debounceDelay = 500; // 防抖延迟

  constructor(private callback: () => void) { }

  start(): void {
    this.observer = new MutationObserver((mutations) => {
      const shouldReparse = mutations.some(mutation =>
        mutation.type === "childList" || mutation.type === "attributes"
      );

      if (shouldReparse) {
        this.debouncedCallback();
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "id"],
    });
  }

  private debouncedCallback(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      this.callback();
      this.debounceTimer = null;
    }, this.debounceDelay);
  }

  stop(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.observer?.disconnect();
    this.observer = null;
  }
}

// 主解析器类 
class FormElementParser {
  private formGroups: FormGroups;
  private formCounter: number;
  private domObserver: DOMObserver;

  constructor() {
    this.formGroups = { forms: {} };
    this.formCounter = 0;
    this.domObserver = new DOMObserver(() => this.parseFormElements());
  }

  init(): void {
    this.domObserver.start();
    this.parseFormElements(); // 初始解析一次
  }

  destroy(): void {
    this.domObserver.stop();
  }

  parseFormElements(): void {
    this.formGroups = { forms: {} };
    this.formCounter = 0;
    this.parseForms();
    this.parseIframes();
    this.parseNonFormElements();
    ElementSorter.sortElementsByPosition(this.formGroups);
    this.sendFormElementsToExtension();
  }

  private parseForms(): void {
    const forms = document.querySelectorAll("form");
    forms.forEach(form => this.parseForm(form));
  }

  private parseIframes(): void {
    const iframeParser = new IframeParser(this.formGroups, this.formCounter);
    iframeParser.parseAllIframes();
  }

  private parseNonFormElements(): void {
    const otherId = "non_form_elements";
    this.formGroups.forms[otherId] = {
      elements: [],
      name: "其他",
      action: "",
      method: "",
    };

    const nonFormElements = [
      ...Array.from(document.querySelectorAll('button:not(form button), input[type="button"]:not(form input), input[type="submit"]:not(form input)')),
      ...Array.from(document.querySelectorAll('input:not(form input):not([type="button"]):not([type="submit"])'))
    ];

    nonFormElements.forEach(element => {
      const parsedElement = this.parseElement(element);
      if (parsedElement) {
        this.formGroups.forms[otherId].elements.push(parsedElement);
      }
    });
  }

  private parseForm(form: HTMLElement): void {
    const formId = form.id || `form_${this.formCounter++}`;

    this.formGroups.forms[formId] = {
      elements: [],
      name: form.getAttribute("name") || formId,
      action: form.getAttribute("action") || "",
      method: form.getAttribute("method") || "get",
      selector: generateUniqueSelector(form),
    };

    const formElements = form.querySelectorAll("input, button, select, textarea");
    formElements.forEach(element => {
      const parsedElement = this.parseElement(element, form);
      if (parsedElement) {
        this.formGroups.forms[formId].elements.push(parsedElement);
      }
    });
  }

  private parseElement(element: Element, form?: Element): FormElement | null {
    const selector = generateUniqueSelector(element, form);
    if (!selector) return null;

    const type = ElementTypeDetector.determineElementType(element, selector);
    const parentSelector = form ? generateUniqueSelector(form) : undefined;

    return {
      element: element,
      type: type,
      selector: selector,
      rect: element.getBoundingClientRect(),
      tag: element.tagName.toLowerCase(),
      attributes: this.getElementAttributes(element),
      parentSelector: parentSelector,
    };
  }

  private getElementAttributes(element: Element): Record<string, string> {
    const attributes: Record<string, string> = {};
    for (const attr of Array.from(element.attributes)) {
      attributes[attr.name] = attr.value;
    }
    return attributes;
  }

  private sendFormElementsToExtension(): void {
    const serializedData = ElementSerializer.serializeFormGroups(this.formGroups);
    const totalElements = Object.values(serializedData.forms)
      .reduce((sum, form) => sum + form.elements.length, 0);

    chrome.runtime.sendMessage({
      action: "formElementsUpdated",
      formElements: serializedData,
      totalElements: totalElements,
    });
  }
}

// 导出配置类供外部使用
export { FormElementConfig, FormElementParser };