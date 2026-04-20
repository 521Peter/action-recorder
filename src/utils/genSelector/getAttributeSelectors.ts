import { method } from "./constant";
import { isRandomSelector } from "./isRandomSelector";

// 获取有效的属性选择器
export function getAttributeSelectors(element: Element): string[] {
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
        "data-app-version",
        "style",
        "required",
        "value",
        "disabled",
        "class",
        "id",
        "lang",
      ];

      // 排除事件属性
      const isEventAttribute = name.startsWith("on");
      if (
        /^\d+$/.test(name) ||
        /^\d+$/.test(value) ||
        name.startsWith("data-v-") ||
        excludeNames.includes(name) ||
        isEventAttribute ||
        name.length >= 20 ||
        isRandomSelector(value) ||
        value.includes("true") ||
        value.includes("false") ||
        method.includes(value)
      ) {
        return false;
      }

      return true;
    })
    .map(({ name, value }) => {
      if (!value || value.length > 40) {
        return `[${name}]`;
      }

      // 如果开头或者结尾是空格/换行符
      if (
        value.startsWith(" ") ||
        value.endsWith(" ") ||
        value.startsWith("\n") ||
        value.endsWith("\n")
      ) {
        return `[${name}*='${value.trim()}']`;
      }

      // 处理JSON类型的属性值
      if (value.startsWith("{") || value.startsWith("[")) {
        return `[${name}='${value.replace(/'/g, "\\'")}']`;
      }

      return `[${name}='${value}']`;
    })
    .filter((selector) => selector !== null) // 过滤掉 null 值
    .sort((a, b) => a.length - b.length);
  return validAttributes;
}
