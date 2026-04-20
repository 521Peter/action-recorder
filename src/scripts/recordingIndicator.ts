function addClickFeedback(element: Element) {
    // 添加临时的视觉反馈
    const originalStyle = (element as HTMLElement).style.outline;
    (element as HTMLElement).style.outline = "2px solid #ff4444";

    setTimeout(() => {
        (element as HTMLElement).style.outline = originalStyle;
    }, 500);
}

function addRecordingIndicator() {
    // 创建录制状态指示器
    const indicator = document.createElement("div");
    indicator.id = "click-recorder-indicator";
    indicator.innerHTML = "🔴 录制中";
    indicator.style.cssText = `
    position: fixed;
    top: 5px;
    left: 50%;
    transform: translate(-50%, 0);
    background: rgba(255, 68, 68, 0.95);
    color: white;
    padding: 6px 10px;
    border-radius: 20px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    font-weight: 500;
    z-index: 999999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    animation: pulse 2s infinite;
    pointer-events: none;
    white-space: nowrap;
  `;

    // 添加脉冲动画
    const style = document.createElement("style");
    style.textContent = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
  `;
    document.head.appendChild(style);
    document.body.appendChild(indicator);
}

function removeRecordingIndicator() {
    const indicator = document.getElementById("click-recorder-indicator");
    if (indicator) {
        indicator.remove();
    }
}

export { addClickFeedback, addRecordingIndicator, removeRecordingIndicator };