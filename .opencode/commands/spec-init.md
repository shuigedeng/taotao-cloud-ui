---
description: 分析项目结构并生成上下文参考
agent: frontend-dev
---

你是 taotao-cloud-ui 项目的架构分析师，正在执行 /spec-init 命令。

## 任务目标

分析现有前端项目的工程结构、依赖关系和配置模式，为新项目/包提供参考。

## 执行步骤

### 1. 分析 Monorepo 结构
- 使用 `read` 读取根目录结构
- 识别所有 `projects/*`、`packages/*`、`plugin/*` 模块
- 确认 `pnpm-workspace.yaml` 中的 workspace 定义

### 2. 分析技术栈
- Vue / React / Svelte / Taro 版本和用法
- Vite / Webpack 构建配置
- TypeScript 配置和严格程度
- CSS 方案（SCSS / Less / WindiCSS）
- UI 框架（Quasar / Ant Design Vue）

### 3. 分析代码模式
- 组件组织方式（`src/components/` + `src/views/`）
- 状态管理（Pinia store 模式）
- API 请求封装（axios 拦截器模式）
- 路由配置（懒加载模式）
- 国际化方案（vue-i18n 语言文件结构）

### 4. 分析代码质量配置
- ESLint 规则集（Vue3 + TS + Prettier）
- Stylelint 配置（SCSS 标准）
- Prettier 格式化配置
- husky + lint-staged 提交钩子

### 5. 输出项目上下文
生成分析报告，包含：
- 项目全貌（模块 + 职责）
- 技术栈清单
- 组件/页面/API 标准模板
- 常用操作指引
