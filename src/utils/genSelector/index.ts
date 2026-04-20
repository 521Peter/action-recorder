import { generateSelector } from "./generateSelector";
import { getAttributeSelectors } from "./getAttributeSelectors";
import { getClassSelectors } from "./getClassSelectors";
import { getIdSelector } from "./getIdSelector";
import { isUniqueSelector } from "./isUniqueSelector";
import { tryCombinations, trySelector, trySelectors } from "./try";

// 生成唯一选择器的函数
function generateUniqueSelector(element: Element, scope?: Element): string {
  if (!element) {
    return "";
  }
  let currentDoc = scope ?? element.ownerDocument?.documentElement;

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
      const uniqueSelector =
        (idSelector && trySelector(tagName + idSelector, path, currentDoc)) ||
        trySelectors(tagName, attributes, path, currentDoc) ||
        trySelectors(tagName, classes, path, currentDoc) ||
        tryCombinations(tagName, attributes, attributes, path, currentDoc) ||
        tryCombinations(tagName, attributes, classes, path, currentDoc) ||
        tryCombinations(tagName, classes, classes, path, currentDoc);

      if (uniqueSelector) {
        return uniqueSelector;
      }

      // 如果所有尝试失败，使用最短的属性或类名，或仅标签名
      const shortestAttr = attributes[0] || "";
      const shortestClass = classes[0] || "";
      let fallbackSelector = tagName;
      if (idSelector) {
        fallbackSelector += idSelector;
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
      scope: currentDoc,
    });
  } catch (error) {
    console.error("生成选择器失败:", error, element);
    return "";
  }
}

export { generateUniqueSelector };
