import React from "react";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ElementLocatorProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selector: string;
  parentSelector?: string; // 父表单的选择器，如果元素在表单中
  iframeIndex?: number; // iframe索引，如果元素在iframe中
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

/**
 * 元素定位组件
 * 用于在页面中定位元素
 */
const ElementLocator: React.FC<ElementLocatorProps> = ({
  selector,
  parentSelector,
  iframeIndex,
  size = "sm",
  variant = "ghost",
  className,
  ...rest
}) => {
  const handleTestSelector = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "testSelector",
          selector,
          parentSelector,
          iframeIndex,
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('ElementLocator: 消息发送失败', chrome.runtime.lastError);
          } else {
            console.log('ElementLocator: 消息发送成功', response);
          }
        });
      } else {
        console.error('ElementLocator: 未找到活动标签页');
      }
    });
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleTestSelector}
      disabled={!selector}
      className={cn("p-2", className)}
      title="在页面中定位此元素"
      {...rest}
    >
      <Target className="h-4 w-4" />
    </Button>
  );
};

export default ElementLocator;
