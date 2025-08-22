import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App/index";

// 自定义主题
const theme = extendTheme({
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    brand: {
      50: "#e6f7ff",
      100: "#b3e0ff",
      200: "#80caff",
      300: "#4db3ff",
      400: "#1a9dff",
      500: "#0084e6",
      600: "#0067b3",
      700: "#004a80",
      800: "#002e4d",
      900: "#00111a",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold",
        borderRadius: "md",
      },
      defaultProps: {
        colorScheme: "brand",
      },
    },
  },
});

// 获取根元素
const rootElement = document.getElementById("app");

// 确保根元素存在
if (!rootElement) {
  throw new Error("未找到根元素 #app");
}

// 渲染应用到DOM
const root = createRoot(rootElement);
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
