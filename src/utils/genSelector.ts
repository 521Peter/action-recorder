// 是否是唯一的选择器
function isUniqueSelector(selector: string, doc: Element | Document): boolean {
  const elements = doc.querySelectorAll(selector);
  return elements.length === 1;
}

// 用于判断是否是随机生成的选择器
export function isRandomSelector(selector: string) {
  // 规则1: 检测长随机字母数字子串（长度≥6，含数字+字母 或 无元音）
  function hasRandomSubstring(str: string) {
    const substrings = str.match(/[a-zA-Z0-9]{5,}/g) || [];
    for (const substr of substrings) {
      // 条件1: 数字被字母包围（如 a1b）或连续数字长度≥3（如 abc123def）或以数字开头
      if (/([a-zA-Z]\d+[a-zA-Z])|(\d{3,})|(^\d)/.test(substr)) {
        return true;
      }

      // 条件2: 是无意义的混合大小写短串
      if (isMixedCaseRandom(substr)) {
        return true;
      }

      // 条件3: 长度≥8且不含元音
      if (substr.length >= 8 && !/[aeiouAEIOU]/.test(substr)) return true;
    }
    return false;
  }

  function isMixedCaseRandom(str: string) {
    // 统计大小写字母数量
    let upper = 0, lower = 0, letterCount = 0;
    for (const c of str) {
      // 跳过非字母
      if (!/^[a-zA-Z]$/.test(c)) continue;
      letterCount++;
      if (c === c.toUpperCase() && c !== c.toLowerCase()) upper++;
      if (c === c.toLowerCase() && c !== c.toUpperCase()) lower++;
    }
    // 有一半是大写且≥1小写
    return upper >= Math.round(letterCount / 2) - 1 && lower >= 1;
  }

  // 规则2: 检测连续3个或更多数字（如 #checkbox-625）
  function hasConsecutiveDigits(str: string) {
    return /\d{3,}/.test(str);
  }
  try {
    if (!selector) return false

    // 综合判断
    return (
      hasRandomSubstring(selector) ||
      hasConsecutiveDigits(selector)
    );
  } catch (error) {
    console.error('isRandomSelector error: ', error, selector)
  }
}

// 用于判断是否为非法类
function isInvalidClass(className: string): boolean {
  const patterns = [
    /^[whpmbft]-/, // 常见原子类前缀
    /^(flex|grid|gap|items|justify|bg|body|px|border|py|px|pt|pl|pr|pb|my|mx|mt|mb|ml|mr|font|outline|grow|col)-/,
    /(flex|grid|relative|absolute|fixed|sticky|static)/,
    /(focus|undefined|\!)/i,
    /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g,
    /^\d/,
  ];
  return (
    isRandomSelector(className) ||
    patterns.some((pattern) => pattern.test(className))
  );
}

// 检测属性值中的稳定部分并生成模式匹配选择器
function getPatternSelector(name: string, value: string): string | null {
  if (!value || value.length < 3) return null;

  // 检测前缀稳定的情况（如 "first_name-1615234155262"）
  // 匹配字母、下划线组成的前缀，后面跟连字符和数字
  const prefixMatch = value.match(/^([a-zA-Z_.]+)[-_]\d+/);
  if (prefixMatch && prefixMatch[1].length >= 3) {
    return `[${name}^="${prefixMatch[1]}"]`;
  }

  // 检测后缀稳定的情况（如 "123456-submit_btn"）
  const suffixMatch = value.match(/^\d+[-_]([a-zA-Z_]+)$/);
  if (suffixMatch && suffixMatch[1].length >= 3) {
    return `[${name}$="${suffixMatch[1]}"]`;
  }

  // 检测特定的常见单词模式，优先级从高到低
  const priorityWords = [
    'email', 'password', 'submit', 'cancel', 'save', 'delete', 'edit', 'add', 'remove',
    'button', 'input', 'form', 'field', 'text', 'name',
    'modal', 'container', 'content', 'btn'
  ];

  for (const word of priorityWords) {
    const lowerValue = value.toLowerCase();
    if (lowerValue.includes(word) && value.length > word.length + 2) {
      // 找到单词在原始值中的位置，保持原始大小写
      const wordIndex = lowerValue.indexOf(word);
      if (wordIndex !== -1) {
        const originalWord = value.substring(wordIndex, wordIndex + word.length);
        return `[${name}*="${originalWord}"]`;
      }
    }
  }

  // 检测中间稳定的情况，寻找被数字或特殊字符包围的有意义单词
  // 匹配形如 abc123_meaningful_word_456def 的模式
  const segments = value.split(/[0-9_-]+/).filter(seg => seg.length >= 4 && /^[a-zA-Z]+$/.test(seg));
  if (segments.length > 0) {
    // 选择最长的有意义片段
    const longestSegment = segments.reduce((a, b) => a.length > b.length ? a : b);
    return `[${name}*="${longestSegment}"]`;
  }

  return null;
}

// 获取有效的属性选择器
function getAttributeSelectors(element: Element): string[] {
  const validAttributes = Array.from(element.attributes)
    .filter(({ name, value }) => {
      // 排除一些不稳定或通用的属性
      const excludeNames = [
        "data-src",
        "data-action",
        "data-reg",
        "data-error",
        "data-regerror",
        "data-color",
        "data-loading",
        "data-app-version"
      ];
      if (
        /^\d+$/.test(name) ||
        /^\d+$/.test(value) ||
        name.startsWith("data-v-") ||
        excludeNames.includes(name) ||
        name.length >= 20 ||
        isRandomSelector(value) ||
        /\s/.test(value)
      ) {
        return false;
      }

      const includeNames = ["role", "aria-label", "name", "type", "href", "id", "class"];
      return name.startsWith("data-") || includeNames.includes(name);
    })
    .map(({ name, value }) => {
      if (!value || value.length > 40) {
        return `[${name}]`;
      }

      // 处理JSON类型的属性值
      if (value.startsWith("{") || value.startsWith("[")) {
        return `[${name}='${value.replace(/'/g, "\\'")}']`;
      }

      return `[${name}='${value}']`;
    })
    .filter(selector => selector !== null) // 过滤掉 null 值
    .sort((a, b) => a.length - b.length);
  return validAttributes;
}

// 获取类名选择器
function getClassSelectors(element: Element): string[] {
  if (!element.className || typeof element.className !== "string") return [];

  const classSelectors: string[] = [];
  const classes = element.className.trim().split(/\s+/);

  for (const cls of classes) {
    if (!cls || cls.length > 50) continue;

    // 如果类名有效且不是随机的，直接使用
    if (!isInvalidClass(cls) && !isRandomSelector(cls)) {
      classSelectors.push(`.${cls.replace(/:/g, "\\:")}`);
    }
    // 如果类名看起来是随机的，尝试生成模式匹配的属性选择器
    else if (isRandomSelector(cls) && cls.length > 5) {
      const patternSelector = getPatternSelector('class', cls);
      if (patternSelector) {
        classSelectors.push(patternSelector);
      }
    }
  }

  return classSelectors.sort((a, b) => a.length - b.length);
}

// 获取id选择器
function getIdSelector(element: Element) {
  const { id } = element;
  if (!id || typeof id !== "string" || /^\d/.test(id) || /^-/.test(id)) {
    return "";
  }

  // 如果 ID 不是随机的，直接使用
  if (!isRandomSelector(id)) {
    return `#${escapeStr(id)}`;
  }

  // 如果 ID 看起来是随机的，尝试生成模式匹配的属性选择器
  if (id.length > 5) {
    const patternSelector = getPatternSelector('id', id);
    if (patternSelector) {
      return patternSelector;
    }
  }

  return "";
}

// 生成选择器路径
function generateSelectorPath(path: string[]): string {
  const depth = 3;
  if (path.length <= depth) return path.join(" > ");

  let headSelector = path[0];
  let tailSelector = path[path.length - 1];
  let selectArr: string[] = [];
  for (let i = 1; i < path.length - 1; i++) {
    // 限制选择器路径的长度
    if (selectArr.length >= depth - 2) break;

    let curSelector = path[i];
    if (curSelector.includes(".") || curSelector.includes("data-")) {
      selectArr.push(curSelector);
    }
  }
  return [headSelector, ...selectArr, tailSelector].join(" ");
}

// 转义字符串
function escapeStr(str: string) {
  return str.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

// 尝试单一选择器
function trySelector(selector: string, path: string[], doc: Document | Element): string | false {
  if (!selector) return false;
  path.unshift(selector);
  const fullSelector = generateSelectorPath(path);
  if (isUniqueSelector(fullSelector, doc)) {
    return fullSelector;
  }
  path.shift();
  return false;
}

// 尝试单一属性或类名选择器
function trySelectors(
  tagName: string,
  selectors: string[],
  path: string[],
  doc: Document | Element
): string | false {
  for (const selector of selectors) {
    const result = trySelector(tagName + selector, path, doc);
    if (result) return result;
  }
  return false;
}

// 尝试属性或类名组合
function tryCombinations(
  tagName: string,
  selectors1: string[],
  selectors2: string[],
  path: string[]
  , doc: Document | Element
): string | false {
  for (let i = 0; i < selectors1.length; i++) {
    for (let j = i + 1; j < selectors2.length; j++) {
      const combined = tagName + selectors1[i] + selectors2[j];
      const result = trySelector(combined, path, doc);
      if (result) return result;
    }
  }
  return false;
}

// 生成唯一选择器的函数
function generateUniqueSelector(element: Element, scope?: Element): string {
  if (!element) {
    return "";
  }
  let currentDoc = scope ?? element.ownerDocument?.documentElement

  try {
    // 优先检查 ID
    const idSelector = getIdSelector(element);
    if (idSelector && isUniqueSelector(idSelector, currentDoc)) {
      return idSelector;
    }

    let path: string[] = [];
    let current: Element | null = element;

    while (current && current !== currentDoc) {
      const tagName = current.tagName.toLowerCase();
      const attributes = getAttributeSelectors(current);
      const classes = getClassSelectors(current);
      const idSelector = getIdSelector(current);

      // 尝试单一选择器（ID、属性、类名）
      const result =
        (idSelector && trySelector(tagName + idSelector, path, currentDoc)) ||
        trySelectors(tagName, attributes, path, currentDoc) ||
        trySelectors(tagName, classes, path, currentDoc) ||
        tryCombinations(tagName, attributes, attributes, path, currentDoc) ||
        tryCombinations(tagName, attributes, classes, path, currentDoc) ||
        tryCombinations(tagName, classes, classes, path, currentDoc);

      if (result) {
        return generateSelectorPath(path);
      }

      // 如果所有尝试失败，使用最短的属性或类名，或仅标签名
      const shortestAttr = attributes[0] || "";
      const shortestClass = classes[0] || "";
      let fallbackSelector = tagName;
      if (shortestAttr && shortestClass) {
        fallbackSelector += shortestAttr + shortestClass;
      } else if (shortestAttr) {
        fallbackSelector += shortestAttr;
      } else if (shortestClass) {
        fallbackSelector += shortestClass;
      }

      path.unshift(fallbackSelector);
      current = current.parentElement;
    }

    return "";
  } catch (error) {
    console.error("生成选择器失败:", error, element);
    return "";
  }
}

export { generateUniqueSelector };
