// 表单元素类型枚举
export enum FormElementType {
  OPTIONS = "options",
  EMAIL = "email",
  TEXT = "text",
  CLICK = "click",
  NUMBER = "number",
  PASSWORD = "password",
  NAME = "name",
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
  PHONE = "phone",
  BIRTHDAY = "birthday",
  ZIP = "zip",
  SELECT = "select",
  CITY = "city",
  STATE = "state",
  ADDRESS = "address",
  DIALOG = "dialog",
  SUBMIT = "submit",
  SUCCESS_WRAP = "successWrap",
}

export interface Node {
  type: "click" | "scroll";
  selector?: string;
  text?: string;
  tagName?: string;
  className?: string;
  id?: string;
  elementType?: FormElementType;
  label?: string;
  formSelector?: string | null;
  scrollTop?: number;
  scrollLeft?: number;
  url: string;
  waitForElement?: boolean;
  scroll?: boolean;
  // 页面是否刷新
  isPageReloaded?: boolean;
  options?: {
    newSearchParams?: Record<string, string> | null;
    newHash?: string | null;
  };
  iframeSelector?: string | null;
}
