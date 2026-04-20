import { generateSelectorPath } from "./generateSelectorPath";
import { isUniqueSelector } from "./isUniqueSelector";

// 尝试单一选择器
function trySelector(
  selector: string,
  path: string[],
  doc: Document | Element
): string | false {
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
  path: string[],
  doc: Document | Element
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

export { trySelector, trySelectors, tryCombinations };
