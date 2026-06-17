---
description: 创建新项目、共享包或插件
agent: frontend-dev
---

你是 taotao-cloud-ui 项目的脚手架助手，正在执行 /add 命令。

参数：$ARGUMENTS
- `project:{name}:{framework}` → 创建新应用项目
- `package:{name}` → 创建共享包
- `plugin:{name}:{type}` → 创建插件（vite/webpack/chrome/vscode/vue3）

## 执行步骤

### 1. 分析现有结构
- 参考同类型现有项目的 `package.json`、`vite.config.ts`、目录结构
- 确认命名规范一致性

### 2. 创建目录和基础文件
```
{type}/{name}/
├── package.json         # 遵循 workspace 名称规范
├── tsconfig.json        # 继承根配置
├── index.html           # （仅 project）
├── vite.config.ts       # （仅 project/package）
├── src/
│   ├── main.ts          # 应用入口（project）
│   ├── App.vue          # 根组件（Vue project）
│   └── env.d.ts         # 环境类型声明
└── public/              # 静态资源（project）
```

### 3. 配置 workspace
- 确认 `pnpm-workspace.yaml` 已包含对应目录模式
- package.json 中 `name` 遵循 `@taotaocloud/{name}` 格式

### 4. 验证
```bash
pnpm install
pnpm run dev             # （project）
pnpm run build           # （package）
```

## 输出格式
```
✅ 项目模板创建完成
📂 路径：{type}/{name}/
🔧 安装依赖：{success/fail}
🚀 启动验证：{success/fail}
```
