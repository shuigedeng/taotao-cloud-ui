# taotao-cloud-ui 前端 Monorepo

Vue3 / Quasar / Vite / TypeScript 多框架前端 Monorepo。pnpm workspace 管理，6+ 技术栈（Vue3/React/Svelte/Taro/Tauri），覆盖平台管理、商城、数据大屏、开放平台等场景。

## 目录结构

```
./
├── packages/              # 共享库（发布到 npm）
│   ├── core/               # 核心工具（axios、加密、工具函数）
│   ├── apis/               # 统一 API 请求层
│   ├── components/         # 公共 UI 组件库
│   └── bpmn-*/             # BPMN 流程相关
├── projects/               # 独立应用
│   ├── taotao-cloud-vue3-manager/   # 管理后台（Ant Design Vue）
│   ├── taotao-cloud-vue3-front/     # 商城前端（Quasar）
│   ├── taotao-cloud-vue3-datav/     # 数据大屏
│   ├── taotao-cloud-vue3-merchant/  # 商户管理
│   ├── taotao-cloud-vue3-open/      # 开放平台
│   ├── taotao-cloud-taro-mall/      # 移动端（Taro + RN）
│   ├── taotao-cloud-react-*/        # React 项目
│   ├── taotao-cloud-svelte/         # Svelte 项目
│   ├── taotao-cloud-tauri/          # Tauri 桌面应用
│   └── taotao-cloud-workflow-*/     # 工作流项目
└── plugin/                 # 构建插件
    ├── taotao-cloud-vite-plugin/
    ├── taotao-cloud-webpack-plugin/
    └── taotao-cloud-vscode-plugin/
```

## 关键约定

### Vue3 组件
- `<script setup lang="ts">` + Composition API
- `defineOptions({ name: 'ComponentName' })`
- Props/Emits 类型声明（非运行时）
- SCSS scoped 样式，BEM 命名

### TypeScript
- 禁止 `as any`、`@ts-ignore`、`@ts-expect-error`
- 优先 `interface` 而非 `type`
- 函数参数和返回值显式类型标注

### 状态管理
- Pinia store 管理全局状态
- store action 处理异步逻辑
- 跨页面共享用 store，非 props 透传

### API 层
- axios 统一拦截器在 `src/api/` 封装
- Token 注入、错误处理统一
- 环境变量 `VITE_API_BASE_URL`

### 样式
- SCSS + CSS Modules
- 禁止 `!important`（覆盖三方库除外）
- 变量使用 SCSS 变量 / CSS 自定义属性

## 构建命令

```bash
pnpm install                           # 安装依赖
pnpm dev                               # 启动默认项目
pnpm shared:build                      # 构建所有 packages
cd projects/taotao-cloud-vue3-manager
pnpm run dev                           # 启动开发服务器
pnpm run build                         # 生产构建
pnpm run lint:eslint                   # ESLint
pnpm run lint:stylelint                # Stylelint
pnpm run lint:prettier                 # Prettier
pnpm run type:check                    # vue-tsc 类型检查
pnpm run test:unit                     # Jest 单元测试
```

## 依赖管理
- 根 `package.json` 只放工具链
- 项目独立声明业务依赖
- 共享包使用 `"@taotaocloud/core": "workspace:*"`
- 仅使用 pnpm

## 环境变量
各项目下 `.env.development` / `.env.production` / `.env.test` 管理
统一使用 `VITE_` 前缀

## 禁止模式
- 跨项目复制代码（应提取到 `packages/`）
- 硬编码 API 地址
- 组件内联超过 200 行
- 在 Pinia store 外直接操作响应式数据
- 忽略 TypeScript 类型
