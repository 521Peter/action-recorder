import { AlertStatus, CreateToastFnReturn } from "@chakra-ui/react";

// 全局 toast 实例
let globalToast: CreateToastFnReturn | null = null;

/**
 * 设置全局 toast 实例
 * 在应用初始化时调用，通常在根组件中
 */
export const setGlobalToast = (toast: CreateToastFnReturn) => {
  globalToast = toast;
};

/**
 * 获取全局 toast 实例
 */
export const getGlobalToast = () => {
  if (!globalToast) {
    console.warn('Toast 实例未初始化，请先调用 setGlobalToast');
    return null;
  }
  return globalToast;
};

/**
 * 独立的 toast 工具函数，可以在任何地方使用
 */
export const showToast = {
  success: (title: string, description?: string) => showToastBase("success", title, description,),
  error: (title: string, description?: string) => showToastBase("error", title, description,),
  warning: (title: string, description?: string) => showToastBase("warning", title, description,),
  info: (title: string, description?: string) => showToastBase("info", title, description,),
};

const showToastBase = (status: AlertStatus, title: string, description?: string,) => {
  const toast = getGlobalToast();
  if (toast) {
    toast({
      title,
      description,
      status,
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  }
};