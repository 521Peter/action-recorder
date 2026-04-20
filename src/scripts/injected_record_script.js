var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function() {
  "use strict";
  function addClickFeedback(element) {
    const originalStyle = element.style.outline;
    element.style.outline = "2px solid #ff4444";
    setTimeout(() => {
      element.style.outline = originalStyle;
    }, 500);
  }
  function addRecordingIndicator() {
    const indicator = document.createElement("div");
    indicator.id = "click-recorder-indicator";
    indicator.innerHTML = "🔴 录制中";
    indicator.style.cssText = `
    position: fixed;
    top: 5px;
    left: 50%;
    transform: translate(-50%, 0);
    background: rgba(255, 68, 68, 0.95);
    color: white;
    padding: 6px 10px;
    border-radius: 20px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    font-weight: 500;
    z-index: 999999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    animation: pulse 2s infinite;
    pointer-events: none;
    white-space: nowrap;
  `;
    const style = document.createElement("style");
    style.textContent = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
  `;
    document.head.appendChild(style);
    document.body.appendChild(indicator);
  }
  function removeRecordingIndicator() {
    const indicator = document.getElementById("click-recorder-indicator");
    if (indicator) {
      indicator.remove();
    }
  }
  class IframeMonitor {
    constructor(clickHandler) {
      // 用于记录已经设置过监听的iframe，避免重复设置
      __publicField(this, "monitoredIframes", /* @__PURE__ */ new WeakSet());
      __publicField(this, "clickHandler");
      __publicField(this, "observer", null);
      this.clickHandler = clickHandler;
    }
    setupIframeListeners() {
      const iframes = document.getElementsByTagName("iframe");
      for (let iframe of iframes) {
        this.setupSingleIframe(iframe);
      }
    }
    setupSingleIframe(iframe) {
      if (this.monitoredIframes.has(iframe)) {
        return;
      }
      try {
        this.monitoredIframes.add(iframe);
        if (iframe.contentDocument) {
          this.attachListenerToIframeDocument(iframe);
        }
        const that = this;
        iframe.addEventListener("load", function() {
          try {
            that.attachListenerToIframeDocument(this);
          } catch (e) {
            console.warn("无法访问iframe内容:", e);
          }
        });
      } catch (e) {
        console.warn("无法访问iframe:", e);
      }
    }
    attachListenerToIframeDocument(iframe) {
      try {
        if (iframe.contentDocument) {
          iframe.contentDocument.addEventListener("click", this.clickHandler, true);
          console.log("已为iframe添加点击监听:", iframe.src);
        }
      } catch (error) {
        console.warn("无法为iframe文档添加监听:", error);
      }
    }
    // 监听DOM变化，检测新添加的iframe
    setupMutationObserver() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              if (element.tagName === "IFRAME") {
                this.setupSingleIframe(element);
              }
              const iframes = element.getElementsByTagName("iframe");
              for (let iframe of iframes) {
                this.setupSingleIframe(iframe);
              }
            }
          });
        });
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      return observer;
    }
    // 初始化
    initIframeMonitoring() {
      this.setupIframeListeners();
      this.observer = this.setupMutationObserver();
    }
    // 清理
    cleanup() {
      this.observer && this.observer.disconnect();
    }
  }
  var FormElementType = /* @__PURE__ */ ((FormElementType2) => {
    FormElementType2["OPTIONS"] = "options";
    FormElementType2["EMAIL"] = "email";
    FormElementType2["TEXT"] = "text";
    FormElementType2["CLICK"] = "click";
    FormElementType2["NUMBER"] = "number";
    FormElementType2["PASSWORD"] = "password";
    FormElementType2["NAME"] = "name";
    FormElementType2["FIRST_NAME"] = "firstName";
    FormElementType2["LAST_NAME"] = "lastName";
    FormElementType2["PHONE"] = "phone";
    FormElementType2["BIRTHDAY"] = "birthday";
    FormElementType2["ZIP"] = "zip";
    FormElementType2["SELECT"] = "select";
    FormElementType2["CITY"] = "city";
    FormElementType2["STATE"] = "state";
    FormElementType2["ADDRESS"] = "address";
    FormElementType2["DIALOG"] = "dialog";
    FormElementType2["SUBMIT"] = "submit";
    FormElementType2["SUCCESS_WRAP"] = "successWrap";
    return FormElementType2;
  })(FormElementType || {});
  class LabelExtractor {
    static getLabelText(inputSelector, doc = document) {
      const input = doc.querySelector(inputSelector);
      if (!input) return "";
      const strategies = [
        () => this.getLabelByFor(input, doc),
        () => this.getLabelByParent(input),
        () => this.getLabelBySibling(input),
        () => this.getLabelByParentSibling(input),
        () => this.getPlaceholderAsLabel(input)
      ];
      for (const strategy of strategies) {
        const label = strategy();
        if (label) return label;
      }
      return "";
    }
    static getLabelByFor(input, doc) {
      if (!input.id) return "";
      const labelByFor = doc.querySelector(
        `label[for="${input.id}"]`
      );
      return (labelByFor == null ? void 0 : labelByFor.innerText.trim()) || "";
    }
    static getLabelByParent(input) {
      var _a;
      const parentLabel = (_a = input.parentElement) == null ? void 0 : _a.closest(
        "label"
      );
      return (parentLabel == null ? void 0 : parentLabel.innerText.trim()) || "";
    }
    static getLabelBySibling(input) {
      var _a;
      const siblings = ((_a = input.parentElement) == null ? void 0 : _a.children) || [];
      for (const sibling of Array.from(siblings)) {
        if (sibling.tagName === "LABEL") {
          return sibling.innerText.trim();
        }
      }
      return "";
    }
    static getLabelByParentSibling(input) {
      var _a;
      const parent = input.parentElement;
      const parentSiblings = ((_a = parent == null ? void 0 : parent.parentElement) == null ? void 0 : _a.children) || [];
      for (const sibling of Array.from(parentSiblings)) {
        if (sibling !== parent && sibling.tagName === "LABEL") {
          return sibling.innerText.trim();
        }
      }
      return "";
    }
    static getPlaceholderAsLabel(input) {
      return input.placeholder || "";
    }
  }
  class ElementTypeDetector {
    static determineElementType(element, selector, doc = document) {
      const tagName = element.tagName.toLowerCase();
      const type = element.getAttribute("type");
      const baseType = this.getBaseTypeByTag(tagName, type);
      if (baseType !== FormElementType.TEXT) {
        return baseType;
      }
      const labelType = this.detectTypeByLabel(selector, doc);
      if (labelType) return labelType;
      return this.detectTypeBySelector(selector);
    }
    static getBaseTypeByTag(tagName, type) {
      const typeMap = {
        select: FormElementType.SELECT,
        button: FormElementType.CLICK,
        textarea: FormElementType.TEXT
      };
      if (typeMap[tagName]) {
        return typeMap[tagName];
      }
      if (tagName === "input" && type) {
        const inputTypeMap = {
          password: FormElementType.PASSWORD,
          email: FormElementType.EMAIL,
          number: FormElementType.NUMBER,
          checkbox: FormElementType.CLICK,
          radio: FormElementType.CLICK,
          button: FormElementType.CLICK,
          submit: FormElementType.SUBMIT
        };
        return inputTypeMap[type] || FormElementType.TEXT;
      }
      return tagName === "input" ? FormElementType.TEXT : FormElementType.CLICK;
    }
    static detectTypeByLabel(inputSelector, doc = document) {
      const labelText = LabelExtractor.getLabelText(inputSelector, doc);
      if (!labelText) return null;
      const lowerLabelText = labelText.toLowerCase();
      for (const [type, patterns] of Object.entries(this.labelPatterns)) {
        if (patterns.some((pattern) => lowerLabelText.includes(pattern))) {
          return type;
        }
      }
      return null;
    }
    static detectTypeBySelector(selector) {
      const lowerSelector = selector.toLowerCase();
      for (const [type, patterns] of Object.entries(this.selectorPatterns)) {
        if (patterns.some((pattern) => lowerSelector.includes(pattern))) {
          return type;
        }
      }
      return FormElementType.TEXT;
    }
  }
  __publicField(ElementTypeDetector, "labelPatterns", {
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
    [FormElementType.SUBMIT]: ["submit"]
  });
  __publicField(ElementTypeDetector, "selectorPatterns", {
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
    [FormElementType.SUBMIT]: ["submit"]
  });
  function getAttributes(el, attributesToIgnore = ["id", "class", "length"]) {
    const { attributes } = el;
    const attrs = [...attributes];
    return attrs.reduce((sum, next) => {
      if (!(attributesToIgnore.indexOf(next.nodeName) > -1)) {
        sum.push(`[${next.nodeName}="${next.value}"]`);
      }
      return sum;
    }, []);
  }
  function getClasses(el) {
    var _a;
    if (!el.hasAttribute("class")) {
      return [];
    }
    try {
      let classList = Array.prototype.slice.call(el.classList);
      return classList.filter(
        (item) => !/^[a-z_-][a-z\d_-]*$/i.test(item) ? null : item
      );
    } catch (e) {
      let className = (_a = el.getAttribute("class")) != null ? _a : "";
      className = className.trim().replace(/\s+/g, " ");
      return className.split(" ");
    }
  }
  function getClassSelectors$1(el) {
    const classList = getClasses(el).filter(Boolean);
    return classList.map((cl) => `.${cl}`);
  }
  function kCombinations(result, items, data, start, end, index, k) {
    if (index === k) {
      result.push(data.slice(0, index).join(""));
      return;
    }
    for (let i = start; i <= end && end - i + 1 >= k - index; ++i) {
      data[index] = items[i];
      kCombinations(result, items, data, i + 1, end, index + 1, k);
    }
  }
  function getCombinations(items, k) {
    const result = [], n = items.length, data = [];
    for (var l = 1; l <= k; ++l) {
      kCombinations(result, items, data, 0, n - 1, 0, l);
    }
    return result;
  }
  function getID(el) {
    const id = el.getAttribute("id");
    if (id !== null && id !== "") {
      return id.match(/(?:^\d|:)/) ? `[id="${id}"]` : "#" + id;
    }
    return null;
  }
  function getNthChild(element) {
    let counter = 0;
    let k;
    let sibling;
    const { parentNode } = element;
    if (Boolean(parentNode)) {
      const { childNodes } = parentNode;
      const len = childNodes.length;
      for (k = 0; k < len; k++) {
        sibling = childNodes[k];
        if (isElement(sibling)) {
          counter++;
          if (sibling === element) {
            return `:nth-child(${counter})`;
          }
        }
      }
    }
    return null;
  }
  function getParents(el) {
    const parents = [];
    let currentElement = el;
    while (isElement(currentElement)) {
      parents.push(currentElement);
      currentElement = currentElement.parentNode;
    }
    return parents;
  }
  function getTag(el) {
    return el.tagName.toLowerCase().replace(/:/g, "\\:");
  }
  function getAllSelectors(el, selectors, attributesToIgnore) {
    const funcs = {
      Tag: getTag,
      NthChild: getNthChild,
      Attributes: (elem) => getAttributes(elem, attributesToIgnore),
      Class: getClassSelectors$1,
      ID: getID
    };
    return selectors.reduce(
      (res, next) => {
        res[next] = funcs[next](el);
        return res;
      },
      {}
    );
  }
  function testUniqueness(element, selector) {
    var _a;
    const { parentNode } = element;
    const elements = (_a = parentNode == null ? void 0 : parentNode.querySelectorAll(selector)) != null ? _a : [];
    return elements.length === 1 && elements[0] === element;
  }
  function getFirstUnique(element, selectors) {
    var _a;
    return (_a = selectors.find((selector) => testUniqueness(element, selector))) != null ? _a : null;
  }
  function getUniqueCombination(element, items, tag) {
    let combinations = getCombinations(items, 3), firstUnique = getFirstUnique(element, combinations);
    if (Boolean(firstUnique)) {
      return firstUnique;
    }
    if (Boolean(tag)) {
      combinations = combinations.map((combination) => tag + combination);
      firstUnique = getFirstUnique(element, combinations);
      if (Boolean(firstUnique)) {
        return firstUnique;
      }
    }
    return null;
  }
  function getUniqueSelector(element, selectorTypes, attributesToIgnore, excludeRegex) {
    let foundSelector;
    const elementSelectors = getAllSelectors(
      element,
      selectorTypes,
      attributesToIgnore
    );
    if (excludeRegex && excludeRegex instanceof RegExp) {
      elementSelectors.ID = excludeRegex.test(elementSelectors.ID) ? null : elementSelectors.ID;
      elementSelectors.Class = elementSelectors.Class ? elementSelectors.Class.filter(
        (className) => !excludeRegex.test(className)
      ) : null;
    }
    for (let selectorType of selectorTypes) {
      const { ID, Tag, Class: Classes, Attributes, NthChild } = elementSelectors;
      switch (selectorType) {
        case "ID":
          if (Boolean(ID) && testUniqueness(element, ID)) {
            return ID;
          }
          break;
        case "Tag":
          if (Boolean(Tag) && testUniqueness(element, Tag)) {
            return Tag;
          }
          break;
        case "Class":
          if (Boolean(Classes) && Classes.length) {
            foundSelector = getUniqueCombination(
              element,
              Classes,
              Tag
            );
            if (foundSelector) {
              return foundSelector;
            }
          }
          break;
        case "Attributes":
          if (Boolean(Attributes) && Attributes.length) {
            foundSelector = getUniqueCombination(
              element,
              Attributes,
              Tag
            );
            if (foundSelector) {
              return foundSelector;
            }
          }
          break;
        case "NthChild":
          if (Boolean(NthChild)) {
            return NthChild;
          }
          break;
      }
    }
    return "*";
  }
  function generateSelector(el, options = {}) {
    const {
      selectorTypes = ["ID", "Class", "Tag", "NthChild"],
      attributesToIgnore = ["id", "class", "length"],
      excludeRegex = null,
      scope
    } = options;
    const allSelectors = [];
    const parents = getParents(el);
    for (let elem of parents) {
      const selector = getUniqueSelector(
        elem,
        selectorTypes,
        attributesToIgnore,
        excludeRegex
      );
      if (Boolean(selector)) {
        allSelectors.push(selector);
      }
    }
    const selectors = [];
    for (let it of allSelectors) {
      selectors.unshift(it);
      const selector = selectors.join(" > ");
      if (isUnique(el, selector, scope)) {
        return selector;
      }
    }
    return "";
  }
  function isElement(el) {
    let isElem;
    if (typeof HTMLElement === "object") {
      isElem = el instanceof HTMLElement;
    } else {
      isElem = !!el && typeof el === "object" && el.nodeType === 1 && typeof el.nodeName === "string";
    }
    return isElem;
  }
  function isUnique(el, selector, scope) {
    if (!Boolean(selector)) return false;
    const elems = (scope != null ? scope : el.ownerDocument).querySelectorAll(selector);
    return elems.length === 1 && elems[0] === el;
  }
  const method = [
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH"
  ];
  function isRandomSelector(selector) {
    function hasRandomSubstring(str) {
      const substrings = str.match(/[a-zA-Z0-9]{5,}/g) || [];
      for (const substr of substrings) {
        if (/([a-zA-Z]\d+[a-zA-Z])|(\d{3,})|(^\d)/.test(substr)) {
          return true;
        }
        if (isMixedCaseRandom(substr)) {
          return true;
        }
        if (substr.length >= 8 && !/[aeiouAEIOU]/.test(substr)) return true;
      }
      return false;
    }
    function isMixedCaseRandom(str) {
      let upper = 0, lower = 0, letterCount = 0;
      for (const c of str) {
        if (!/^[a-zA-Z]$/.test(c)) continue;
        letterCount++;
        if (c === c.toUpperCase() && c !== c.toLowerCase()) upper++;
        if (c === c.toLowerCase() && c !== c.toUpperCase()) lower++;
      }
      return upper >= Math.round(letterCount / 2) - 1 && lower >= 1;
    }
    function hasConsecutiveDigits(str) {
      return /\d{3,}/.test(str);
    }
    try {
      if (!selector) return false;
      return hasRandomSubstring(selector) || hasConsecutiveDigits(selector);
    } catch (error) {
      console.error("isRandomSelector error: ", error, selector);
    }
  }
  function getAttributeSelectors(element) {
    const validAttributes = Array.from(element.attributes).filter(({ name, value }) => {
      const excludeNames = [
        "data-src",
        "data-action",
        "data-reg",
        "data-error",
        "data-regerror",
        "data-color",
        "data-loading",
        "data-app-version",
        "style",
        "required",
        "value",
        "disabled",
        "class",
        "id",
        "lang"
      ];
      const isEventAttribute = name.startsWith("on");
      if (/^\d+$/.test(name) || /^\d+$/.test(value) || name.startsWith("data-v-") || excludeNames.includes(name) || isEventAttribute || name.length >= 20 || isRandomSelector(value) || value.includes("true") || value.includes("false") || method.includes(value)) {
        return false;
      }
      return true;
    }).map(({ name, value }) => {
      if (!value || value.length > 40) {
        return `[${name}]`;
      }
      if (value.startsWith(" ") || value.endsWith(" ") || value.startsWith("\n") || value.endsWith("\n")) {
        return `[${name}*='${value.trim()}']`;
      }
      if (value.startsWith("{") || value.startsWith("[")) {
        return `[${name}='${value.replace(/'/g, "\\'")}']`;
      }
      return `[${name}='${value}']`;
    }).filter((selector) => selector !== null).sort((a, b) => a.length - b.length);
    return validAttributes;
  }
  function getPatternSelector(name, value) {
    if (!value || value.length < 3) return null;
    const prefixMatch = value.match(/^([a-zA-Z_.]+)[-_]\d+/);
    if (prefixMatch && prefixMatch[1].length >= 3 && !method.includes(prefixMatch[1])) {
      const result = `[${name}^="${prefixMatch[1]}"]`;
      if (!isRandomSelector(result)) return result;
    }
    const suffixMatch = value.match(/^\d+[-_]([a-zA-Z_]+)$/);
    if (suffixMatch && suffixMatch[1].length >= 3 && !method.includes(suffixMatch[1])) {
      const result = `[${name}$="${suffixMatch[1]}"]`;
      if (!isRandomSelector(result)) return result;
    }
    const priorityWords = [
      "textarea",
      "email",
      "password",
      "submit",
      "cancel",
      "save",
      "delete",
      "edit",
      "add",
      "remove",
      "button",
      "input",
      "form",
      "field",
      "text",
      "name",
      "modal",
      "container",
      "content",
      "btn"
    ];
    for (const word of priorityWords) {
      const lowerValue = value.toLowerCase();
      if (lowerValue.includes(word) && value.length > word.length + 2) {
        const wordIndex = lowerValue.indexOf(word);
        if (wordIndex !== -1) {
          const originalWord = value.substring(
            wordIndex,
            wordIndex + word.length
          );
          const result = `[${name}*="${originalWord}"]`;
          if (!isRandomSelector(result)) return result;
        }
      }
    }
    return null;
  }
  function isInvalidClass(className) {
    const patterns = [
      /^[whpmbft]-/,
      // 常见原子类前缀
      /^(flex|grid|gap|items|justify|bg|body|px|border|py|px|pt|pl|pr|pb|my|mx|mt|mb|ml|mr|font|outline|grow|col)-/,
      /(flex|grid|relative|absolute|fixed|sticky|static|hover)/,
      /(focus|undefined|\!)/i,
      /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g,
      /^\d/
    ];
    return patterns.some((pattern) => pattern.test(className));
  }
  function getClassSelectors(element) {
    var _a;
    if (!element.className || typeof element.className !== "string") return [];
    const classSelectors = [];
    const classes = element.className.trim().split(/\s+/);
    for (const cls of classes) {
      if (!cls || cls.length > 50) continue;
      if (!isInvalidClass(cls) && !isRandomSelector(cls)) {
        classSelectors.push(`.${cls.replace(/:/g, "\\:")}`);
      } else if (isRandomSelector(cls) && cls.length > 5) {
        const patternSelector = (_a = getPatternSelector("class", cls)) != null ? _a : "";
        patternSelector && classSelectors.push(patternSelector);
      }
    }
    return classSelectors.sort((a, b) => a.length - b.length);
  }
  function escapeStr(str) {
    return str.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
  }
  function getIdSelector(element) {
    var _a;
    const { id } = element;
    if (!id || typeof id !== "string" || /^\d/.test(id) || /^-/.test(id) || id.includes("$")) {
      return "";
    }
    if (!isRandomSelector(id)) {
      return `#${escapeStr(id)}`;
    } else if (isRandomSelector(id) && id.length > 5) {
      const patternSelector = (_a = getPatternSelector("id", id)) != null ? _a : "";
      return patternSelector;
    }
    return "";
  }
  function isUniqueSelector(selector, doc) {
    const elements = doc.querySelectorAll(selector);
    return elements.length === 1;
  }
  function generateSelectorPath(path) {
    const depth = 3;
    if (path.length <= depth) return path.join(" > ");
    let headSelector = path[0];
    let tailSelector = path[path.length - 1];
    let selectArr = [];
    for (let i = 1; i < path.length - 1; i++) {
      if (selectArr.length >= depth - 2) break;
      let curSelector = path[i];
      selectArr.push(curSelector);
    }
    return [headSelector, ...selectArr, tailSelector].join(" ");
  }
  function trySelector(selector, path, doc) {
    if (!selector) return false;
    path.unshift(selector);
    const fullSelector = generateSelectorPath(path);
    if (isUniqueSelector(fullSelector, doc)) {
      return fullSelector;
    }
    path.shift();
    return false;
  }
  function trySelectors(tagName, selectors, path, doc) {
    for (const selector of selectors) {
      const result = trySelector(tagName + selector, path, doc);
      if (result) return result;
    }
    return false;
  }
  function tryCombinations(tagName, selectors1, selectors2, path, doc) {
    for (let i = 0; i < selectors1.length; i++) {
      for (let j = i + 1; j < selectors2.length; j++) {
        const combined = tagName + selectors1[i] + selectors2[j];
        const result = trySelector(combined, path, doc);
        if (result) return result;
      }
    }
    return false;
  }
  function generateUniqueSelector(element, scope) {
    var _a;
    if (!element) {
      return "";
    }
    let currentDoc = scope != null ? scope : (_a = element.ownerDocument) == null ? void 0 : _a.documentElement;
    try {
      const idSelector = getIdSelector(element);
      if (idSelector && isUniqueSelector(idSelector, currentDoc)) {
        return idSelector;
      }
      let path = [];
      let current = element;
      while (current && current !== currentDoc) {
        const tagName = current.tagName.toLowerCase();
        const attributes = getAttributeSelectors(current);
        const classes = getClassSelectors(current);
        const idSelector2 = getIdSelector(current);
        const uniqueSelector = idSelector2 && trySelector(tagName + idSelector2, path, currentDoc) || trySelectors(tagName, attributes, path, currentDoc) || trySelectors(tagName, classes, path, currentDoc) || tryCombinations(tagName, attributes, attributes, path, currentDoc) || tryCombinations(tagName, attributes, classes, path, currentDoc) || tryCombinations(tagName, classes, classes, path, currentDoc);
        if (uniqueSelector) {
          return uniqueSelector;
        }
        const shortestAttr = attributes[0] || "";
        const shortestClass = classes[0] || "";
        let fallbackSelector = tagName;
        if (idSelector2) {
          fallbackSelector += idSelector2;
        } else if (shortestAttr && shortestClass) {
          fallbackSelector += shortestAttr + shortestClass;
        } else if (shortestAttr) {
          fallbackSelector += shortestAttr;
        } else if (shortestClass) {
          fallbackSelector += shortestClass;
        }
        path.unshift(fallbackSelector);
        current = current.parentElement;
      }
      return generateSelector(element, {
        excludeRegex: /\d{2,}/,
        scope: currentDoc
      });
    } catch (error) {
      console.error("生成选择器失败:", error, element);
      return "";
    }
  }
  function findParentForm(element) {
    let current = element;
    const ownerDocument = element.ownerDocument || document;
    while (current && current !== ownerDocument.documentElement) {
      if (current.tagName.toLowerCase() === "form") {
        const form = current;
        const formSelector = generateUniqueSelector(
          form,
          ownerDocument.documentElement
        );
        return {
          formSelector,
          form
        };
      }
      current = current.parentElement;
    }
    return null;
  }
  function findNonSvgParent(element) {
    let current = element;
    while (current) {
      const isSvgElement = current.tagName.toLowerCase() === "svg" || current.namespaceURI === "http://www.w3.org/2000/svg" || current.ownerSVGElement;
      if (!isSvgElement) {
        return current;
      }
      const parent = current.parentElement;
      if (!parent) {
        break;
      }
      current = parent;
    }
    return element;
  }
  function findFormControlEle(element, maxDepth = 3) {
    const tagName = element.tagName.toLowerCase();
    if (tagName === "input" || tagName === "select" || tagName === "textarea") {
      return element;
    }
    if (maxDepth <= 0) {
      return null;
    }
    for (const child of element.children) {
      const found = findFormControlEle(child, maxDepth - 1);
      if (found) {
        return found;
      }
    }
    return null;
  }
  function getIframeSelector(element) {
    if (element.tagName.toLowerCase() === "iframe") {
      return generateUniqueSelector(element);
    }
    let iframeElement = null;
    if (element.ownerDocument !== document) {
      const iframeWindows = findIframeWindows();
      for (const iframeWin of iframeWindows) {
        if (iframeWin.document === element.ownerDocument) {
          iframeElement = iframeWin.frameElement;
          break;
        }
      }
    }
    if (iframeElement) return generateUniqueSelector(iframeElement);
    return null;
  }
  function findIframeWindows() {
    const iframeWindows = [];
    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
      try {
        if (iframe.contentWindow) {
          iframeWindows.push(iframe.contentWindow);
        }
      } catch (e) {
        console.log("无法访问跨域 iframe 的内容:", e);
      }
    }
    return iframeWindows;
  }
  class Handler {
    constructor() {
      __publicField(this, "scrollTimeout", null);
      __publicField(this, "lastScrollPosition", { top: 0, left: 0 });
      __publicField(this, "hasRecordedScrollSinceLastClick", false);
      __publicField(this, "clickHandler", (event) => {
        var _a, _b;
        let target = event.target;
        if (!target) return;
        const iframeSelector = getIframeSelector(target);
        const isSvgElement = target.tagName.toLowerCase() === "svg" || target.namespaceURI === "http://www.w3.org/2000/svg" || target.ownerSVGElement;
        if (isSvgElement) {
          const nonSvgParent = findNonSvgParent(target);
          if (nonSvgParent !== target) {
            target = nonSvgParent;
            console.log("检测到SVG相关元素，使用非SVG父元素作为目标:", target);
          }
        }
        const formControlEle = findFormControlEle(target);
        if (formControlEle) {
          target = formControlEle;
          console.log("找到内部表单控件元素，使用该元素作为目标:", target);
        }
        const formInfo = findParentForm(target);
        const selector = (formInfo == null ? void 0 : formInfo.form) ? generateUniqueSelector(target, formInfo == null ? void 0 : formInfo.form) : generateUniqueSelector(target);
        console.warn("selector", selector);
        let text = "";
        if (target.tagName.toLowerCase() === "a" || target.tagName.toLowerCase() === "button") {
          text = ((_a = target.textContent) == null ? void 0 : _a.trim()) || "";
        } else if (target.tagName.toLowerCase() === "input") {
          const input = target;
          if (input.type === "button" || input.type === "submit") {
            text = input.value || input.placeholder || "";
          }
        } else {
          text = ((_b = target.textContent) == null ? void 0 : _b.trim()) || "";
        }
        let elementType = ElementTypeDetector.determineElementType(
          target,
          selector
        );
        let tagName = target.tagName.toLowerCase();
        if (tagName === "button") {
          const dialogKeywords = ["accept", "dialog", "close", "cookie", "allow"];
          if (dialogKeywords.some(
            (keyword) => selector.toLowerCase().includes(keyword)
          )) {
            elementType = FormElementType.DIALOG;
          } else if (formInfo == null ? void 0 : formInfo.form) {
            elementType = FormElementType.SUBMIT;
          }
        }
        const label = LabelExtractor.getLabelText(selector);
        const currentUrl = window.location.href;
        window.postMessage(
          {
            type: "ELEMENT_CLICKED",
            data: {
              selector,
              text,
              tagName,
              className: target.className,
              id: target.id,
              elementType,
              label,
              formSelector: (formInfo == null ? void 0 : formInfo.formSelector) || null,
              url: currentUrl,
              iframeSelector
            }
          },
          "*"
        );
        this.hasRecordedScrollSinceLastClick = false;
        addClickFeedback(target);
      });
      __publicField(this, "scrollHandler", () => {
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }
        this.scrollTimeout = window.setTimeout(() => {
          const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
          const currentScrollLeft = window.scrollX || document.documentElement.scrollLeft;
          if ((currentScrollTop !== this.lastScrollPosition.top || currentScrollLeft !== this.lastScrollPosition.left) && !this.hasRecordedScrollSinceLastClick) {
            window.postMessage(
              {
                type: "SCROLL_DETECTED",
                data: {
                  scrollTop: currentScrollTop,
                  scrollLeft: currentScrollLeft
                }
              },
              "*"
            );
            this.lastScrollPosition = {
              top: currentScrollTop,
              left: currentScrollLeft
            };
            this.hasRecordedScrollSinceLastClick = true;
          }
        }, 150);
      });
    }
    // 清除状态
    cleanup() {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = null;
      }
      this.lastScrollPosition = { top: 0, left: 0 };
      this.hasRecordedScrollSinceLastClick = false;
    }
    // 更新滚动状态
    initScrollState(newPosition) {
      this.lastScrollPosition = newPosition;
    }
  }
  let isRecording = false;
  const handler = new Handler();
  const iframeMonitor = new IframeMonitor(handler.clickHandler);
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type === "START_RECORDING") {
      startRecording();
    } else if (event.data.type === "STOP_RECORDING") {
      stopRecording();
    }
  });
  function startRecording() {
    if (isRecording) return;
    isRecording = true;
    iframeMonitor.initIframeMonitoring();
    handler.initScrollState({
      top: window.scrollY || document.documentElement.scrollTop,
      left: window.scrollX || document.documentElement.scrollLeft
    });
    document.addEventListener("click", handler.clickHandler, true);
    window.addEventListener("scroll", handler.scrollHandler, { passive: true });
    addRecordingIndicator();
    console.log("页面点击和滚动录制已开始");
  }
  function stopRecording() {
    if (!isRecording) return;
    isRecording = false;
    document.removeEventListener("click", handler.clickHandler, true);
    window.removeEventListener("scroll", handler.scrollHandler);
    handler.cleanup();
    iframeMonitor.cleanup();
    removeRecordingIndicator();
    console.log("页面点击和滚动录制已停止");
  }
})();
