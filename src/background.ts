interface FormElementsMessage {
  action: string;
  origin: string;
}

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener(
  (message: FormElementsMessage, sender, sendResponse) => {
    // 处理清除网站数据的请求
    if (message.action === "clearSiteData" && message.origin) {
      handleClearSiteData(message.origin)
        .then(() => {
          sendResponse({ success: true });
        })
        .catch((error: any) => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // 保持消息通道开放以进行异步响应
    }

    return true;
  }
);

// 清除网站数据
async function handleClearSiteData(origin: string): Promise<void> {
  try {
    await chrome.browsingData.remove(
      { origins: [origin] },
      {
        appcache: true,
        cacheStorage: true,
        cookies: true,
        indexedDB: true,
        localStorage: true,
        serviceWorkers: true,
        webSQL: true,
      }
    );
  } catch (error: any) {
    throw new Error(`清除网站数据失败: ${error.message}`);
  }
}

// 安全地发送消息到内容脚本
function safelySendMessage(tabId: number, message: any): void {
  try {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        console.log("发送消息错误:", chrome.runtime.lastError.message);
        // 不采取任何操作，避免抛出错误
        // 这是正常的，因为内容脚本可能尚未加载
      }
    });
  } catch (error) {
    console.log("发送消息异常:", error);
  }
}

// 当标签页刷新或导航到新页面时
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // 页面加载完成后，尝试获取表单元素，增加更长的延迟
    setTimeout(() => {
      safelySendMessage(tabId, { action: "getFormElements" });
    }, 1500); // 延长到1500ms
  }
});

// 点击扩展图标时打开侧边栏
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    // 使用dist中的实际路径
    chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: "src/panel/panel.html", // 这个路径会被构建工具处理
      enabled: true,
    });
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  // 在页面任何位置的右键菜单
  chrome.contextMenus.create({
    id: "getSelector",
    title: "复制元素选择器",
    contexts: ["all"],
  });
});

// 处理右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "getSelector" && tab && tab.id) {
    // 向content脚本发送消息，获取选择器
    safelySendMessage(tab.id, { action: "getSelector" });
  }
});

// ===== 集成 injected-script 功能 =====

import { CustomScriptManager } from "./utils/customScriptManager.ts";

/**
 * 初始化脚本管理器
 * 在Service Worker启动时创建实例
 */
new CustomScriptManager();
