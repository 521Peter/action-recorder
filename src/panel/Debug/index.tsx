import {
    Box,
    Text,
    VStack,
    HStack,
    Textarea,
    Button,
    useColorModeValue,
    IconButton,
    Tooltip,
    ButtonGroup,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { showToast } from "@/utils/toastManager";
import {
    FaSave,
    FaTrash,
    FaPlay,
    FaRedo,
    FaCode
} from "react-icons/fa";

/**
 * 脚本注入器组件
 * 集成了 injected-script 项目的功能
 */
function Debug() {
    const [customCode, setCustomCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.600", "gray.300");

    // 加载已保存的脚本
    useEffect(() => {
        chrome.storage.local.get(["customScript"], (result) => {
            if (result.customScript) {
                setCustomCode(result.customScript);
            }
        });
    }, []);



    // 保存脚本
    const handleSaveScript = () => {
        const code = customCode.trim();
        if (!code) {
            showToast.error("请输入脚本代码");
            return;
        }

        chrome.storage.local.set({ customScript: code }, () => {
            showToast.success("脚本已保存，将在所有网站自动执行");
        });
    };

    // 删除脚本
    const handleDeleteScript = () => {
        if (confirm("确定要删除脚本吗？")) {
            chrome.storage.local.remove("customScript", () => {
                setCustomCode("");
                showToast.success("脚本已删除");
            });
        }
    };

    // 测试脚本
    const handleTestScript = async () => {
        const code = customCode.trim();
        if (!code) {
            showToast.error("请先输入脚本代码");
            return;
        }

        setIsLoading(true);
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });

            if (!tab.id) {
                showToast.error("无法获取标签页ID");
                return;
            }

            // 使用 Function 构造器来避免 CSP 限制
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (scriptContent: string) => {
                    try {
                        // 使用 Function 构造器执行代码，避免 CSP 限制
                        const executeCode = new Function(scriptContent);
                        const result = executeCode();
                        return {
                            success: true,
                            result: result !== undefined ? String(result) : "执行成功"
                        };
                    } catch (error) {
                        return {
                            success: false,
                            error: (error as Error).message
                        };
                    }
                },
                args: [code],
                world: "MAIN", // 在主世界中执行，可以访问页面变量
            });

            // 处理执行结果
            if (results && results[0] && results[0].result) {
                const { success, result, error } = results[0].result;
                if (success) {
                    showToast.success(`${result}`);
                } else {
                    showToast.error(`${error}`);
                }
            } else {
                showToast.success("脚本测试执行完成");
            }
        } catch (error) {
            showToast.error(`测试失败: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 刷新页面
    const handleReloadPage = async () => {
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            if (tab.id) {
                chrome.tabs.reload(tab.id);
                showToast.success("页面刷新中...");
            } else {
                showToast.error("无法获取标签页ID");
            }
        } catch (error) {
            showToast.error(`刷新失败: ${(error as Error).message}`);
        }
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* 脚本代码编辑区域 */}
            <Box p={4} borderRadius="md" bg={bgColor} border="1px" borderColor={borderColor}>
                <HStack justify="space-between" align="center" mb={3}>
                    <HStack>
                        <FaCode color={useColorModeValue("#4A5568", "#A0AEC0")} />
                        <Text fontSize="lg" fontWeight="bold" color={textColor}>
                            脚本代码
                        </Text>
                    </HStack>

                    {/* 测试和刷新按钮组 */}
                    <ButtonGroup size="sm" isAttached variant="outline">
                        <Tooltip label="测试脚本" hasArrow>
                            <IconButton
                                aria-label="测试脚本"
                                icon={<FaPlay />}
                                colorScheme="green"
                                onClick={handleTestScript}
                                isLoading={isLoading}
                            />
                        </Tooltip>
                        <Tooltip label="刷新页面" hasArrow>
                            <IconButton
                                aria-label="刷新页面"
                                icon={<FaRedo />}
                                colorScheme="gray"
                                onClick={handleReloadPage}
                            />
                        </Tooltip>
                    </ButtonGroup>
                </HStack>

                <Textarea
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="在此输入您的 JavaScript 代码..."
                    height="350px"
                    fontFamily="monospace"
                    fontSize="sm"
                    resize="vertical"
                    mb={3}
                />

                {/* 保存和删除按钮 */}
                <HStack spacing={2}>
                    <Button
                        leftIcon={<FaSave />}
                        colorScheme="blue"
                        onClick={handleSaveScript}
                        size="sm"
                    >
                        保存脚本
                    </Button>
                    <Button
                        leftIcon={<FaTrash />}
                        colorScheme="red"
                        variant="outline"
                        onClick={handleDeleteScript}
                        size="sm"
                    >
                        删除脚本
                    </Button>
                </HStack>
            </Box>

            {/* 使用说明 */}
            <Box p={4} borderRadius="md" bg={useColorModeValue("gray.50", "gray.700")}>
                <Text fontSize="sm" color={textColor}>
                    <strong>使用说明：</strong>
                    <br />
                    • 在文本框中输入 JavaScript 代码
                    <br />
                    • 点击 <FaSave style={{ display: 'inline', margin: '0 2px' }} /> 保存脚本到本地存储
                    <br />
                    • 点击 <FaPlay style={{ display: 'inline', margin: '0 2px' }} /> 在当前页面测试脚本
                    <br />
                    • 点击 <FaRedo style={{ display: 'inline', margin: '0 2px' }} /> 刷新当前页面
                    <br />
                    • 点击 <FaTrash style={{ display: 'inline', margin: '0 2px' }} /> 删除已保存的脚本
                    <br />
                    <br />
                    <strong>注意：</strong>保存的脚本将在所有网站自动执行，脚本使用Function构造器避免CSP限制
                </Text>
            </Box>
        </VStack>
    );
}

export default Debug;