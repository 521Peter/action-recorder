import React, { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { setGlobalToast } from "../utils/toastManager";

interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Toast 提供者组件
 * 在应用根部使用，用于初始化全局 toast 实例
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toast = useToast();

  useEffect(() => {
    // 设置全局 toast 实例
    setGlobalToast(toast);
  }, [toast]);

  return <>{children}</>;
};