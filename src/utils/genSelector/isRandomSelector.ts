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
    let upper = 0,
      lower = 0,
      letterCount = 0;
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
    if (!selector) return false;

    // 综合判断
    return hasRandomSubstring(selector) || hasConsecutiveDigits(selector);
  } catch (error) {
    console.error("isRandomSelector error: ", error, selector);
  }
}
