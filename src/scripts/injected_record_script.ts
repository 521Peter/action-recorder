import { addRecordingIndicator, removeRecordingIndicator } from "./recordingIndicator";
import { IframeMonitor } from "./iframeMonitor";
import { Handler } from "./handler";

let isRecording = false;
const handler = new Handler();
const iframeMonitor = new IframeMonitor(handler.clickHandler);


// 监听来自 content script 的消息
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data.type === "START_RECORDING") {
    startRecording();
  } else if (event.data.type === "STOP_RECORDING") {
    stopRecording();
  }
});

function startRecording() {
  if (isRecording) return;

  isRecording = true;
  iframeMonitor.initIframeMonitoring()

  // 记录初始滚动位置
  handler.initScrollState({
    top: window.scrollY || document.documentElement.scrollTop,
    left: window.scrollX || document.documentElement.scrollLeft,
  });

  // 添加点击事件监听器，使用捕获阶段确保能够拦截所有点击
  document.addEventListener("click", handler.clickHandler, true);

  // 添加滚动事件监听器
  window.addEventListener("scroll", handler.scrollHandler, { passive: true });

  // 添加录制状态指示器
  addRecordingIndicator();

  console.log("页面点击和滚动录制已开始");
}

function stopRecording() {
  if (!isRecording) return;

  isRecording = false;

  // 移除点击事件监听器
  document.removeEventListener("click", handler.clickHandler, true);

  // 移除滚动事件监听器
  window.removeEventListener("scroll", handler.scrollHandler);

  handler.cleanup();
  iframeMonitor.cleanup()

  // 移除录制状态指示器
  removeRecordingIndicator();

  console.log("页面点击和滚动录制已停止");
}

