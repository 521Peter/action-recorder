// 生成选择器路径
export function generateSelectorPath(path: string[]): string {
  const depth = 3;
  if (path.length <= depth) return path.join(" > ");

  let headSelector = path[0];
  let tailSelector = path[path.length - 1];
  let selectArr: string[] = [];
  for (let i = 1; i < path.length - 1; i++) {
    // 限制选择器路径的长度
    if (selectArr.length >= depth - 2) break;
    let curSelector = path[i];
    selectArr.push(curSelector);
  }
  return [headSelector, ...selectArr, tailSelector].join(" ");
}
