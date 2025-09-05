import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App/index";
import "../globals.css";

// 获取根元素
const rootElement = document.getElementById("app");

// 确保根元素存在
if (!rootElement) {
  throw new Error("未找到根元素 #app");
}

// 渲染应用到DOM
const root = createRoot(rootElement);
root.render(<App />);
