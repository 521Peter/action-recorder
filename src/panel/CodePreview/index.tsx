import React, { useEffect, useRef, useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/themes/prism-solarizedlight.css";
import { js as jsBeautify } from "js-beautify";
import { showToast } from "@/utils/toastManager";

interface CodePreviewProps {
  code: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const codeRef = useRef<HTMLElement>(null);

  // 背景和边框颜色
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // 格式化代码
  const formattedCode = useMemo(() => {
    if (!code) return '';

    try {
      return jsBeautify(code, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        keep_array_indentation: false,
        break_chained_methods: false,
        brace_style: 'collapse',
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: false,
        wrap_line_length: 80,
        comma_first: false,
        e4x: false,
        indent_empty_lines: false
      });
    } catch (error) {
      console.warn('代码格式化失败，返回原始代码:', error);
      return code;
    }
  }, [code]);

  // 代码高亮
  useEffect(() => {
    if (formattedCode && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [formattedCode]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode);
      showToast.success('复制成功', '代码已复制到剪贴板');
    } catch (err) {
      console.error("复制失败:", err);
      showToast.error('复制失败', err instanceof Error ? err.message : '未知错误');
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
        <Heading as="h3" size="sm">
          生成的代码
        </Heading>
        {formattedCode && (
          <IconButton
            icon={<FiCopy />}
            onClick={copyCode}
            size="sm"
            colorScheme="blue"
            variant="ghost"
            aria-label="复制代码"
            title="复制代码"
          />
        )}
      </Flex>
      <Box p={3} maxH="600px" overflowY="auto" className="code-container">
        {formattedCode ? (
          <pre className="language-javascript">
            <code ref={codeRef} className="language-javascript">
              {formattedCode}
            </code>
          </pre>
        ) : (
          <Box
            textAlign="center"
            color={useColorModeValue("gray.500", "gray.400")}
            py={8}
          >
            暂无生成的代码
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CodePreview;
