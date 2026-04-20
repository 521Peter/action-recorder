# 动作记录器 (Action Recorder)

一个功能强大的 Chrome 浏览器扩展，用于记录网页操作并生成自动化测试代码。

## 🚀 功能特性

### 核心功能

- **操作录制**: 自动记录用户在网页上的点击、滚动等操作
- **元素定位**: 智能生成 CSS 选择器，精确定位页面元素
- **代码生成**: 将录制的操作转换为可执行的自动化测试代码
- **实时调试**: 提供调试工具，测试生成代码的准确性

### 界面功能

- **侧边栏面板**: 集成的 Chrome 侧边栏，方便操作
- **双标签页设计**:
  - 生成代码标签：录制操作和生成代码
  - 调试标签：测试
- **右键菜单**: 快速复制元素选择器

### 技术特性

- **智能去重**: 自动过滤重复的操作记录
- **数据清理**: 支持清除网站缓存和存储数据
- **脚本注入**: 动态注入 JavaScript 代码到页面

## 📦 安装方法

### 开发环境安装

1. 克隆项目到本地

```bash
git clone <repository-url>
cd action-recorder
```

2. 安装依赖

```bash
npm install
# 或使用 pnpm
pnpm install
```

3. 构建项目

```bash
npm run build
```

4. 在 Chrome 中加载扩展
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目的 `dist` 文件夹

## 🛠️ 开发指南

### 项目结构

```
action-recorder/
├── src/
│   ├── background.ts          # 后台脚本
│   ├── content.ts            # 内容脚本
│   ├── components/           # React组件
│   ├── panel/               # 侧边栏面板
│   │   ├── App/            # 主应用组件
│   │   ├── CodeGeneration/ # 代码生成组件
│   │   └── Debug/          # 调试组件
│   ├── hooks/              # React Hooks
│   ├── lib/                # 工具库
│   ├── types/              # TypeScript类型定义
│   └── utils/              # 工具函数
├── images/                 # 扩展图标
├── manifest.json          # 扩展清单文件
└── package.json          # 项目配置
```

### 开发命令

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 类型检查
npm run lint

# 预览构建结果
npm run preview

# 打包发布
npm run zip
```

### 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite + @crxjs/vite-plugin
- **UI 组件**: Radix UI + Tailwind CSS
- **代码高亮**: Prism.js
- **工具库**: Lodash + js-beautify

## 📖 使用说明

### 基本使用流程

1. **安装扩展**

   - 按照上述安装方法安装扩展

2. **打开侧边栏**

   - 点击浏览器工具栏中的扩展图标
   - 侧边栏面板将自动打开

3. **录制操作**

   - 在"生成代码"标签页中点击"开始录制"
   - 在网页上进行你想要录制的操作（点击、滚动等）
   - 点击"停止录制"结束录制

4. **生成代码**

   - 录制完成后，点击"生成代码"按钮
   - 系统将自动生成对应的自动化测试代码
   - 可以复制代码用于测试框架
