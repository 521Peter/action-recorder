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

// 表单元素接口
export interface FormElement {
  element?: Element;
  type: FormElementType;
  selector: string;
  rect: DOMRect;
  tag: string;
  attributes: Record<string, string>;
  position?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  iframeIndex?: number; // iframe索引，如果元素在iframe中
  parentSelector?: string; // 父表单的选择器，如果元素在表单中
}

// 表单组接口
export interface FormGroup {
  elements: FormElement[];
  name: string;
  action: string;
  method: string;
  selector?: string; // 表单选择器
  iframeSelector?: string; // iframe选择器，如果表单在iframe中
}

// 表单组集合接口
export interface FormGroups {
  forms: Record<string, FormGroup>;
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
