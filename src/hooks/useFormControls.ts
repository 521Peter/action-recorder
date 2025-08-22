import { useState, useCallback } from 'react';

/**
 * 表单控制相关的状态和逻辑Hook
 */
export function useFormControls() {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [filterZeroPosition, setFilterZeroPosition] = useState<boolean>(true);
    const [showNonFormElements, setShowNonFormElements] = useState<boolean>(false);

    // 刷新表单元素
    const refreshFormElements = useCallback((onComplete?: () => void) => {
        setRefreshing(true);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0 && tabs[0].id) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "getFormElements" },
                    () => {
                        setTimeout(() => {
                            onComplete?.();
                            setRefreshing(false);
                        }, 500);
                    }
                );
            } else {
                setRefreshing(false);
            }
        });
    }, []);

    return {
        // 状态
        refreshing,
        filterZeroPosition,
        showNonFormElements,

        // 状态更新函数
        setFilterZeroPosition,
        setShowNonFormElements,

        // 操作函数
        refreshFormElements,
    };
}