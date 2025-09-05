import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import CodeGeneration from "../CodeGeneration";
import Debug from "../Debug";

/**
 * 面板主应用组件
 * 使用Tabs组织不同功能模块
 */
function App() {
  return (
    <>
      <div className="min-h-screen bg-background p-4">
        <Tabs defaultValue="generation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generation">生成代码</TabsTrigger>
            <TabsTrigger value="debug">调试</TabsTrigger>
          </TabsList>

          <TabsContent value="generation" className="mt-4">
            <CodeGeneration />
          </TabsContent>

          <TabsContent value="debug" className="mt-4">
            <Debug />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </>
  );
}

export default App;
