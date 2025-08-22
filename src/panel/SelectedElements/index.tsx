import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  VStack,
  HStack,
  Input,
  Checkbox,
  IconButton,
  useColorModeValue,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2, FiCode, FiX } from "react-icons/fi";
import { generateTaskCode } from "../../utils/codeGenerator.ts";
import {
  FormElementType,
  FormElement,
  TaskNode,
  TaskConfig,
  FormGroups,
} from "../../types";
import TypeSelector from "../../components/TypeSelector";
import ElementLocator from "../../components/ElementLocator";
import DraggableItem from "../../components/DraggableItem";
import { useDraggable } from "../../hooks/useDraggable.ts";

interface SelectedElementsProps {
  selectedElements: FormElement[];
  formElements?: FormGroups;
  onClear?: () => void;
  onCodeGenerated?: (code: string) => void;
}

/**
 * 已选择元素展示组件
 */
function SelectedElements({
  selectedElements,
  formElements,
  onClear,
  onCodeGenerated,
}: SelectedElementsProps) {
  const [nodes, setNodes] = useState<TaskNode[]>([]);
  const [config, setConfig] = useState<TaskConfig | null>(null);

  // 背景和边框颜色
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const dragHandleBg = useColorModeValue("gray.100", "gray.600");
  const dragPlaceholderColor = useColorModeValue("gray.100", "gray.700");
  const headerBgColor = useColorModeValue("gray.50", "gray.700");
  const dragOverColor = useColorModeValue("blue.50", "blue.900");
  const dragOverBorderColor = useColorModeValue("blue.300", "blue.500");

  // 使用拖拽排序hook
  const {
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getDragItemStyle,
  } = useDraggable<TaskNode>(nodes, (newNodes) => setNodes(newNodes));

  useEffect(() => {
    // 将选中的元素转换为节点配置
    const initialNodes = selectedElements.map((el, index) => ({
      parentSelector: el.parentSelector,
      selector: el.selector,
      type: el.type,
      scroll: false,
      waitForElement: false,
    }));
    setNodes(initialNodes);

    // 如果有表单数据，尝试找到包含选中元素的表单并设置默认的表单选择器
    if (formElements && selectedElements.length > 0) {
      const form = findFormForElements(selectedElements, formElements);
      if (form) {
        console.log('对应的form：', form)
        setConfig(prev => ({
          url: prev?.url || "",
          node: prev?.node || [],
          formSelector: form?.selector || '',
          successSelector: prev?.successSelector || "",
          successText: prev?.successText || "",
          iframeSelector: form.iframeSelector || ''
        }));
      }
    }
  }, [selectedElements, formElements]);

  const handleNodeChange = (
    index: number,
    field: keyof TaskNode,
    value: any
  ) => {
    const updatedNodes = [...nodes];
    updatedNodes[index] = { ...updatedNodes[index], [field]: value };
    setNodes(updatedNodes);
  };

  const handleAddNode = () => {
    setNodes([
      ...nodes,
      {
        selector: "",
        type: FormElementType.CLICK,
        scroll: false,
        waitForElement: false,
      },
    ]);
  };

  const handleRemoveNode = (index: number) => {
    const updatedNodes = nodes.filter((_, i) => i !== index);
    setNodes(updatedNodes);
  };

  const handleGenerate = async () => {
    const url = await new Promise<string>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0] && tabs[0].url) {
          const url = new URL(tabs[0].url);
          resolve(url.href);
        } else {
          resolve("");
        }
      });
    });

    const taskConfig: TaskConfig = {
      url: url,
      node: nodes.map((node) => ({
        selector: node.selector,
        type: node.type,
        scroll: hasNodeActions(node) ? node.scroll : false,
        waitForElement: hasNodeActions(node) ? node.waitForElement : false,
        parentSelector:node.parentSelector
      })),
      formSelector: config?.formSelector || "",
      successSelector: config?.successSelector || "",
      successText: config?.successText || "",
      iframeSelector: config?.iframeSelector || ''
    };
    setConfig(taskConfig);

    // 生成代码
    const code = generateTaskCode(taskConfig);
    onCodeGenerated?.(code);
  };

  const handleClearAll = () => {
    setNodes([]);
    setConfig(null);
    onCodeGenerated?.("");
    if (onClear) {
      onClear();
    }
  };

  function hasNodeActions(node: TaskNode): boolean {
    return (
      node.type !== FormElementType.LINKS &&
      node.type !== FormElementType.OPTIONS
    );
  }

  // 获取基础样式
  const getBaseStyle = () => ({
    borderWidth: "1px",
    borderRadius: "md",
    p: 3,
    borderColor: borderColor,
    transition: "all 0.2s",
    _hover: {
      boxShadow: "md",
      bg: hoverBgColor,
    },
  });

  // 获取样式配置
  const getStyleConfig = () => ({
    hoverBgColor,
    dragOverColor,
    dragOverBorderColor,
  });

  // 查找包含选中元素的表单选择器
  const findFormForElements = (elements: FormElement[], formGroups: FormGroups) => {
    if (!elements.length || !formGroups) return "";

    // 遍历所有表单，找到包含最多选中元素的表单
    let bestForm = null;
    let maxMatchCount = 0;

    for (const [formId, formGroup] of Object.entries(formGroups.forms)) {
      // if (!formGroup.selector) continue;

      // 计算当前表单包含多少个选中元素
      const matchCount = elements.filter(selectedEl =>
        formGroup.elements.some(formEl => formEl.selector === selectedEl.selector)
      ).length;

      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        bestForm = formGroup;
      }
    }

    return bestForm;
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
        bg={headerBgColor}
        borderBottomWidth="1px"
        borderBottomColor={borderColor}
      >
        <Heading as="h3" size="sm">
          节点配置 ({nodes.length})
        </Heading>
      </Flex>

      <VStack spacing={3} p={4} align="stretch">
        {/* form表单 */}
        <Flex gap={2}>
          <Input
            value={config?.formSelector || ""}
            onChange={(e) =>
              setConfig(prev => ({
                url: prev?.url || "",
                node: prev?.node || [],
                formSelector: e.target.value,
                successSelector: prev?.successSelector || "",
                successText: prev?.successText || "",
                iframeSelector: prev?.iframeSelector || "",
              }))
            }
            placeholder="表单选择器"
            size="sm"
            flex="1"
          />
          <Input
            value={config?.successSelector || ""}
            onChange={(e) =>
              setConfig(prev => ({
                url: prev?.url || "",
                node: prev?.node || [],
                formSelector: prev?.formSelector || "",
                successSelector: e.target.value,
                successText: prev?.successText || "",
                iframeSelector: prev?.iframeSelector || "",
              }))
            }
            placeholder="成功标记的选择器"
            size="sm"
            flex="1"
          />
          <Input
            value={config?.successText || ""}
            onChange={(e) =>
              setConfig(prev => ({
                url: prev?.url || "",
                node: prev?.node || [],
                formSelector: prev?.formSelector || "",
                successSelector: prev?.successSelector || "",
                successText: e.target.value,
                iframeSelector: prev?.iframeSelector || "",
              }))
            }
            placeholder="成功文本"
            size="sm"
            flex="1"
          />
        </Flex>

        {nodes.map((node, nodeIndex) => (
          <DraggableItem
            key={nodeIndex}
            index={nodeIndex}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            style={getDragItemStyle(nodeIndex, getBaseStyle(), getStyleConfig())}
            dragHandleBg={dragHandleBg}
          >
            {(dragHandle) => (
              <>
                <Flex mb={2} gap={2} wrap="wrap" alignItems="center">
                  {dragHandle}
                  <Input
                    value={node.selector}
                    onChange={(e) =>
                      handleNodeChange(nodeIndex, "selector", e.target.value)
                    }
                    placeholder="元素选择器"
                    size="sm"
                    flex="1"
                  />
                  <TypeSelector
                    value={node.type}
                    onChange={(value) => handleNodeChange(nodeIndex, "type", value)}
                    types={FormElementType}
                  />
                  <ElementLocator
                    selector={node.selector}
                    parentSelector={node.parentSelector}
                    iframeIndex={selectedElements.find(el => el.selector === node.selector)?.iframeIndex}
                    size="sm"
                    variant="ghost"
                  />
                </Flex>

                {hasNodeActions(node) && (
                  <Flex mt={2} alignItems="center" flexWrap="wrap" gap={2}>
                    <Checkbox
                      isChecked={node.scroll}
                      onChange={(e) =>
                        handleNodeChange(nodeIndex, "scroll", e.target.checked)
                      }
                      size="sm"
                    >
                      <Text fontSize="xs">滚动到此元素</Text>
                    </Checkbox>
                    <Checkbox
                      isChecked={node.waitForElement}
                      onChange={(e) =>
                        handleNodeChange(
                          nodeIndex,
                          "waitForElement",
                          e.target.checked
                        )
                      }
                      size="sm"
                    >
                      <Text fontSize="xs">等待元素加载</Text>
                    </Checkbox>
                    <Spacer />
                    <IconButton
                      icon={<FiTrash2 />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveNode(nodeIndex)}
                      aria-label="删除节点"
                    />
                  </Flex>
                )}

                {!hasNodeActions(node) && (
                  <Flex justifyContent="flex-end" mt={2}>
                    <IconButton
                      icon={<FiTrash2 />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveNode(nodeIndex)}
                      aria-label="删除节点"
                    />
                  </Flex>
                )}
              </>
            )}
          </DraggableItem>
        ))}

        {/* 拖拽时显示的占位元素 */}
        {isDragging && nodes.length > 0 && (
          <Box
            borderWidth="1px"
            borderStyle="dashed"
            borderRadius="md"
            p={3}
            borderColor={dragPlaceholderColor}
            bg={dragPlaceholderColor}
            opacity={0.6}
            height="10px"
            mt={1}
            mb={1}
          />
        )}

        {nodes.length === 0 && (
          <Box py={4} textAlign="center">
            <Text color="gray.500">尚未选择任何元素</Text>
          </Box>
        )}
      </VStack>

      <Flex p={3} justifyContent="space-between">
        <HStack>
          <Button
            leftIcon={<FiPlus />}
            onClick={handleAddNode}
            size="sm"
            colorScheme="blue"
          >
            添加节点
          </Button>
          <Button
            leftIcon={<FiCode />}
            onClick={handleGenerate}
            size="sm"
            colorScheme="green"
            isDisabled={nodes.length === 0}
          >
            生成代码
          </Button>
        </HStack>
        <Button
          leftIcon={<FiX />}
          onClick={handleClearAll}
          size="sm"
          variant="outline"
          isDisabled={nodes.length === 0}
        >
          清空
        </Button>
      </Flex>

    </Box>
  );
}

export default SelectedElements;
