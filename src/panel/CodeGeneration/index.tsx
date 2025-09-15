import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Play, Square, Trash2, Download } from "lucide-react";
import { ClickRecord } from "../../types";

/**
 * 代码生成组件
 * 负责表单元素选择和代码生成功能
 */
function CodeGeneration() {
    const [isRecording, setIsRecording] = useState(false);
    const [records, setRecords] = useState<ClickRecord[]>([]);
    const { toast } = useToast();

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
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
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

    return (
        <div className="space-y-6">
            {/* 录制控制区域 */}
            <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <CardTitle className="text-lg font-semibold text-gray-800">录制控制</CardTitle>
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
                        className={`w-full transition-all duration-200 ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                            : 'bg-green-500 hover:bg-green-600 shadow-green-200'
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
                    <div className="flex gap-3">
                        <Button
                            onClick={clearRecords}
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            清空记录
                        </Button>
                        <Button
                            onClick={exportRecords}
                            variant="outline"
                            disabled={records.length === 0}
                            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            导出记录
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 记录列表 */}
            {records.length > 0 && (
                <Card className="border-2 border-gray-200 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <CardTitle className="text-lg font-semibold text-gray-800">操作记录</CardTitle>
                            </div>
                            <Badge variant="default" className="text-sm px-3 py-1 bg-blue-100 text-blue-800 border-blue-200">
                                {records.length} 条记录
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {records.map((record, index) => (
                                <div
                                    key={index}
                                    className={`p-3 border rounded-lg w-full transition-all duration-200 hover:shadow-md ${record.type === 'scroll'
                                        ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 hover:border-blue-400"
                                        : "bg-gradient-to-r from-green-50 to-green-100 border-green-300 hover:border-green-400"
                                        }`}
                                >
                                    {record.type === 'click' ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="font-bold text-green-700 text-base">
                                                        {record.elementType || 'unknown'}
                                                    </span>
                                                </div>
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                                    #{index + 1}
                                                </Badge>
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
                                                    <span className="text-gray-500 font-medium">TagName:</span>
                                                    <span className="text-gray-700">{record.tagName || 'unknown'}</span>
                                                </div>
                                                {record.id && (
                                                    <div className="flex items-center space-x-1 col-span-2">
                                                        <span className="text-gray-500 font-medium">ID:</span>
                                                        <span className="text-gray-700 font-mono text-xs">{record.id}</span>
                                                    </div>
                                                )}
                                                {record.className && (
                                                    <div className="flex items-center space-x-1 col-span-2">
                                                        <span className="text-gray-500 font-medium">Class:</span>
                                                        <span className="text-gray-700 font-mono text-xs">{record.className}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-gray-50 rounded-md p-1.5 border">
                                                <p className="text-xs text-gray-600 font-mono break-all">
                                                    <span className="font-medium">选择器:</span> {record.selector}
                                                </p>
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
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                                    #{index + 1}
                                                </Badge>
                                            </div>

                                            <div className="bg-white/70 rounded-md p-2 border border-blue-200">
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-blue-600 font-medium">垂直位置:</span>
                                                        <span className="text-blue-800 font-mono">{record.scrollTop}px</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-blue-600 font-medium">水平位置:</span>
                                                        <span className="text-blue-800 font-mono">{record.scrollLeft}px</span>
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
        </div>
    );
}

export default CodeGeneration;