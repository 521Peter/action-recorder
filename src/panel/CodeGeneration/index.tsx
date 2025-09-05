import { useState, useEffect } from "react";
import {
    VStack,
    HStack,
    Button,
    Text,
    Box,
    Heading,
    Badge,
    Divider,
    useToast,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Icon,
    Spacer,
} from "@chakra-ui/react";
import { FiPlay, FiSquare, FiTrash2, FiDownload } from "react-icons/fi";
import { ClickRecord } from "../../types";

/**
 * 代码生成组件
 * 负责表单元素选择和代码生成功能
 */
function CodeGeneration() {
    const [isRecording, setIsRecording] = useState(false);
    const [records, setRecords] = useState<ClickRecord[]>([]);
    const toast = useToast();

    useEffect(() => {
        // 检查当前录制状态
        chrome.storage.local.get(['isRecording'], (result) => {
            setIsRecording(result.isRecording || false);
        });

        // 加载已保存的记录
        loadRecords();
    }, []);

    const loadRecords = () => {
        chrome.storage.local.get(['clickRecords'], (result) => {
            setRecords(result.clickRecords || []);
        });
    };

    const startRecording = async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (tab.id) {
                // 向 content script 发送开始录制消息
                chrome.tabs.sendMessage(tab.id, { action: 'startRecording' });

                // 保存录制状态
                chrome.storage.local.set({ isRecording: true });
                setIsRecording(true);

                toast({
                    title: "开始录制",
                    description: "正在记录您的操作...",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "录制失败",
                description: "无法开始录制，请刷新页面后重试",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const stopRecording = async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (tab.id) {
                // 向 content script 发送停止录制消息
                chrome.tabs.sendMessage(tab.id, { action: 'stopRecording' });

                // 保存录制状态
                chrome.storage.local.set({ isRecording: false });
                setIsRecording(false);

                // 重新加载记录
                loadRecords();

                toast({
                    title: "停止录制",
                    description: "录制已停止",
                    status: "info",
                    duration: 2000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "停止失败",
                description: "无法停止录制",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const clearRecords = () => {
        chrome.storage.local.set({ clickRecords: [] });
        setRecords([]);
        toast({
            title: "记录已清空",
            status: "warning",
            duration: 2000,
            isClosable: true,
        });
    };

    const exportRecords = () => {
        if (records.length === 0) {
            toast({
                title: "无记录可导出",
                status: "warning",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        const dataStr = JSON.stringify(records, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `click-records-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();

        URL.revokeObjectURL(url);

        toast({
            title: "导出成功",
            description: "记录已导出到文件",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <VStack spacing={6} align="stretch">
            <Heading size="lg" color="blue.600">
                操作录制器
            </Heading>

            {/* 录制控制区域 */}
            <Card>
                <CardHeader pb={2}>
                    <Heading size="md">录制控制</Heading>
                </CardHeader>
                <CardBody pt={2}>
                    <VStack spacing={4}>
                        {/* 主要录制按钮 */}
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            colorScheme={isRecording ? "red" : "green"}
                            size="lg"
                            width="100%"
                            leftIcon={<Icon as={isRecording ? FiSquare : FiPlay} />}
                        >
                            {isRecording ? "停止记录" : "开始记录"}
                        </Button>

                        {/* 操作按钮组 */}
                        <HStack spacing={3} width="100%">
                            <Button
                                onClick={clearRecords}
                                colorScheme="orange"
                                variant="outline"
                                leftIcon={<Icon as={FiTrash2} />}
                                flex={1}
                            >
                                清空记录
                            </Button>
                            <Button
                                onClick={exportRecords}
                                colorScheme="blue"
                                variant="outline"
                                leftIcon={<Icon as={FiDownload} />}
                                isDisabled={records.length === 0}
                                flex={1}
                            >
                                导出记录
                            </Button>
                        </HStack>
                    </VStack>
                </CardBody>
            </Card>

            {/* 记录统计 */}
            <Card>
                <CardBody>
                    <Flex align="center">
                        <Text fontSize="lg" fontWeight="semibold">
                            记录统计
                        </Text>
                        <Spacer />
                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                            {records.length} 条记录
                        </Badge>
                    </Flex>
                </CardBody>
            </Card>

            {/* 记录列表 */}
            {records.length > 0 && (
                <Card>
                    <CardHeader>
                        <Heading size="md">操作记录</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={3} maxH="400px" overflowY="auto">
                            {records.map((record, index) => (
                                <Box
                                    key={index}
                                    p={4}
                                    border="1px"
                                    borderColor="gray.200"
                                    borderRadius="md"
                                    width="100%"
                                    bg={record.type === 'scroll' ? "blue.50" : "white"}
                                >
                                    {record.type === 'click' ? (
                                        <VStack align="start" spacing={2}>
                                            <Flex align="center" width="100%">
                                                <Text fontWeight="bold" color="blue.600">
                                                    点击: {record.text || record.label || '无文本'}
                                                </Text>
                                            </Flex>

                                            {record.label && (
                                                <Text fontSize="sm" color="green.600">
                                                    🏷️ 标签: {record.label}
                                                </Text>
                                            )}

                                            <Text fontSize="sm" color="gray.600">
                                                类型: {record.elementType || 'unknown'} |
                                                标签: {record.tagName || 'unknown'}
                                                {record.id && ` | ID: ${record.id}`}
                                                {record.className && ` | Class: ${record.className}`}
                                            </Text>

                                            <Text fontSize="xs" color="gray.500" fontFamily="mono">
                                                选择器: {record.selector}
                                            </Text>
                                        </VStack>
                                    ) : (
                                        <VStack align="start" spacing={2}>
                                            <Flex align="center" width="100%">
                                                <Text fontWeight="bold" color="orange.600">
                                                    滚动操作
                                                </Text>
                                            </Flex>

                                            <Text fontSize="sm" color="gray.600">
                                                位置: Y={record.scrollTop}, X={record.scrollLeft}
                                            </Text>
                                        </VStack>
                                    )}
                                </Box>
                            ))}
                        </VStack>
                    </CardBody>
                </Card>
            )}
        </VStack>
    );
}

export default CodeGeneration;