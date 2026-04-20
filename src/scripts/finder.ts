import { generateUniqueSelector } from "@/utils/genSelector";

// 表单信息接口
interface FormInfo {
    formSelector: string;
    form: Element;
}

// 查找元素所属的表单
function findParentForm(element: Element): FormInfo | null {
    let current: Element | null = element;
    const ownerDocument = element.ownerDocument || document;

    // 向上遍历DOM树查找form元素
    while (current && current !== ownerDocument.documentElement) {
        if (current.tagName.toLowerCase() === "form") {
            const form = current as HTMLFormElement;

            // 生成表单的唯一选择器，使用元素所在的document作为scope
            const formSelector = generateUniqueSelector(
                form,
                ownerDocument.documentElement
            );

            return {
                formSelector,
                form,
            };
        }
        current = current.parentElement;
    }

    return null;
}

// 向上查找第一个非SVG元素
function findNonSvgParent(element: Element): Element {
    let current = element;

    while (current) {
        // 检查是否为SVG相关元素
        const isSvgElement =
            current.tagName.toLowerCase() === "svg" ||
            current.namespaceURI === "http://www.w3.org/2000/svg" ||
            (current as any).ownerSVGElement;

        if (!isSvgElement) {
            return current;
        }

        // 向上查找父元素
        const parent = current.parentElement;
        if (!parent) {
            break;
        }
        current = parent;
    }

    return element; // 如果没找到非SVG父元素，返回原元素
}

// 查找表单控件元素
function findFormControlEle(
    element: Element,
    maxDepth: number = 3
): Element | null {
    // 如果当前元素本身就是input/select/textarea，直接返回
    const tagName = element.tagName.toLowerCase();
    if (tagName === "input" || tagName === "select" || tagName === "textarea") {
        return element;
    }

    // 如果已经达到最大深度，停止搜索
    if (maxDepth <= 0) {
        return null;
    }

    // 遍历直接子元素
    for (const child of element.children) {
        const found = findFormControlEle(child, maxDepth - 1);
        if (found) {
            return found;
        }
    }

    return null;
}

// 新增的 iframe 检测函数
function getIframeSelector(element: Element): string | null {
    // 检查元素本身是否是 iframe
    if (element.tagName.toLowerCase() === 'iframe') {
        return generateUniqueSelector(element);
    }

    // 检查元素是否在 iframe 内
    let iframeElement: HTMLIFrameElement | null = null;

    // 如果元素的 ownerDocument 不是当前主文档，说明在 iframe 内
    if (element.ownerDocument !== document) {
        const iframeWindows = findIframeWindows();

        for (const iframeWin of iframeWindows) {
            if (iframeWin.document === element.ownerDocument) {
                // 找到对应的 iframe 元素
                iframeElement = iframeWin.frameElement as HTMLIFrameElement;
                break;
            }
        }
    }

    if (iframeElement) return generateUniqueSelector(iframeElement)


    return null;
};

// 查找所有同源 iframe 的 window 对象
function findIframeWindows(): Window[] {
    const iframeWindows: Window[] = [];

    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
        try {
            // 只有同源 iframe 才能访问 contentWindow
            if (iframe.contentWindow) {
                iframeWindows.push(iframe.contentWindow);
            }
        } catch (e) {
            // 跨域 iframe 会抛出安全错误，跳过
            console.log('无法访问跨域 iframe 的内容:', e);
        }
    }

    return iframeWindows;
};

export { findParentForm, findNonSvgParent, findFormControlEle, getIframeSelector };