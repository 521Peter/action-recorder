import { useState } from "react";
import {
    VStack,
    Divider,
} from "@chakra-ui/react";
import FormList from "../FormList";
import SelectedElements from "../SelectedElements";
import FormControls from "../FormControls";
import CodePreview from "../CodePreview";
import { useFormElements } from "../../hooks/useFormElements";

/**
 * 代码生成组件
 * 负责表单元素选择和代码生成功能
 */
function CodeGeneration() {
    const [filterZeroPosition, setFilterZeroPosition] = useState<boolean>(true);
    const [showNonFormElements, setShowNonFormElements] = useState<boolean>(false);
    const [generatedCode, setGeneratedCode] = useState<string>("");

    const {
        formElements,
        selectedElements,
        loadFormElements,
        handleConfirmSelection,
        handleClearSelection,
    } = useFormElements();

    // 处理过滤器变化
    const handleFilterChange = (newFilterZeroPosition: boolean, newShowNonFormElements: boolean) => {
        setFilterZeroPosition(newFilterZeroPosition);
        setShowNonFormElements(newShowNonFormElements);
    };

    // 处理代码生成
    const handleCodeGenerated = (code: string) => {
        setGeneratedCode(code);
    };

    return (
        <VStack spacing={4} align="stretch">
            <FormControls
                onRefreshComplete={loadFormElements}
                onFilterChange={handleFilterChange}
            />

            <FormList
                formElements={formElements}
                filterZeroPosition={filterZeroPosition}
                showNonFormElements={showNonFormElements}
                onConfirmSelection={handleConfirmSelection}
            />

            <Divider />
            <SelectedElements
                selectedElements={selectedElements}
                formElements={formElements}
                onClear={handleClearSelection}
                onCodeGenerated={handleCodeGenerated}
            />

            <Divider />
            <CodePreview code={generatedCode} />
        </VStack>
    );
}

export default CodeGeneration;