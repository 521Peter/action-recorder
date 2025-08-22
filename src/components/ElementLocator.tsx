import React from "react";
import { IconButton, Tooltip, IconButtonProps } from "@chakra-ui/react";
import { FiTarget } from "react-icons/fi";

interface ElementLocatorProps
  extends Omit<IconButtonProps, "icon" | "aria-label"> {
  selector: string;
  parentSelector?: string; // 父表单的选择器，如果元素在表单中
  iframeIndex?: number; // iframe索引，如果元素在iframe中
  size?: string;
  variant?: string;
  colorScheme?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
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
  colorScheme = "blue",
  tooltipPlacement = "top",
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
    <Tooltip label="在页面中定位此元素" placement={tooltipPlacement}>
      <IconButton
        icon={<FiTarget />}
        size={size}
        variant={variant}
        colorScheme={colorScheme}
        onClick={handleTestSelector}
        aria-label="定位元素"
        isDisabled={!selector}
        {...rest}
      />
    </Tooltip>
  );
};

export default ElementLocator;
