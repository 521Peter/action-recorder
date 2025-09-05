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
                    title: "开始录制",
                    description: "正在记录您的操作...",
                });
            }
        } catch (error) {
            toast({
                title: "录制失败",
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
                    title: "停止录制",
                    description: "录制已停止",
                });
            }
        } catch (error) {
            toast({
                title: "停止失败",
                description: "无法停止录制",
                variant: "destructive",
            });
        }
    };

    const clearRecords = () => {
        chrome.storage.local.set({ clickRecords: [] });
        setRecords([]);
        toast({
            title: "记录已清空",
        });
    };

    const exportRecords = () => {
        if (records.length === 0) {
            toast({
                title: "无记录可导出",
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
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-primary">
                操作录制器
            </h1>

            {/* 录制控制区域 */}
            <Card>
                <CardHeader>
                    <CardTitle>录制控制</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* 主要录制按钮 */}
                    <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        className="w-full"
                    >
                        {isRecording ? (
                            <>
                                <Square className="mr-2 h-4 w-4" />
                                停止记录
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-4 w-4" />
                                开始记录
                            </>
                        )}
                    </Button>

                    {/* 操作按钮组 */}
                    <div className="flex gap-3">
                        <Button
                            onClick={clearRecords}
                            variant="outline"
                            className="flex-1"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            清空记录
                        </Button>
                        <Button
                            onClick={exportRecords}
                            variant="outline"
                            disabled={records.length === 0}
                            className="flex-1"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            导出记录
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 记录统计 */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                            记录统计
                        </span>
                        <Badge variant="default" className="text-sm px-3 py-1">
                            {records.length} 条记录
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* 记录列表 */}
            {records.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>操作记录</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {records.map((record, index) => (
                                <div
                                    key={index}
                                    className={`p-4 border rounded-md w-full ${record.type === 'scroll'
                                            ? "bg-blue-50 border-blue-200"
                                            : "bg-white border-gray-200"
                                        }`}
                                >
                                    {record.type === 'click' ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center w-full">
                                                <span className="font-bold text-primary">
                                                    点击: {record.text || record.label || '无文本'}
                                                </span>
                                            </div>

                                            {record.label && (
                                                <p className="text-sm text-green-600">
                                                    🏷️ 标签: {record.label}
                                                </p>
                                            )}

                                            <p className="text-sm text-muted-foreground">
                                                类型: {record.elementType || 'unknown'} |
                                                标签: {record.tagName || 'unknown'}
                                                {record.id && ` | ID: ${record.id}`}
                                                {record.className && ` | Class: ${record.className}`}
                                            </p>

                                            <p className="text-xs text-muted-foreground font-mono">
                                                选择器: {record.selector}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center w-full">
                                                <span className="font-bold text-orange-600">
                                                    滚动操作
                                                </span>
                                            </div>

                                            <p className="text-sm text-muted-foreground">
                                                位置: Y={record.scrollTop}, X={record.scrollLeft}
                                            </p>
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