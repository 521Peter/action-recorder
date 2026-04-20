class IframeMonitor {
    // 用于记录已经设置过监听的iframe，避免重复设置
    private monitoredIframes = new WeakSet();
    private clickHandler: (event: MouseEvent) => void;
    private observer: MutationObserver | null = null;

    constructor(clickHandler: (event: MouseEvent) => void) {
        this.clickHandler = clickHandler;
    }

    private setupIframeListeners() {
        // 获取页面中的所有iframe
        const iframes = document.getElementsByTagName('iframe');

        for (let iframe of iframes) {
            this.setupSingleIframe(iframe);
        }
    }

    private setupSingleIframe(iframe: HTMLIFrameElement) {
        // 如果已经设置过监听，则跳过
        if (this.monitoredIframes.has(iframe)) {
            return;
        }

        try {
            // 标记为已监听
            this.monitoredIframes.add(iframe);

            // 检查iframe是否已加载
            if (iframe.contentDocument) {
                this.attachListenerToIframeDocument(iframe);
            }
            const that = this;

            // 监听iframe的加载事件
            iframe.addEventListener('load', function () {
                try {
                    that.attachListenerToIframeDocument(this);
                } catch (e) {
                    console.warn('无法访问iframe内容:', e);
                }
            });

        } catch (e) {
            console.warn('无法访问iframe:', e);
        }
    }

    private attachListenerToIframeDocument(iframe: HTMLIFrameElement) {
        try {
            if (iframe.contentDocument) {
                iframe.contentDocument.addEventListener("click", this.clickHandler, true);
                console.log('已为iframe添加点击监听:', iframe.src);
            }
        } catch (error) {
            console.warn('无法为iframe文档添加监听:', error);
        }
    }

    // 监听DOM变化，检测新添加的iframe
    private setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 检查新增的节点
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;

                        // 检查是否是iframe
                        if (element.tagName === 'IFRAME') {
                            this.setupSingleIframe(element as HTMLIFrameElement);
                        }

                        // 检查新增节点内部是否包含iframe
                        const iframes = element.getElementsByTagName('iframe');
                        for (let iframe of iframes) {
                            this.setupSingleIframe(iframe);
                        }
                    }
                });
            });
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    // 初始化
    initIframeMonitoring() {
        // 设置现有iframe的监听
        this.setupIframeListeners();

        // 设置MutationObserver监听动态添加的iframe
        this.observer = this.setupMutationObserver();
    }

    // 清理
    cleanup() {
        this.observer && this.observer.disconnect();
    }
}

export { IframeMonitor };