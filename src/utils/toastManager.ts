import { toast } from "@/hooks/use-toast";

/**
 * 独立的 toast 工具函数，可以在任何地方使用
 */
export const showToast = {
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
    });
  },
  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  },
  warning: (title: string, description?: string) => {
    toast({
      title,
      description,
    });
  },
  info: (title: string, description?: string) => {
    toast({
      title,
      description,
    });
  },
};