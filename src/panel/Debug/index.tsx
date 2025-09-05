import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash, Play, RotateCcw, Code } from "lucide-react";
import { removeComments } from "@/utils/scriptInjector";

// 创建简化的 toast 函数
const showToast = {
  success: (message: string) => {
    // 这里可以使用 useToast hook，但为了简化，我们先用一个简单的实现
    console.log('Success:', message);
  },
  error: (message: string) => {
    console.log('Error:', message);
  }
};

/**
 * 脚本注入器组件
 * 集成了 injected-script 项目的功能
 */
function Debug() {
  const [customCode, setCustomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 加载已保存的脚本
  useEffect(() => {
    chrome.storage.local.get(["customScript"], (result) => {
      if (result.customScript) {
        setCustomCode(result.customScript);
      }
    });
  }, []);

  // 保存脚本
  const handleSaveScript = async () => {
    const code = customCode.trim();
    if (!code) {
      toast({
        title: "请输入脚本代码",
        variant: "destructive",
      });
      return;
    }

    chrome.storage.local.set({ customScript: code }, () => {
      toast({
        title: "脚本已保存",
        description: "将在所有网站自动执行",
      });
    });
  };

  // 删除脚本
  const handleDeleteScript = () => {
    if (confirm("确定要删除脚本吗？")) {
      chrome.storage.local.remove("customScript", () => {
        setCustomCode("");
        toast({
          title: "脚本已删除",
        });
      });
    }
  };

  // 测试脚本
  const handleTestScript = async () => {
    const code = customCode.trim();
    if (!code) {
      toast({
        title: "请先输入脚本代码",
        variant: "destructive",
      });
      return;
    }

    // 移除注释后执行
    const codeWithoutComments = await removeComments(code);

    setIsLoading(true);
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        toast({
          title: "无法获取标签页ID",
          variant: "destructive",
        });
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
              result: result !== undefined ? String(result) : "执行成功",
            };
          } catch (error) {
            return {
              success: false,
              error: (error as Error).message,
            };
          }
        },
        args: [codeWithoutComments],
        world: "MAIN", // 在主世界中执行，可以访问页面变量
      });

      // 处理执行结果
      if (results && results[0] && results[0].result) {
        const { success, result, error } = results[0].result;
        if (success) {
          toast({
            title: "执行成功",
            description: result,
          });
        } else {
          toast({
            title: "执行失败",
            description: error,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "脚本测试执行完成",
        });
      }
    } catch (error) {
      toast({
        title: "测试失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 刷新页面并清除网站数据
  const handleReloadPage = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab.id && tab.url) {
        const url = new URL(tab.url);
        const origin = url.origin;

        // 清除当前网站的所有数据
        const response = await chrome.runtime.sendMessage({
          action: "clearSiteData",
          origin: origin
        });

        if (response && response.success) {
          // 刷新页面
          chrome.tabs.reload(tab.id);
        } else {
          toast({
            title: "清除网站数据失败",
            description: response?.error || '未知错误',
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "无法获取标签页信息",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "刷新失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 脚本代码编辑区域 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-muted-foreground" />
              <CardTitle>脚本代码</CardTitle>
            </div>

            {/* 测试和刷新按钮组 */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleTestScript}
                disabled={isLoading}
              >
                <Play className="h-4 w-4 mr-1" />
                测试脚本
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReloadPage}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                刷新页面
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Textarea
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="在此输入您的 JavaScript 代码..."
            className="min-h-[350px] font-mono text-sm resize-y"
          />

          {/* 保存和删除按钮 */}
          <div className="flex gap-2">
            <Button
              onClick={handleSaveScript}
              size="sm"
            >
              <Save className="h-4 w-4 mr-1" />
              保存脚本
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteScript}
              size="sm"
            >
              <Trash className="h-4 w-4 mr-1" />
              删除脚本
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-semibold">使用说明：</p>
            <ul className="space-y-1 ml-4">
              <li>• 在文本框中输入 JavaScript 代码</li>
              <li>• 点击 <Save className="inline h-3 w-3 mx-1" /> 保存脚本到本地存储</li>
              <li>• 点击 <Play className="inline h-3 w-3 mx-1" /> 在当前页面测试脚本</li>
              <li>• 点击 <RotateCcw className="inline h-3 w-3 mx-1" /> 清除当前页面缓存并刷新</li>
              <li>• 点击 <Trash className="inline h-3 w-3 mx-1" /> 删除已保存的脚本</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Debug;
