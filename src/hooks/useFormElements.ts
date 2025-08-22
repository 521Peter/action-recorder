import { useState, useEffect, useCallback } from 'react';
import { FormElement, FormGroups } from '../types';

/**
 * 表单元素管理相关的状态和逻辑Hook
 */
export function useFormElements() {
    const [formElements, setFormElements] = useState<FormGroups>({ forms: {} });
    const [selectedElements, setSelectedElements] = useState<FormElement[]>([]);

    // 加载表单元素
    const loadFormElements = useCallback(() => {
        chrome.storage.local.get(["formElements", "totalElements"], (data) => {
            if (data.formElements && data.totalElements > 0) {
                setFormElements(data.formElements as FormGroups);
            } else {
                setFormElements({ forms: {} });
            }
        });
    }, []);

    // 初始加载
    useEffect(() => {
        loadFormElements();
    }, [loadFormElements]);

    // 处理确认选择
    const handleConfirmSelection = useCallback((formId: string, elements: FormElement[]) => {
        setSelectedElements(prev => [...prev, ...elements]);
    }, []);

    // 清空选择
    const handleClearSelection = useCallback(() => {
        setSelectedElements([]);
    }, []);

    // 过滤位置为0的元素
    const filterElements = useCallback((elements: FormElement[], filterZeroPosition: boolean): FormElement[] => {
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
    }, []);

    return {
        // 状态
        formElements,
        selectedElements,

        // 操作函数
        loadFormElements,
        handleConfirmSelection,
        handleClearSelection,
        filterElements,
    };
}