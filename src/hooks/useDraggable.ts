import { useState } from "react";

// 样式配置接口
interface StyleConfig {
  hoverBgColor?: string;
  dragOverColor?: string;
  dragOverBorderColor?: string;
}

// 基础样式类型
type BaseStyle = Record<string, any>;

/**
 * 拖拽排序自定义Hook
 * @param initialItems - 初始项目数组
 * @param onOrderChange - 排序变更回调
 * @returns 拖拽相关状态和处理函数
 */
export const useDraggable = <T>(
  initialItems: T[],
  onOrderChange?: (items: T[]) => void
) => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(
    null
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // 当外部items变化时更新内部状态
  if (JSON.stringify(items) !== JSON.stringify(initialItems) && !isDragging) {
    setItems(initialItems);
  }

  // 拖拽开始
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ): void => {
    setDraggedItemIndex(index);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());

    // 创建一个自定义拖拽图像（可选）
    try {
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.opacity = "0.5";
      dragImage.style.position = "absolute";
      dragImage.style.top = "-1000px";
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 20, 20);

      // 延迟删除拖拽图像
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    } catch (err) {
      console.error("创建拖拽图像失败:", err);
    }
  };

  // 拖拽经过
  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItemIndex(index);
  };

  // 拖拽进入
  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ): void => {
    e.preventDefault();
    setDragOverItemIndex(index);
  };

  // 拖拽离开
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    // 只有当离开的元素是当前拖拽经过的元素时才重置
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
  };

  // 拖拽放下
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ): void => {
    e.preventDefault();

    // 如果没有拖拽索引或拖放到自己身上，不做任何操作
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
      setDragOverItemIndex(null);
      setIsDragging(false);
      return;
    }

    // 复制节点数组
    const newItems = [...items];
    // 获取被拖拽的节点
    const draggedItem = newItems[draggedItemIndex];

    // 从原位置删除
    newItems.splice(draggedItemIndex, 1);
    // 插入到新位置
    newItems.splice(dropIndex, 0, draggedItem);

    // 更新状态
    setItems(newItems);
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
    setIsDragging(false);

    // 通知外部排序变更
    if (onOrderChange) {
      onOrderChange(newItems);
    }
  };

  // 拖拽结束
  const handleDragEnd = (): void => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
    setIsDragging(false);
  };

  // 获取元素样式
  const getDragItemStyle = (
    index: number,
    baseStyle: BaseStyle = {},
    styleConfig: StyleConfig = {}
  ): BaseStyle => {
    const {
      hoverBgColor = "gray.50",
      dragOverColor = "blue.50",
      dragOverBorderColor = "blue.300",
    } = styleConfig;

    let style = { ...baseStyle };

    // 被拖拽的元素
    if (draggedItemIndex === index) {
      style = {
        ...style,
        opacity: 0.5,
        boxShadow: "lg",
      };
    }

    // 拖拽经过的元素
    if (dragOverItemIndex === index && draggedItemIndex !== index) {
      style = {
        ...style,
        bg: dragOverColor,
        borderColor: dragOverBorderColor,
        borderWidth: "2px",
        boxShadow: "md",
      };

      // 如果拖拽的元素在当前元素之上，则在上方显示插入指示器
      if (draggedItemIndex !== null && draggedItemIndex > index) {
        style = {
          ...style,
          borderTopWidth: "3px",
          mt: 1,
          _before: {
            content: '""',
            position: "absolute",
            top: "-8px",
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: `8px solid ${dragOverBorderColor}`,
          },
        };
      } else {
        // 否则在下方显示插入指示器
        style = {
          ...style,
          borderBottomWidth: "3px",
          mb: 1,
          _after: {
            content: '""',
            position: "absolute",
            bottom: "-8px",
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: `8px solid ${dragOverBorderColor}`,
          },
        };
      }
    }

    return style;
  };

  return {
    items,
    draggedItemIndex,
    dragOverItemIndex,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getDragItemStyle,
  };
};

export default useDraggable;
