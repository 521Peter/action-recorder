import { generateUniqueSelector } from './utils/genSelector'
import { ElementTypeDetector, LabelExtractor } from './utils/formElementParser'

// 表单信息接口
interface FormInfo {
    formSelector: string
    form: Element
}

// 查找元素所属的表单
function findParentForm(element: Element): FormInfo | null {
    let current: Element | null = element
    const ownerDocument = element.ownerDocument || document

    // 向上遍历DOM树查找form元素
    while (current && current !== ownerDocument.documentElement) {
        if (current.tagName.toLowerCase() === 'form') {
            const form = current as HTMLFormElement

            // 生成表单的唯一选择器，使用元素所在的document作为scope
            const formSelector = generateUniqueSelector(form, ownerDocument.documentElement)

            return {
                formSelector,
                form
            }
        }
        current = current.parentElement
    }

    return null
}

let isRecording = false
let clickHandler: ((event: MouseEvent) => void) | null = null
let scrollHandler: (() => void) | null = null
let scrollTimeout: number | null = null
let lastScrollPosition = { top: 0, left: 0 }
let hasRecordedScrollSinceLastClick = false

// 监听来自 content script 的消息
window.addEventListener('message', (event) => {
    if (event.source !== window) return

    if (event.data.type === 'START_RECORDING') {
        startRecording()
    } else if (event.data.type === 'STOP_RECORDING') {
        stopRecording()
    }
})

function startRecording() {
    if (isRecording) return

    isRecording = true

    // 创建点击事件处理器
    clickHandler = (event: MouseEvent) => {
        // 阻止默认行为和事件冒泡
        // event.preventDefault()
        // event.stopPropagation()

        const target = event.target as Element
        if (!target) return

        // 查找所属表单并获取formSelector
        const formInfo = findParentForm(target)

        // 生成选择器
        const selector = formInfo?.form ? generateUniqueSelector(target, formInfo?.form) : generateUniqueSelector(target)

        // 获取元素文本
        let text = ''

        // 如果是 a 标签或 button，获取其文本内容
        if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button') {
            text = target.textContent?.trim() || ''
        }
        // 如果是 input 按钮，获取 value 或 placeholder
        else if (target.tagName.toLowerCase() === 'input') {
            const input = target as HTMLInputElement
            if (input.type === 'button' || input.type === 'submit') {
                text = input.value || input.placeholder || ''
            }
        }
        // 其他元素也尝试获取文本内容
        else {
            text = target.textContent?.trim() || ''
            // 如果文本太长，截取前50个字符
            if (text.length > 50) {
                text = text.substring(0, 50) + '...'
            }
        }

        // 使用ElementTypeDetector确定元素类型
        const elementType = ElementTypeDetector.determineElementType(target, selector)

        // 使用LabelExtractor获取标签文本
        const label = LabelExtractor.getLabelText(selector)

        // 发送点击数据到 content script
        window.postMessage({
            type: 'ELEMENT_CLICKED',
            data: {
                selector,
                text,
                tagName: target.tagName.toLowerCase(),
                className: target.className,
                id: target.id,
                elementType: elementType,
                label: label,
                formSelector: formInfo?.formSelector || null
            }
        }, '*')

        // 重置滚动记录标记，允许记录下一次滚动
        hasRecordedScrollSinceLastClick = false

        // 添加视觉反馈
        addClickFeedback(target)
    }

    // 创建滚动事件处理器
    scrollHandler = () => {
        // 清除之前的超时
        if (scrollTimeout) {
            clearTimeout(scrollTimeout)
        }

        // 设置延迟，避免频繁触发
        scrollTimeout = window.setTimeout(() => {
            const currentScrollTop = window.scrollY || document.documentElement.scrollTop
            const currentScrollLeft = window.scrollX || document.documentElement.scrollLeft

            // 检查滚动位置是否真的发生了变化，并且还没有记录过这次滚动序列
            if ((currentScrollTop !== lastScrollPosition.top || currentScrollLeft !== lastScrollPosition.left) && !hasRecordedScrollSinceLastClick) {
                recordScrollEvent(currentScrollTop, currentScrollLeft)
                lastScrollPosition = { top: currentScrollTop, left: currentScrollLeft }
                hasRecordedScrollSinceLastClick = true
            }
        }, 150)
    }

    // 添加点击事件监听器，使用捕获阶段确保能够拦截所有点击
    document.addEventListener('click', clickHandler, true)

    // 添加滚动事件监听器
    window.addEventListener('scroll', scrollHandler, { passive: true })

    // 记录初始滚动位置
    lastScrollPosition = {
        top: window.scrollY || document.documentElement.scrollTop,
        left: window.scrollX || document.documentElement.scrollLeft
    }

    // 添加录制状态指示器
    addRecordingIndicator()

    console.log('页面点击和滚动录制已开始')
}

function stopRecording() {
    if (!isRecording) return

    isRecording = false

    // 移除点击事件监听器
    if (clickHandler) {
        document.removeEventListener('click', clickHandler, true)
        clickHandler = null
    }

    // 移除滚动事件监听器
    if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler)
        scrollHandler = null
    }

    // 清除滚动超时
    if (scrollTimeout) {
        clearTimeout(scrollTimeout)
        scrollTimeout = null
    }

    // 重置滚动状态
    lastScrollPosition = { top: 0, left: 0 }
    hasRecordedScrollSinceLastClick = false

    // 移除录制状态指示器
    removeRecordingIndicator()

    console.log('页面点击和滚动录制已停止')
}

function addClickFeedback(element: Element) {
    // 添加临时的视觉反馈
    const originalStyle = (element as HTMLElement).style.outline
        ; (element as HTMLElement).style.outline = '2px solid #ff4444'

    setTimeout(() => {
        ; (element as HTMLElement).style.outline = originalStyle
    }, 500)
}

function addRecordingIndicator() {
    // 创建录制状态指示器
    const indicator = document.createElement('div')
    indicator.id = 'click-recorder-indicator'
    indicator.innerHTML = '🔴 正在录制点击'
    indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(255, 68, 68, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    z-index: 999999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    animation: pulse 2s infinite;
  `

    // 添加脉冲动画
    const style = document.createElement('style')
    style.textContent = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
  `
    document.head.appendChild(style)
    document.body.appendChild(indicator)
}

function removeRecordingIndicator() {
    const indicator = document.getElementById('click-recorder-indicator')
    if (indicator) {
        indicator.remove()
    }
}

function recordScrollEvent(scrollTop: number, scrollLeft: number) {
    // 发送滚动数据到 content script
    window.postMessage({
        type: 'SCROLL_DETECTED',
        data: {
            scrollTop,
            scrollLeft
        }
    }, '*')
}