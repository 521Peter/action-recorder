import { FormGroups } from "./types";

// 存储从内容脚本收集的表单元素
let formElements: FormGroups = {
  forms: {},
};
let totalElements = 0;

interface FormElementsMessage {
  action: string;
  formElements?: FormGroups;
  totalElements?: number;
  origin: string;
}

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener(
  (message: FormElementsMessage, sender, sendResponse) => {
    if (message.action === "formElementsUpdated" && message.formElements) {
      formElements = message.formElements;
      totalElements = message.totalElements || 0;

      // 保存到存储中，以便侧边栏页面可以访问
      chrome.storage.local.set(
        { formElements: formElements, totalElements: totalElements },
        () => {
          console.log(
            "表单元素已更新，共计",
            totalElements,
            "个元素",
            formElements
          );
        }
      );

      // 更新扩展图标上的徽章，显示找到的表单元素数量
      updateBadge(totalElements);
    }

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

// 更新扩展图标上的徽章
function updateBadge(count: number): void {
  if (count > 0) {
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
}

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

// 当用户切换标签页时，重新获取当前页面的表单元素
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // 等待更长时间，确保内容脚本完全加载
  setTimeout(() => {
    safelySendMessage(activeInfo.tabId, { action: "getFormElements" });
  }, 1000); // 延长到1000ms
});

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
