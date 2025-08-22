// 元素高亮器类
export class ElementHighlighter {
    private overlay: HTMLElement | null = null;
    private blinkInterval: number | null = null;
    private fadeTimeout: number | null = null;
    private removeTimeout: number | null = null;

    // 提取选择器字符串
    private extractSelector(selector: string): string {
        const regex = /document\.querySelector\(['"`](.*?)['"`]\)/;
        const match = selector.match(regex);
        return match ? match[1] : selector;
    }

    // 查找目标元素
    private findElement(selector: string, parentSelector?: string, iframeIndex?: number): {
        element: Element | null;
        targetDocument: Document;
        targetWindow: Window;
        iframeElement?: HTMLIFrameElement;
    } {
        let element: Element | null = null;
        let targetDocument: Document = document;
        let targetWindow: Window = window;
        let iframeElement: HTMLIFrameElement | undefined;

        // 处理iframe中的元素
        if (typeof iframeIndex === 'number') {
            const iframes = document.querySelectorAll("iframe");
            iframeElement = iframes[iframeIndex] as HTMLIFrameElement;

            if (iframeElement) {
                try {
                    const iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow?.document;
                    if (iframeDoc) {
                        targetDocument = iframeDoc;
                        targetWindow = iframeElement.contentWindow || window;
                    }
                } catch (error) {
                    console.warn("无法访问iframe内容:", error);
                    return { element: null, targetDocument, targetWindow };
                }
            }
        }

        // 查找元素
        if (parentSelector) {
            const parentSelectorCode = this.extractSelector(parentSelector);
            const parentElement = targetDocument.querySelector(parentSelectorCode);
            if (parentElement) {
                const selectorCode = this.extractSelector(selector);
                element = parentElement.querySelector(selectorCode);
            }
        } else {
            const selectorCode = this.extractSelector(selector);
            element = targetDocument.querySelector(selectorCode);
        }

        return { element, targetDocument, targetWindow, iframeElement };
    }

    // 计算元素在页面中的绝对位置
    private calculateAbsolutePosition(
        element: Element,
        targetWindow: Window,
        targetDocument: Document,
        iframeElement?: HTMLIFrameElement
    ): { top: number; left: number; width: number; height: number } {
        const rect = element.getBoundingClientRect();

        // 使用现代API获取滚动位置
        const scrollTop = targetWindow.scrollY || targetDocument.documentElement.scrollTop;
        const scrollLeft = targetWindow.scrollX || targetDocument.documentElement.scrollLeft;

        let adjustedTop = rect.top + scrollTop;
        let adjustedLeft = rect.left + scrollLeft;

        // 如果是iframe中的元素，需要加上iframe的偏移
        if (iframeElement) {
            const iframeRect = iframeElement.getBoundingClientRect();
            const mainScrollTop = window.scrollY || document.documentElement.scrollTop;
            const mainScrollLeft = window.scrollX || document.documentElement.scrollLeft;

            adjustedTop = rect.top + iframeRect.top + mainScrollTop;
            adjustedLeft = rect.left + iframeRect.left + mainScrollLeft;
        }

        return {
            top: adjustedTop,
            left: adjustedLeft,
            width: rect.width,
            height: rect.height
        };
    }

    // 创建高亮覆盖层
    private createOverlay(position: { top: number; left: number; width: number; height: number }): HTMLElement {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
      position: absolute;
      top: ${position.top}px;
      left: ${position.left}px;
      width: ${position.width}px;
      height: ${position.height}px;
      background-color: rgba(46, 204, 113, 0.3);
      border: 5px solid #2ecc71;
      border-radius: 3px;
      z-index: 9999999;
      pointer-events: none;
      transition: opacity 1s ease-out;
      opacity: 1;
    `;
        return overlay;
    }

    // 更新覆盖层位置（滚动后调用）
    private updateOverlayPosition(
        element: Element,
        targetWindow: Window,
        targetDocument: Document,
        iframeElement?: HTMLIFrameElement
    ): void {
        if (!this.overlay) return;

        const position = this.calculateAbsolutePosition(element, targetWindow, targetDocument, iframeElement);
        this.overlay.style.top = `${position.top}px`;
        this.overlay.style.left = `${position.left}px`;
        this.overlay.style.width = `${position.width}px`;
        this.overlay.style.height = `${position.height}px`;
    }

    // 开始闪烁动画
    private startBlinkAnimation(): void {
        if (!this.overlay) return;

        let opacity = 1;
        this.blinkInterval = window.setInterval(() => {
            opacity = opacity === 1 ? 0.5 : 1;
            if (this.overlay) {
                this.overlay.style.opacity = opacity.toString();
            }
        }, 400);
    }

    // 清理所有定时器和覆盖层
    private cleanup(): void {
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
        if (this.fadeTimeout) {
            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = null;
        }
        if (this.removeTimeout) {
            clearTimeout(this.removeTimeout);
            this.removeTimeout = null;
        }
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
            this.overlay = null;
        }
    }

    // 主要的高亮方法
    public highlight(selector: string, parentSelector?: string, iframeIndex?: number): void {
        try {
            // 清理之前的高亮
            this.cleanup();

            // 查找目标元素
            const { element, targetDocument, targetWindow, iframeElement } = this.findElement(
                selector,
                parentSelector,
                iframeIndex
            );

            if (!element) {
                console.warn("未找到要高亮的元素:", selector);
                return;
            }

            // 先滚动到元素位置
            element.scrollIntoView({
                behavior: "auto",
                block: "center",
            });

            // 等待滚动完成后再创建覆盖层
            setTimeout(() => {
                if (!element) return;

                // 计算元素位置并创建覆盖层
                const position = this.calculateAbsolutePosition(element, targetWindow, targetDocument, iframeElement);
                this.overlay = this.createOverlay(position);
                document.body.appendChild(this.overlay);

                // 开始闪烁动画
                this.startBlinkAnimation();

                // 监听滚动事件，实时更新覆盖层位置
                const updatePosition = () => {
                    this.updateOverlayPosition(element, targetWindow, targetDocument, iframeElement);
                };

                // 为主窗口和iframe窗口都添加滚动监听
                window.addEventListener('scroll', updatePosition, { passive: true });
                if (iframeElement && targetWindow !== window) {
                    targetWindow.addEventListener('scroll', updatePosition, { passive: true });
                }

                // 4秒后开始淡出
                this.fadeTimeout = window.setTimeout(() => {
                    if (this.blinkInterval) {
                        clearInterval(this.blinkInterval);
                        this.blinkInterval = null;
                    }
                    if (this.overlay) {
                        this.overlay.style.opacity = "0";
                    }

                    // 淡出完成后移除覆盖层和事件监听
                    this.removeTimeout = window.setTimeout(() => {
                        window.removeEventListener('scroll', updatePosition);
                        if (iframeElement && targetWindow !== window) {
                            targetWindow.removeEventListener('scroll', updatePosition);
                        }
                        this.cleanup();
                    }, 1000);
                }, 4000);
            }, 300); // 等待滚动动画完成

        } catch (error) {
            console.error("高亮元素时出错:", error);
            this.cleanup();
        }
    }
}