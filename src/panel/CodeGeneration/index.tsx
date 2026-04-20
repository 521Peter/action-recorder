import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { Play, Square, Trash2, Download, Code, Copy, Bug } from "lucide-react";
import { Node, FormElementType } from "../../types";
import { generateCode } from "../../utils/codeGenerator";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

/**
 * 代码生成组件
 * 负责表单元素选择和代码生成功能
 */
function CodeGeneration({
  onDebugWithCode,
}: {
  onDebugWithCode?: (code: string, firstUrl?: string) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [records, setRecords] = useState<Node[]>([]);

  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // 检查当前录制状态
    chrome.storage.local.get(["isRecording"], (result) => {
      setIsRecording(result.isRecording || false);
    });

    // 加载已保存的记录
    loadRecords();

    // 加载已保存的作者信息
    chrome.storage.local.get(["authorInfo"], (result) => {
      if (result.authorInfo) {
        setAuthor(result.authorInfo);
      }
    });
  }, []);

  const loadRecords = () => {
    chrome.storage.local.get(["clickRecords"], (result) => {
      setRecords(result.clickRecords || []);
    });
  };

  const startRecording = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab.id) {
        // 向 content script 发送开始录制消息
        chrome.tabs.sendMessage(tab.id, { action: "startRecording" });

        // 保存录制状态
        chrome.storage.local.set({ isRecording: true });
        setIsRecording(true);

        toast({
          title: "🎬 开始录制",
          description: "正在记录您的操作...",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "❌ 录制失败",
        description: "无法开始录制，请刷新页面后重试",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab.id) {
        // 向 content script 发送停止录制消息
        chrome.tabs.sendMessage(tab.id, { action: "stopRecording" });

        // 保存录制状态
        chrome.storage.local.set({ isRecording: false });
        setIsRecording(false);

        // 重新加载记录
        loadRecords();

        toast({
          title: "⏹️ 停止录制",
          description: "录制已停止",
          variant: "info",
        });
      }
    } catch (error) {
      toast({
        title: "❌ 停止失败",
        description: "无法停止录制",
        variant: "destructive",
      });
    }
  };

  const clearRecords = () => {
    chrome.storage.local.set({ clickRecords: [] });
    setRecords([]);
    toast({
      title: "🗑️ 记录已清空",
      description: "所有操作记录已被删除",
      variant: "warning",
    });
  };

  const exportRecords = () => {
    if (records.length === 0) {
      toast({
        title: "⚠️ 无记录可导出",
        description: "请先录制一些操作",
        variant: "warning",
      });
      return;
    }

    const dataStr = JSON.stringify(records, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `click-records-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);

    toast({
      title: "✅ 导出成功",
      description: "记录已导出到文件",
      variant: "success",
    });
  };

  // 直接更新选择器
  const updateSelector = (index: number, newSelector: string) => {
    const updatedRecords = [...records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      selector: newSelector,
    };
    setRecords(updatedRecords);
    chrome.storage.local.set({ clickRecords: updatedRecords });
  };

  // 直接更新元素类型
  const updateElementType = (
    index: number,
    newElementType: FormElementType,
  ) => {
    const updatedRecords = [...records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      elementType: newElementType,
    };
    setRecords(updatedRecords);
    chrome.storage.local.set({ clickRecords: updatedRecords });
  };

  // 更新waitForElement属性
  const updateWaitForElement = (index: number, waitForElement: boolean) => {
    const updatedRecords = [...records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      waitForElement: waitForElement,
    };
    setRecords(updatedRecords);
    chrome.storage.local.set({ clickRecords: updatedRecords });
  };

  // 更新isPageReloaded属性
  const updateIsPageReloaded = (index: number, isPageReloaded: boolean) => {
    const updatedRecords = [...records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      isPageReloaded: isPageReloaded,
    };
    setRecords(updatedRecords);
    chrome.storage.local.set({ clickRecords: updatedRecords });
  };

  // 删除单个节点
  const deleteRecord = (index: number) => {
    if (confirm("确定要删除这个操作记录吗？")) {
      const updatedRecords = records.filter((_, i) => i !== index);
      setRecords(updatedRecords);
      chrome.storage.local.set({ clickRecords: updatedRecords });
      toast({
        title: "🗑️ 记录已删除",
        description: `已删除第 ${index + 1} 条操作记录`,
        variant: "warning",
      });
    }
  };

  // 跳转到第一个记录的 URL
  const navigateToFirstRecordUrl = async () => {
    if (records.length === 0 || !records[0].url) return;

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab.id) {
        await chrome.tabs.update(tab.id, { url: records[0].url });
        toast({
          title: "🔄 正在跳转",
          description: `跳转到: ${records[0].url}`,
          variant: "info",
        });
      }
    } catch (error) {
      console.error("跳转失败:", error);
      toast({
        title: "❌ 跳转失败",
        description: "无法跳转到目标页面",
        variant: "destructive",
      });
    }
  };

  // 生成代码
  const handleGenerateCode = () => {
    if (records.length === 0) {
      toast({
        title: "⚠️ 无记录可生成",
        description: "请先录制一些操作",
        variant: "warning",
      });
      return;
    }
    // 检查作者是否为空
    if (!author.trim()) {
      toast({
        title: "⚠️ 请输入作者",
        description: "请输入作者拼音",
        variant: "warning",
      });
      return;
    }

    try {
      const code = generateCode(records, author);
      setGeneratedCode(code);

      // 保存作者信息到本地存储
      chrome.storage.local.set({ authorInfo: author });

      toast({
        title: "✅ 代码生成成功",
        description: "代码已生成完成",
        variant: "success",
      });
    } catch (error) {
      console.error("代码生成错误:", error);
      toast({
        title: "❌ 代码生成失败",
        description: "生成代码时出现错误",
        variant: "destructive",
      });
    }
  };

  // 复制代码到剪贴板
  const copyCodeToClipboard = async () => {
    if (!generatedCode) {
      toast({
        title: "⚠️ 无代码可复制",
        description: "请先生成代码",
        variant: "warning",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: "✅ 复制成功",
        description: "代码已复制到剪贴板",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "❌ 复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 录制控制区域 */}
      <Card className="border-2 border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}
            ></div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              录制控制
            </CardTitle>
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                录制中
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* 主要录制按钮 */}
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            className={`w-full transition-all duration-200 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                : "bg-green-500 hover:bg-green-600 shadow-green-200"
            } shadow-lg`}
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-5 w-5" />
                停止记录
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                开始记录
              </>
            )}
          </Button>

          {/* 操作按钮组 */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={clearRecords}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              清空记录
            </Button>
            <Button
              onClick={exportRecords}
              variant="outline"
              disabled={records.length === 0}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="mr-2 h-4 w-4" />
              导出记录
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 记录列表区域 */}
      {records.length > 0 && (
        <Card className="border-2 border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  操作记录
                </CardTitle>
              </div>
              <Badge
                variant="default"
                className="text-sm px-3 py-1 bg-blue-100 text-blue-800 border-blue-200"
              >
                {records.length} 条记录
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {records.map((record, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg w-full transition-all duration-200 hover:shadow-md ${
                    record.type === "scroll"
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 hover:border-blue-400"
                      : "bg-gradient-to-r from-green-50 to-green-100 border-green-300 hover:border-green-400"
                  }`}
                >
                  {record.type === "click" ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <Select
                            value={record.elementType || ""}
                            onChange={(e) =>
                              updateElementType(
                                index,
                                e.target.value as FormElementType,
                              )
                            }
                            className="text-sm h-10 min-w-[120px]"
                          >
                            {Object.values(FormElementType).map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 text-xs"
                          >
                            #{index + 1}
                          </Badge>
                          <Button
                            onClick={() => deleteRecord(index)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {record.label && (
                        <div className="bg-emerald-50 rounded-md p-1.5 border border-emerald-200">
                          <p className="text-xs text-emerald-700 font-medium">
                            🏷️ Label: {record.label}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500 font-medium">
                            TagName:
                          </span>
                          <span className="text-gray-700">
                            {record.tagName || "unknown"}
                          </span>
                        </div>
                        {record.id && (
                          <div className="flex items-center space-x-1 col-span-2">
                            <span className="text-gray-500 font-medium">
                              ID:
                            </span>
                            <span className="text-gray-700 font-mono text-xs">
                              {record.id}
                            </span>
                          </div>
                        )}
                        {record.className && (
                          <div className="flex items-center space-x-1 col-span-2">
                            <span className="text-gray-500 font-medium">
                              Class:
                            </span>
                            <span className="text-gray-700 font-mono text-xs">
                              {record.className}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-md p-1.5 border">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 font-medium">
                            选择器:
                          </span>
                        </div>
                        <div className="mt-1">
                          <Input
                            value={record.selector || ""}
                            onChange={(e) =>
                              updateSelector(index, e.target.value)
                            }
                            className="text-xs font-mono"
                            placeholder="输入选择器..."
                          />
                        </div>
                      </div>

                      {/* 勾选框区域 */}
                      <div className="bg-blue-50 rounded-md p-2 border border-blue-200">
                        <div className="flex items-center space-x-6">
                          {/* 等待元素加载勾选框 */}
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`wait-${index}`}
                              checked={record.waitForElement || false}
                              onChange={(e) =>
                                updateWaitForElement(index, e.target.checked)
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label
                              htmlFor={`wait-${index}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              等待元素加载
                            </label>
                          </div>

                          {/* 为 successWrap 类型添加页面刷新勾选框 */}
                          {record.elementType ===
                            FormElementType.SUCCESS_WRAP && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`page-reload-${index}`}
                                checked={record.isPageReloaded || false}
                                onChange={(e) =>
                                  updateIsPageReloaded(index, e.target.checked)
                                }
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                              />
                              <label
                                htmlFor={`page-reload-${index}`}
                                className="text-sm text-gray-700 cursor-pointer"
                              >
                                页面是否刷新
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-bold text-blue-700 text-base">
                            滚动操作
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 text-xs"
                          >
                            #{index + 1}
                          </Badge>
                          <Button
                            onClick={() => deleteRecord(index)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-white/70 rounded-md p-2 border border-blue-200">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-1">
                            <span className="text-blue-600 font-medium">
                              垂直位置:
                            </span>
                            <span className="text-blue-800 font-mono">
                              {record.scrollTop}px
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-blue-600 font-medium">
                              水平位置:
                            </span>
                            <span className="text-blue-800 font-mono">
                              {record.scrollLeft}px
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 代码区域 */}
      <Card className="border-2 border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              代码生成
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* 作者输入框 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              作者信息
            </label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="请输入作者名称"
              className="text-sm"
            />
          </div>

          {/* 生成代码按钮 */}
          <Button
            onClick={handleGenerateCode}
            variant="outline"
            disabled={records.length === 0}
            className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Code className="mr-2 h-4 w-4" />
            生成代码
          </Button>

          {/* 生成的代码展示 */}
          {generatedCode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  生成的代码
                </label>
                <div className="flex gap-1">
                  <Button
                    onClick={copyCodeToClipboard}
                    variant="outline"
                    size="sm"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    复制代码
                  </Button>
                  <Button
                    onClick={async () => {
                      await navigateToFirstRecordUrl();
                      clearRecords();
                      onDebugWithCode?.(generatedCode, records[0]?.url);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                  >
                    <Bug className="mr-2 h-4 w-4" />
                    调试
                  </Button>
                </div>
              </div>
              <div className="bg-green-50 text-gray-800 p-4 rounded-lg overflow-x-auto border border-green-200">
                <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                  <code
                    className="language-javascript"
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(
                        generatedCode,
                        Prism.languages.javascript,
                        "javascript",
                      ),
                    }}
                  />
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CodeGeneration;
