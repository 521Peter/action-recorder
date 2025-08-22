import React from "react";
import { Box, Tooltip, BoxProps } from "@chakra-ui/react";
import { FiMove } from "react-icons/fi";

interface DragHandleProps {
  dragHandleBg?: string;
}

/**
 * 拖拽句柄组件
 */
const DragHandle: React.FC<DragHandleProps> = ({
  dragHandleBg = "gray.100",
}) => (
  <Tooltip label="拖拽调整顺序" placement="top">
    <Box
      as="span"
      cursor="grab"
      p={1}
      borderRadius="md"
      bg={dragHandleBg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      _active={{ cursor: "grabbing" }}
    >
      <FiMove />
    </Box>
  </Tooltip>
);

interface DraggableItemProps {
  index: number;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  style?: Record<string, any>;
  children: (dragHandle: React.ReactNode) => React.ReactNode;
  showDragHandle?: boolean;
  dragHandleBg?: string;
  [key: string]: any;
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
  style,
  children,
  showDragHandle = true,
  dragHandleBg,
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
    <Box
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
      position="relative"
      sx={style}
      {...rest}
    >
      {children(
        showDragHandle ? <DragHandle dragHandleBg={dragHandleBg} /> : null
      )}
    </Box>
  );
};

export default DraggableItem;
export { DragHandle };
