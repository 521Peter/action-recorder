import { Box, Text, VStack } from "@chakra-ui/react";
import FormGroup from "../FormGroup";
import { FormElement, FormGroups } from "../../types";

interface FormListProps {
    formElements: FormGroups;
    filterZeroPosition: boolean;
    showNonFormElements: boolean;
    onConfirmSelection: (formId: string, elements: FormElement[]) => void;
}

/**
 * 表单列表组件
 */
function FormList({
    formElements,
    filterZeroPosition,
    showNonFormElements,
    onConfirmSelection,
}: FormListProps) {
    // 过滤位置为0的元素
    const filterElements = (elements: FormElement[]): FormElement[] => {
        if (!filterZeroPosition) return elements;

        return elements.filter((element) => {
            const pos = element.position;
            return !(
                pos &&
                pos.height === 0 &&
                pos.left === 0 &&
                pos.top === 0 &&
                pos.width === 0
            );
        });
    };

    const formIds = Object.keys(formElements.forms);

    if (formIds.length === 0) {
        return (
            <Box textAlign="center" py={10} color="gray.500">
                <Text>未找到表单元素</Text>
            </Box>
        );
    }

    return (
        <VStack spacing={4} align="stretch">
            {formIds.map((formId, index) => {
                const form = formElements.forms[formId];

                // 跳过非表单元素（如果未选择显示）
                if (formId === "non_form_elements" && !showNonFormElements) {
                    return null;
                }

                // 过滤元素
                const filteredElements = filterElements(form.elements || []);
                if (filteredElements.length === 0) return null;

                return (
                    <FormGroup
                        key={formId}
                        form={{ ...form, elements: filteredElements }}
                        formId={formId}
                        formIndex={index + 1}
                        onConfirmSelection={onConfirmSelection}
                    />
                );
            })}
        </VStack>
    );
}

export default FormList;