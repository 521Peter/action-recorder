import { ElementTypeDetector, LabelExtractor } from "@/utils/formElementParser";
import { addClickFeedback } from "./recordingIndicator";
import { generateUniqueSelector } from "@/utils/genSelector";
import {
  findFormControlEle,
  findNonSvgParent,
  findParentForm,
  getIframeSelector,
} from "./finder";
import { FormElementType } from "@/types";

class Handler {
  private scrollTimeout: number | null = null;
  private lastScrollPosition = { top: 0, left: 0 };
  private hasRecordedScrollSinceLastClick = false;

  clickHandler = (event: MouseEvent) => {
    let target = event.target as Element;
    if (!target) return;

    const iframeSelector = getIframeSelector(target);

    // 如果点击的是SVG元素或SVG内部元素，向上查找非SVG元素作为目标
    const isSvgElement =
      target.tagName.toLowerCase() === "svg" ||
      target.namespaceURI === "http://www.w3.org/2000/svg" ||
      (target as any).ownerSVGElement;

    if (isSvgElement) {
      const nonSvgParent = findNonSvgParent(target);
      if (nonSvgParent !== target) {
        target = nonSvgParent;
        console.log("检测到SVG相关元素，使用非SVG父元素作为目标:", target);
      }
    }

    // 尝试在点击的元素内部查找表单控件元素
    const formControlEle = findFormControlEle(target);
    if (formControlEle) {
      target = formControlEle;
      console.log("找到内部表单控件元素，使用该元素作为目标:", target);
    }

    // 查找所属表单并获取formSelector
    const formInfo = findParentForm(target);

    // 生成选择器
    const selector = formInfo?.form
      ? generateUniqueSelector(target, formInfo?.form)
      : generateUniqueSelector(target);

    console.warn("selector", selector);
    // 获取元素文本
    let text = "";

    // 如果是 a 标签或 button，获取其文本内容
    if (
      target.tagName.toLowerCase() === "a" ||
      target.tagName.toLowerCase() === "button"
    ) {
      text = target.textContent?.trim() || "";
    }
    // 如果是 input 按钮，获取 value 或 placeholder
    else if (target.tagName.toLowerCase() === "input") {
      const input = target as HTMLInputElement;
      if (input.type === "button" || input.type === "submit") {
        text = input.value || input.placeholder || "";
      }
    }
    // 其他元素也尝试获取文本内容
    else {
      text = target.textContent?.trim() || "";
    }

    // 使用ElementTypeDetector确定元素类型
    let elementType = ElementTypeDetector.determineElementType(
      target,
      selector
    );
    // 预测类型
    let tagName = target.tagName.toLowerCase();
    if (tagName === "button") {
      // 弹窗关键词
      const dialogKeywords = ["accept", "dialog", "close", "cookie", "allow"];
      if (
        dialogKeywords.some((keyword) =>
          selector.toLowerCase().includes(keyword)
        )
      ) {
        elementType = FormElementType.DIALOG;
      } else if (formInfo?.form) {
        elementType = FormElementType.SUBMIT;
      }
    }

    // 使用LabelExtractor获取标签文本
    const label = LabelExtractor.getLabelText(selector);

    // 获取当前页面URL（在点击时立即获取，避免页面跳转后URL变化）
    const currentUrl = window.location.href;

    // 发送点击数据到 content script
    window.postMessage(
      {
        type: "ELEMENT_CLICKED",
        data: {
          selector,
          text,
          tagName: tagName,
          className: target.className,
          id: target.id,
          elementType: elementType,
          label: label,
          formSelector: formInfo?.formSelector || null,
          url: currentUrl,
          iframeSelector: iframeSelector,
        },
      },
      "*"
    );

    // 重置滚动记录标记，允许记录下一次滚动
    this.hasRecordedScrollSinceLastClick = false;

    // 添加视觉反馈
    addClickFeedback(target);
  };

  scrollHandler = () => {
    // 清除之前的超时
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // 设置延迟，避免频繁触发
    this.scrollTimeout = window.setTimeout(() => {
      const currentScrollTop =
        window.scrollY || document.documentElement.scrollTop;
      const currentScrollLeft =
        window.scrollX || document.documentElement.scrollLeft;

      // 检查滚动位置是否真的发生了变化，并且还没有记录过这次滚动序列
      if (
        (currentScrollTop !== this.lastScrollPosition.top ||
          currentScrollLeft !== this.lastScrollPosition.left) &&
        !this.hasRecordedScrollSinceLastClick
      ) {
        // 发送滚动数据到 content script
        window.postMessage(
          {
            type: "SCROLL_DETECTED",
            data: {
              scrollTop: currentScrollTop,
              scrollLeft: currentScrollLeft,
            },
          },
          "*"
        );
        this.lastScrollPosition = {
          top: currentScrollTop,
          left: currentScrollLeft,
        };
        this.hasRecordedScrollSinceLastClick = true;
      }
    }, 150);
  };

  // 清除状态
  cleanup() {
    // 清除滚动超时
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }

    // 重置滚动状态
    this.lastScrollPosition = { top: 0, left: 0 };
    this.hasRecordedScrollSinceLastClick = false;
  }

  // 更新滚动状态
  initScrollState(newPosition: { top: number; left: number }) {
    this.lastScrollPosition = newPosition;
  }
}

export { Handler };
