import React from "react";
import { Move } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragHandleProps {
  className?: string;
}

/**
 * 拖拽句柄组件
 */
const DragHandle: React.FC<DragHandleProps> = ({
  className,
}) => (
  <span
    className={cn(
      "cursor-grab p-1 rounded-md bg-muted flex items-center justify-center active:cursor-grabbing",
      className
    )}
    title="拖拽调整顺序"
  >
    <Move className="h-4 w-4" />
  </span>
);

interface DraggableItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onDragStart' | 'onDragOver' | 'onDragEnter' | 'onDragLeave' | 'onDrop' | 'onDragEnd'> {
  index: number;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  children: (dragHandle: React.ReactNode) => React.ReactNode;
  showDragHandle?: boolean;
  dragHandleClassName?: string;
}

/**
 * 可拖拽项组件
 * 封装了拖拽相关的事件处理
 */
const DraggableItem: React.FC<DraggableItemProps> = ({
  index,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragEnd,
  children,
  showDragHandle = true,
  dragHandleClassName,
  className,
  style,
  ...rest
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) =>
    onDragStart && onDragStart(e, index);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    onDragOver && onDragOver(e, index);
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) =>
    onDragEnter && onDragEnter(e, index);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) =>
    onDrop && onDrop(e, index);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
      className={cn("relative", className)}
      style={style}
      {...rest}
    >
      {children(
        showDragHandle ? <DragHandle className={dragHandleClassName} /> : null
      )}
    </div>
  );
};

export default DraggableItem;
export { DragHandle };
