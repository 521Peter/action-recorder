import { method } from "./constant";
import { isRandomSelector } from "./isRandomSelector";

// 检测属性值中的稳定部分并生成模式匹配选择器
export function getPatternSelector(name: string, value: string): string | null {
  if (!value || value.length < 3) return null;

  // 检测前缀稳定的情况（如 "first_name-1615234155262"）
  // 匹配字母、下划线组成的前缀，后面跟连字符和数字
  const prefixMatch = value.match(/^([a-zA-Z_.]+)[-_]\d+/);
  if (
    prefixMatch &&
    prefixMatch[1].length >= 3 &&
    !method.includes(prefixMatch[1])
  ) {
    const result = `[${name}^="${prefixMatch[1]}"]`;
    if (!isRandomSelector(result)) return result;
  }

  // 检测后缀稳定的情况（如 "123456-submit_btn"）
  const suffixMatch = value.match(/^\d+[-_]([a-zA-Z_]+)$/);
  if (
    suffixMatch &&
    suffixMatch[1].length >= 3 &&
    !method.includes(suffixMatch[1])
  ) {
    const result = `[${name}$="${suffixMatch[1]}"]`;
    if (!isRandomSelector(result)) return result;
  }

  // 检测特定的常见单词模式，优先级从高到低
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
    "btn",
  ];

  for (const word of priorityWords) {
    const lowerValue = value.toLowerCase();
    if (lowerValue.includes(word) && value.length > word.length + 2) {
      // 找到单词在原始值中的位置，保持原始大小写
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
