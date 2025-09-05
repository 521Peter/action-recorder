import { generateUniqueSelector } from "./utils/genSelector.ts";
import { ElementHighlighter } from "./utils/elementHighlighter.ts";
import { ScriptInjector } from "./utils/scriptInjector.ts";

// 创建全局高亮器实例
const elementHighlighter = new ElementHighlighter();

// 保存当前右键点击的元素
let clickedElement: Element | null = null;

// 监听右键点击事件，保存当前元素
document.addEventListener(
  "contextmenu",
  function (event: MouseEvent) {
    clickedElement = document.elementFromPoint(event.clientX, event.clientY);
  },
  true
);

// 根据选择器获取元素
function getElementBySelector(selector: string): string {
  return "document.querySelector(`" + selector + "`)";
}

// 复制文本到剪贴板
function copyToClipboard(text: string): boolean {
  // 创建临时文本区域
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed"; // 避免影响页面布局
  document.body.appendChild(textarea);
  textarea.select();

  // 尝试复制到剪贴板
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (err) {
    console.error("无法复制选择器: ", err);
  }

  // 移除临时元素
  document.body.removeChild(textarea);

  // 使用现代剪贴板API作为备选方案（适用于更现代的浏览器）
  if (!success && navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => console.log("选择器已复制到剪贴板"))
      .catch((err) => console.error("无法复制选择器: ", err));
  }

  return success;
}

// 显示通知
function showNotification(message: string): void {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 15px;
    background: #333;
    color: white;
    border-radius: 4px;
    z-index: 999999;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(notification);

  // 3秒后移除通知
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

interface ChromeMessage {
  action: string;
  selector?: string;
  parentSelector?: string;
  iframeIndex?: number;
  script?: string;
}

// 监听来自扩展的消息
chrome.runtime.onMessage.addListener(
  (message: ChromeMessage, _sender, sendResponse) => {
    console.log('Content: 收到消息', message);
    if (message.action === "testSelector" && message.selector) {
      // 处理测试选择器请求
      console.log('Content: 开始处理testSelector', {
        selector: message.selector,
        parentSelector: message.parentSelector,
        iframeIndex: message.iframeIndex
      });
      elementHighlighter.highlight(message.selector, message.parentSelector, message.iframeIndex);
      sendResponse({ success: true });
    } else if (message.action === "getSelector" && clickedElement) {
      // 处理获取选择器请求
      const selector = generateUniqueSelector(clickedElement);
      if (selector) {
        copyToClipboard(getElementBySelector(selector));
        showNotification("选择器已复制: " + selector);
        sendResponse({ success: true });
      } else {
        showNotification("无法生成唯一选择器");
        sendResponse({ success: false });
      }
      return true;
    } else if (message.action === "injectDirectly" && message.script) {
      // 处理直接注入脚本请求
      const injector = new ScriptInjector();
      injector.injectViaTextContent(message.script, () => {
        sendResponse({ success: true });
      });
      return true; // 保持消息通道开放以进行异步响应
    }
    return true;
  }
);

// ===== 集成 injected-script 功能 =====

/**
 * 初始化注入器 - 自动注入模式
 * 只在顶级窗口中运行，避免在iframe中重复执行
 */
if (window.self === window.top) {
  const injector = new ScriptInjector();
  injector.initializeWithMultipleTiming();
}


// Content Script - 在网页中运行，负责与页面通信
let isRecording = false

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'startRecording') {
    startRecording()
    sendResponse({ success: true })
  } else if (message.action === 'stopRecording') {
    stopRecording()
    sendResponse({ success: true })
  }
})

function startRecording() {
  isRecording = true

  // 注入脚本到页面中
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('src/injected_record_script.js')
  script.onload = function () {
    // 脚本加载完成后，向页面发送开始录制消息
    window.postMessage({ type: 'START_RECORDING' }, '*')
  }
  document.head.appendChild(script)

  // 监听来自注入脚本的消息
  window.addEventListener('message', handlePageMessage)

  console.log('开始记录点击事件')
}

function stopRecording() {
  isRecording = false

  // 向页面发送停止录制消息
  window.postMessage({ type: 'STOP_RECORDING' }, '*')

  // 移除消息监听器
  window.removeEventListener('message', handlePageMessage)

  console.log('停止记录点击事件')
}

function handlePageMessage(event: MessageEvent) {
  // 只处理来自同一窗口的消息
  if (event.source !== window) return

  // 如果没有在录制，忽略消息
  if (!isRecording) return

  if (event.data.type === 'ELEMENT_CLICKED') {
    const clickData = event.data.data

    // 保存点击记录到 Chrome 存储
    chrome.storage.local.get(['clickRecords'], (result) => {
      const records = result.clickRecords || []
      records.push({
        type: 'click',
        selector: clickData.selector,
        text: clickData.text,
        tagName: clickData.tagName,
        className: clickData.className,
        id: clickData.id,
        elementType: clickData.elementType,
        label: clickData.label,
        formSelector: clickData.formSelector,
        url: window.location.href
      })

      chrome.storage.local.set({ clickRecords: records })
    })

    console.log('记录点击:', clickData)
  } else if (event.data.type === 'SCROLL_DETECTED') {
    const scrollData = event.data.data

    // 保存滚动记录到 Chrome 存储
    chrome.storage.local.get(['clickRecords'], (result) => {
      const records = result.clickRecords || []
      records.push({
        type: 'scroll',
        scrollTop: scrollData.scrollTop,
        scrollLeft: scrollData.scrollLeft,
        url: window.location.href
      })

      chrome.storage.local.set({ clickRecords: records })
    })

    console.log('记录滚动:', scrollData)
  }
}

// 页面加载时检查是否正在录制
chrome.storage.local.get(['isRecording'], (result) => {
  if (result.isRecording) {
    startRecording()
  }
})