import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import CodeGeneration from "../CodeGeneration";
import Debug from "../Debug";

/**
 * 面板主应用组件
 * 使用Tabs组织不同功能模块
 */
function App() {
  const [activeTab, setActiveTab] = useState("generation");
  // 从代码生成页传递到调试页的待填充代码
  const [pendingDebugCode, setPendingDebugCode] = useState<string | null>(null);
  // 从代码生成页传递到调试页的第一个记录 URL
  const [firstRecordUrl, setFirstRecordUrl] = useState<string | null>(null);

  // 切换到调试页并填充代码
  const handleDebugWithCode = (code: string, url?: string) => {
    setPendingDebugCode(code);
    if (url) setFirstRecordUrl(url);
    setActiveTab("debug");
  };

  return (
    <>
      <div className="min-h-screen bg-background p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generation">生成代码</TabsTrigger>
            <TabsTrigger value="debug">调试</TabsTrigger>
          </TabsList>

          <TabsContent value="generation" className="mt-4">
            <CodeGeneration onDebugWithCode={handleDebugWithCode} />
          </TabsContent>

          <TabsContent value="debug" className="mt-4">
            <Debug
              pendingCode={pendingDebugCode}
              firstRecordUrl={firstRecordUrl}
              onPendingCodeHandled={() => {
                setPendingDebugCode(null);
                setFirstRecordUrl(null);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </>
  );
}

export default App;
