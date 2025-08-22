import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Checkbox,
  Badge,
  useColorModeValue,
  Collapse,
  Code,
} from "@chakra-ui/react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { FormElementConfig } from "../../utils/formElementParser.ts";
import ElementLocator from "../../components/ElementLocator";
import { FormElement } from "../../types";

/**
 * 获取元素的名称
 */
function getElementName(element: FormElement): string {
  // 限制element.attributes.value的长度
  const limitValueLength = (value: string): string => {
    if (value.length > 20) {
      return value.slice(0, 20) + "...";
    }
    return value;
  };

  // 尝试从常见属性中获取名称
  const nameAttributes = ["name", "id", "placeholder", "aria-label"];

  for (const attr of nameAttributes) {
    if (element.attributes && element.attributes[attr]) {
      return limitValueLength(element.attributes[attr]);
    }
  }

  // 尝试获取元素的值或文本
  if (element.attributes && element.attributes.value) {
    return limitValueLength(element.attributes.value);
  }

  // 使用默认名称
  return `元素 ${element.tag}`;
}

interface FormElementItemProps {
  element: FormElement;
  index: number;
  onSelect?: (element: FormElement, isSelected: boolean) => void;
  selected?: boolean;
}

/**
 * 表单元素列表项组件
 */
function FormElementItem({
  element,
  index,
  onSelect,
  selected = false,
}: FormElementItemProps) {
  const [expanded, setExpanded] = useState<boolean>(false);

  // 背景颜色
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const evenRowBgColor = useColorModeValue("white", "gray.800");
  const oddRowBgColor = useColorModeValue("gray.50", "gray.900");

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(element, e.target.checked);
    }
  };

  return (
    <Box
      borderBottomWidth="1px"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      bg={index % 2 === 0 ? evenRowBgColor : oddRowBgColor}
      _hover={{ bg: hoverBgColor }}
      transition="background 0.2s"
    >
      <Flex p={3} alignItems="center" onClick={toggleExpand} cursor="pointer">
        <Box mr={2}>{expanded ? <FiChevronDown /> : <FiChevronRight />}</Box>

        <Checkbox
          isChecked={selected}
          onChange={handleSelectChange}
          onClick={(e) => e.stopPropagation()}
          mr={3}
          colorScheme={FormElementConfig.getTypeColor(element.type)}
        />

        <Badge colorScheme={FormElementConfig.getTypeColor(element.type)} mr={3}>
          {FormElementConfig.elementTypeLabels[element.type] || element.type}
        </Badge>

        <Text flex="1" fontSize="sm" fontWeight="medium">
          {getElementName(element)}
        </Text>

        <ElementLocator
          selector={element.selector}
          iframeIndex={element.iframeIndex}
          parentSelector={element.parentSelector}
          size="xs"
          variant="ghost"
        />
      </Flex>

      <Collapse in={expanded} animateOpacity>
        <Box p={3} bg={useColorModeValue("gray.50", "gray.700")} fontSize="sm">
          <Code
            p={2}
            w="100%"
            borderRadius="md"
            fontSize="xs"
            overflowX="auto"
            display="block"
          >
            {element.selector}
          </Code>
        </Box>
      </Collapse>
    </Box>
  );
}

export default FormElementItem;
