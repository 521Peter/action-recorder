import {
    Button,
    Flex,
    Switch,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import { useFormControls } from "../../hooks/useFormControls";

interface FormControlsProps {
    onRefreshComplete?: () => void;
    onFilterChange?: (filterZeroPosition: boolean, showNonFormElements: boolean) => void;
}

/**
 * 表单控制面板组件
 */
function FormControls({
    onRefreshComplete,
    onFilterChange,
}: FormControlsProps) {
    const {
        refreshing,
        filterZeroPosition,
        showNonFormElements,
        setFilterZeroPosition,
        setShowNonFormElements,
        refreshFormElements,
    } = useFormControls();

    const handleRefresh = () => {
        refreshFormElements(onRefreshComplete);
    };

    const handleFilterZeroPositionChange = (checked: boolean) => {
        setFilterZeroPosition(checked);
        onFilterChange?.(checked, showNonFormElements);
    };

    const handleShowNonFormElementsChange = (checked: boolean) => {
        setShowNonFormElements(checked);
        onFilterChange?.(filterZeroPosition, checked);
    };

    return (
        <Flex gap={4} wrap="wrap" alignItems="center">
            <Button
                leftIcon={<FiRefreshCw />}
                size="sm"
                onClick={handleRefresh}
                isLoading={refreshing}
                loadingText=""
                colorScheme="blue"
            >
                刷新
            </Button>

            <FormControl display="flex" alignItems="center" width="auto">
                <FormLabel htmlFor="filter-zero" mb="0" fontSize="sm">
                    过滤位置为0的元素
                </FormLabel>
                <Switch
                    id="filter-zero"
                    isChecked={filterZeroPosition}
                    onChange={(e) => handleFilterZeroPositionChange(e.target.checked)}
                    colorScheme="blue"
                />
            </FormControl>

            <FormControl display="flex" alignItems="center" width="auto">
                <FormLabel htmlFor="show-non-form" mb="0" fontSize="sm">
                    显示独立元素
                </FormLabel>
                <Switch
                    id="show-non-form"
                    isChecked={showNonFormElements}
                    onChange={(e) => handleShowNonFormElementsChange(e.target.checked)}
                    colorScheme="blue"
                />
            </FormControl>
        </Flex>
    );
}

export default FormControls;