import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import CodeGeneration from "../CodeGeneration";
import Debug from "../Debug";
import { ToastProvider } from '../../components/ToastProvider';

/**
 * 面板主应用组件
 * 使用Tabs组织不同功能模块
 */
function App() {
  // 背景颜色
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <ToastProvider>
      <Box bg={bgColor} minH="100vh" p={4}>
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>生成代码</Tab>
            <Tab>调试</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={4}>
              <CodeGeneration />
            </TabPanel>
            <TabPanel p={4}>
              <Debug />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ToastProvider>
  );
}

export default App;
