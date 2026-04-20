import { getPatternSelector } from "./getPatternSelector";
import { isRandomSelector } from "./isRandomSelector";

// 转义字符串
function escapeStr(str: string) {
  return str.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

// 获取id选择器
export function getIdSelector(element: Element) {
  const { id } = element;
  if (
    !id ||
    typeof id !== "string" ||
    /^\d/.test(id) ||
    /^-/.test(id) ||
    id.includes("$")
  ) {
    return "";
  }

  // 如果 ID 不是随机的，直接使用
  if (!isRandomSelector(id)) {
    return `#${escapeStr(id)}`;
  }
  // 如果 ID 看起来是随机的，尝试生成模式匹配的属性选择器
  else if (isRandomSelector(id) && id.length > 5) {
    const patternSelector = getPatternSelector("id", id) ?? "";
    return patternSelector;
  }

  return "";
}
