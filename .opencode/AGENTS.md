# PROJECT KNOWLEDGE BASE

**Generated:** 2026-06-17
**Project:** taotao-cloud-ui — 企业级前端 Monorepo

## OVERVIEW

taotao-cloud-ui 是 taotao-cloud 生态的前端大一统 Monorepo，采用 **pnpm workspace** 管理，涵盖 Vue3、React、Svelte、Taro 等多框架项目。提供共享组件库、业务 API 封装、构建工具插件等基础设施。

对应 GitHub: https://github.com/shuigedeng/taotao-cloud-ui

## STRUCTURE

```
taotao-cloud-ui/
├── packages/                          # 共享库（发布到 npm 的包）
│   ├── core/                          # 核心工具库（axios、加密、工具函数）
│   ├── apis/                          # 统一 API 请求层
│   ├── components/                    # 公共 UI 组件库
│   ├── bpmn-apis/                     # BPMN 流程 API 封装
│   └── bpmn-designer/                 # BPMN 流程设计器
├── projects/                          # 独立应用项目
│   ├── taotao-cloud-vue3-manager/     # 平台管理后台（Ant Design Vue）
│   ├── taotao-cloud-vue3-front/       # 商城前端（Quasar）
│   ├── taotao-cloud-vue3-datav/       # 数据大屏
│   ├── taotao-cloud-vue3-merchant/    # 商户管理端
│   ├── taotao-cloud-vue3-open/        # 开放平台
│   ├── taotao-cloud-taro-mall/        # 移动端商城（Taro + React Native）
│   ├── taotao-cloud-react-mall/       # React 版商城
│   ├── taotao-cloud-react-manager/    # React 版管理后台
│   ├── taotao-cloud-svelte/           # Svelte 项目
│   ├── taotao-cloud-tauri/            # Tauri 桌面应用
│   ├── taotao-cloud-workflow-web/     # 工作流 Web 端
│   └── taotao-cloud-workflow-app/     # 工作流 App 端
├── plugin/                            # 构建/工具插件
│   ├── taotao-cloud-vite-plugin/      # Vite 插件
│   ├── taotao-cloud-webpack-plugin/   # Webpack 插件
│   ├── taotao-cloud-vue3-plugin/      # Vue3 插件
│   ├── taotao-cloud-chrome-plugin/    # Chrome 扩展
│   └── taotao-cloud-vscode-plugin/    # VSCode 扩展
├── .opencode/                         # OpenCode AI 配置
├── .claude/                           # Claude AI 配置（历史遗留）
├── package.json                       # 根 workspace 配置
├── pnpm-workspace.yaml                # pnpm 工作区定义
├── tsconfig.json                      # 根 TypeScript 配置
├── .eslintrc.js                       # ESLint 配置（Vue3 + TS + Prettier）
├── .prettierrc                        # Prettier 格式化配置
├── .stylelintrc.json                  # Stylelint 配置（SCSS）
└── vite.config.ts / vite.config.*     # Vite 构建配置（各项目独立）
```

## WHERE TO LOOK

| 任务 | 位置 |
|------|------|
| 新增应用项目 | `projects/{name}/` — 参考现有项目结构 |
| 新增共享包 | `packages/{name}/` — 遵循 package.json 导出规范 |
| 新增插件 | `plugin/{name}/` — 对应构建工具类型 |
| 公共 API 封装 | `packages/apis/` |
| 公共组件 | `packages/components/` |
| 核心工具函数 | `packages/core/src/lib/` |
| 应用入口 | 各项目下的 `src/main.ts` / `src/App.vue` |
| 路由配置 | 各项目下的 `src/router/` |
| 状态管理 | 各项目下的 `src/store/`（Pinia） |
| 国际化 | 各项目下的 `src/locales/`（vue-i18n） |
| 视图页面 | 各项目下的 `src/views/` |
| API 接口层 | 各项目下的 `src/api/` |

## CONVENTIONS

### 命名规范
- **项目名**: `taotao-cloud-{framework}-{app}`（如 taotao-cloud-vue3-manager）
- **包名**: `@taotaocloud/{name}`（如 @taotaocloud/core）
- **组件**: PascalCase（如 `UserAvatar.vue`、`AppTable.vue`）
- **文件/目录**: kebab-case（如 `user-profile.ts`、`api-service.ts`）
- **变量/函数**: camelCase（如 `getUserList()`、`isLoading`）
- **常量/枚举**: PascalCase / UPPER_SNAKE_CASE

### Vue3 组件规范
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store'

defineOptions({ name: 'UserProfile' })
const props = defineProps<{ userId: string }>()
const emit = defineEmits<{ update: [id: string] }>()

const store = useUserStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await store.fetchUser(props.userId)
  loading.value = false
})
</script>

<template>
  <div class="user-profile">
    <p v-if="loading">加载中...</p>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.user-profile {
  padding: 16px;
}
</style>
```

### 项目特有规范
- **UI 框架**: Quasar（商城前端）/ Ant Design Vue（管理后台）
- **状态管理**: Pinia（统一使用，自带 `pinia-plugin-persistedstate`）
- **样式方案**: SCSS + CSS Modules
- **国际化**: vue-i18n + 语言文件在 `locales/` 目录
- **请求封装**: axios 统一拦截器（token 注入、错误处理）
- **代码提交**: conventional-changelog + commitizen
- **代码格式化**: Prettier + ESLint + Stylelint 三级防线

### TypeScript 规范
```typescript
// 优先使用 interface 而非 type
interface UserInfo {
  id: number
  name: string
  avatar?: string
}

// 枚举使用 const enum（可内联优化）
const enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

// 函数类型显式标注
type ApiResponse<T> = {
  code: number
  data: T
  message: string
}
```

### 依赖管理
- 根 `package.json` 只放工具链（eslint、prettier、typescript 等）
- 各项目独立声明业务依赖（ant-design-vue、quasar 等）
- 共享包通过 pnpm workspace 协议引用：`"@taotaocloud/core": "workspace:*"`
- 禁止在根安装运行时依赖
- 使用 `pnpm` 作为唯一包管理器（preinstall 钩子强制校验）

## ANTI-PATTERNS (THIS PROJECT)

- 在共享包中引入框架特定依赖（如 ant-design-vue、quasar）
- 跨项目直接引用源码路径（应通过 package.json exports 引用打包产物）
- 硬编码 API 域名（应使用 `.env` 文件 + Vite 环境变量 `VITE_API_BASE_URL`）
- 组件内联超过 200 行（应拆分为子组件或 composables）
- 在 Pinia store 外直接操作响应式数据（应通过 store action）
- 忽略 TypeScript 类型（禁止 `as any`、`@ts-ignore`）
- 样式文件中使用 `!important`（除非覆盖第三方库）
- 不同项目间复制粘贴代码（应提取到 `packages/` 共享）

## UNIQUE STYLES

- **Monorepo 大一统**：6+ 框架（Vue3/React/Svelte/Taro/Tauri）共存在同一仓库
- **多框架共享**：通过 `packages/` 共享 API 封装、工具函数、类型定义
- **分项目构建**：每个项目独立 Vite 配置，互不干扰
- **CI/CD 矩阵构建**：GitHub Actions 按项目矩阵并行构建
- **Docker 多阶段构建**：nginx + 静态资源分离
- **K8s 部署**：每个项目独立部署，ingress 统一路由
- **B2B2C 全场景**：覆盖平台管理、商户管理、商城前端、开放平台、数据大屏

## KEY TECHNOLOGIES

| 领域 | 技术选型 |
|------|---------|
| 核心框架 | Vue 3.5 (Composition API + `<script setup>`) |
| UI 框架 | Quasar 2.19 / Ant Design Vue 3.2 |
| 构建工具 | Vite 8.x / Webpack 5.x |
| 包管理器 | pnpm 9.x (workspace) |
| 语言 | TypeScript 5.x |
| 状态管理 | Pinia 2.x (+ persist) |
| 路由 | Vue Router 4.x |
| 国际化 | vue-i18n 11.x |
| HTTP 请求 | Axios 1.x (统一拦截器) |
| CSS 方案 | SCSS / Less / WindiCSS |
| 代码质量 | ESLint + Prettier + Stylelint |
| 提交规范 | commitizen + conventional-changelog |
| Git Hooks | husky + lint-staged |
| 测试 | Jest 29.x |
| 移动端 | Taro (React Native / 小程序 / H5) |
| 桌面端 | Tauri |
| 流程设计 | LogicFlow / BPMN |
| 图表 | ECharts 5.x |
| 组件库 | TinyMCE / Vditor / CodeMirror |
| 部署 | Docker / K8s / Nginx |

## BUILD COMMANDS

```bash
# 根目录操作
pnpm install                          # 安装所有依赖
pnpm dev                              # 启动默认项目（@taotaocloud/ui）
pnpm prod                             # 生产构建默认项目
pnpm shared:build                     # 构建所有 packages

# 各项目自身命令（以 manager 为例）
cd projects/taotao-cloud-vue3-manager
pnpm run dev                          # 启动开发服务器
pnpm run build                        # 生产构建
pnpm run build:test                   # 测试环境构建
pnpm run lint:eslint                  # ESLint 检查
pnpm run lint:stylelint               # Stylelint 检查
pnpm run lint:prettier                # Prettier 格式化
pnpm run type:check                   # TypeScript 类型检查（vue-tsc）
pnpm run test:unit                    # 运行 Jest 单元测试
pnpm run preview                      # 预览构建产物

# 全局 lint
pnpm run commit                       # commitizen 交互式提交
```

## NOTES

- 各个项目使用独立的 `vite.config.ts`，不会相互干扰
- `.env.development` / `.env.production` / `.env.test` 管理环境变量
- 统一使用 `VITE_API_BASE_URL` 作为 API 地址环境变量
- 所有项目入口统一为 `src/main.ts`，挂载 `App.vue`
- mock 数据在各项目中 `mock/` 目录（vite-plugin-mock）
- 共享包的构建产物在 `packages/{name}/dist/` 目录
- CI/CD 使用 GitHub Actions，配置在 `.github/` 目录
- 部分项目（taotao-cloud-vue3-manager）基于 vue-vben-admin 模板二次开发
