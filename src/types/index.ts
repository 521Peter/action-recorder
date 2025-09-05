// 表单元素类型枚举
export enum FormElementType {
  OPTIONS = "options",
  LINKS = "links",
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
  FILE = "file",
}

// 任务节点接口
export interface TaskNode {
  parentSelector?: string;
  selector: string;
  type: FormElementType;
  scroll?: boolean;
  waitForElement?: boolean;
}

// 任务配置接口
export interface TaskConfig {
  url: string;
  node: TaskNode[];
  formSelector: string;
  successSelector?: string; // 成功选择器
  successText?: string; // 成功文本
  iframeSelector?: string;
}
