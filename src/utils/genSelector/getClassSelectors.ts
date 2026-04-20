import { getPatternSelector } from "./getPatternSelector";
import { isInvalidClass } from "./isInvalidClass";
import { isRandomSelector } from "./isRandomSelector";

// 获取类名选择器
export function getClassSelectors(element: Element): string[] {
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
      const patternSelector = getPatternSelector("class", cls) ?? "";
      patternSelector && classSelectors.push(patternSelector);
    }
  }

  return classSelectors.sort((a, b) => a.length - b.length);
}
