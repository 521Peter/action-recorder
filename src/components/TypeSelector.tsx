import React, { useRef } from "react";
import {
  Tag,
  TagLabel,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { FormElementConfig } from "@/utils/formElementParser";
import { FormElementType } from "@/types";

interface TypeSelectorProps {
  value: FormElementType;
  onChange: (type: string) => void;
  types: Record<string, FormElementType>;
}

/**
 * 类型选择器组件
 * 用于选择表单元素类型
 */
const TypeSelector: React.FC<TypeSelectorProps> = ({
  value,
  onChange,
  types,
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const initialFocusRef = useRef<HTMLDivElement>(null);

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement="left"
      closeOnBlur={true}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Tag
          size="md"
          colorScheme={FormElementConfig.getTypeColor(value)}
          borderRadius="full"
          cursor="pointer"
          _hover={{ opacity: 0.8 }}
          role="button"
        >
          <TagLabel>{FormElementConfig.elementTypeLabels[value] || value}</TagLabel>
          <Box as={FiChevronDown} ml={1} />
        </Tag>
      </PopoverTrigger>
      <PopoverContent width="250px">
        <PopoverArrow />
        <PopoverBody maxH="200px" overflowY="auto">
          <SimpleGrid columns={2} spacing={2} p={1}>
            {Object.values(types).map((type) => (
              <Tag
                key={type}
                size="md"
                colorScheme={FormElementConfig.getTypeColor(type)}
                borderRadius="full"
                cursor="pointer"
                onClick={() => {
                  onChange(type);
                  onClose();
                }}
                _hover={{ opacity: 0.8 }}
                justifyContent="center"
                py={1}
              >
                <TagLabel>{FormElementConfig.elementTypeLabels[type] || type}</TagLabel>
              </Tag>
            ))}
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default TypeSelector;
