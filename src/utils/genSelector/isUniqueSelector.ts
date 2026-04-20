// 是否是唯一的选择器
export function isUniqueSelector(
  selector: string,
  doc: Element | Document
): boolean {
  const elements = doc.querySelectorAll(selector);
  return elements.length === 1;
}
