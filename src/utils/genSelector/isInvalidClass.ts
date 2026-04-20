// 用于判断是否为非法类
export function isInvalidClass(className: string): boolean {
  const patterns = [
    /^[whpmbft]-/, // 常见原子类前缀
    /^(flex|grid|gap|items|justify|bg|body|px|border|py|px|pt|pl|pr|pb|my|mx|mt|mb|ml|mr|font|outline|grow|col)-/,
    /(flex|grid|relative|absolute|fixed|sticky|static|hover)/,
    /(focus|undefined|\!)/i,
    /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g,
    /^\d/,
  ];
  return patterns.some((pattern) => pattern.test(className));
}
