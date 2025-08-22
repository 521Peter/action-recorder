import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Badge,
  Checkbox,
} from "@chakra-ui/react";
import { FiCheck } from "react-icons/fi";
import FormElementItem from "../FormElementItem";
import { FormElement, FormGroup as FormGroupType } from "../../types";

interface FormGroupProps {
  form: FormGroupType;
  formId: string;
  formIndex: number;
  onConfirmSelection?: (formId: string, elements: FormElement[]) => void;
}

/**
 * 表单分组组件
 */
function FormGroup({
  form,
  formId,
  formIndex,
  onConfirmSelection,
}: FormGroupProps) {
  const [selectedElements, setSelectedElements] = useState<
    Record<string, FormElement>
  >({});
  const [hasSelection, setHasSelection] = useState<boolean>(false);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  // 背景和边框颜色
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // 处理元素选择
  const handleElementSelect = (element: FormElement, isSelected: boolean) => {
    setSelectedElements((prev) => {
      const newSelected = { ...prev };
      if (isSelected) {
        newSelected[element.selector] = element;
      } else {
        delete newSelected[element.selector];
      }
      return newSelected;
    });
  };

  // 处理全选
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setAllSelected(isChecked);

    if (isChecked) {
      // 全选所有元素
      const allElements: Record<string, FormElement> = {};
      form.elements.forEach((element) => {
        allElements[element.selector] = element;
      });
      setSelectedElements(allElements);
    } else {
      // 取消全选
      setSelectedElements({});
    }
  };

  // 监听选择状态变化
  useEffect(() => {
    const hasAnySelection = Object.keys(selectedElements).length > 0;
    setHasSelection(hasAnySelection);

    // 更新全选状态
    setAllSelected(
      Object.keys(selectedElements).length === form.elements.length &&
      form.elements.length > 0
    );
  }, [selectedElements, form.elements]);

  // 确认选择
  const handleConfirm = () => {
    if (onConfirmSelection) {
      onConfirmSelection(formId, Object.values(selectedElements));
      setSelectedElements({});
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      borderColor={borderColor}
      bg={bgColor}
      overflow="hidden"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={3}
        bg={useColorModeValue("gray.50", "gray.700")}
        borderBottomWidth="1px"
        borderBottomColor={borderColor}
      >
        <Flex alignItems="center">
          <Checkbox
            mr={2}
            isChecked={allSelected}
            onChange={handleSelectAll}
            colorScheme="blue"
          />
          <Badge colorScheme="blue" mr={2}>
            表单 {formIndex}
          </Badge>
          <Text fontSize="sm" fontWeight="medium">
            {typeof form.name === "string" ? form.name : `表单 ${formIndex}`}
          </Text>
        </Flex>
        <Flex gap={2}>
          {hasSelection && (
            <Button
              size="sm"
              colorScheme="green"
              leftIcon={<FiCheck />}
              onClick={handleConfirm}
            >
              确认选择
            </Button>
          )}
        </Flex>
      </Flex>

      <Box>
        {form.elements.map((element, index) => (
          <FormElementItem
            key={index}
            element={element}
            index={index}
            onSelect={handleElementSelect}
            selected={!!selectedElements[element.selector]}
          />
        ))}
      </Box>
    </Box>
  );
}

export default FormGroup;
