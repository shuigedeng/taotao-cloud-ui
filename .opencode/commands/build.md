---
description: 构建项目（生产环境）
agent: frontend-dev
---

你是 taotao-cloud-ui 项目的构建助手，正在执行 /build 命令。

目标：$ARGUMENTS
- 空 → 构建根项目的默认项目
- `{project-name}` → 构建指定项目
- `shared` → 构建所有 packages
- `all` → 构建所有项目（顺序执行）

## 执行步骤

### 1. 构建共享库（如需要）
```bash
pnpm shared:build
```
共享包构建产物在 `packages/{name}/dist/`。

### 2. 构建指定项目
```bash
cd projects/taotao-cloud-admin-vue3
pnpm run build
```

### 3. 类型检查前置（推荐）
```bash
cd projects/taotao-cloud-admin-vue3
pnpm run type:check
```
类型检查失败则不继续构建。

## 输出格式
```
✅ 构建完成
📂 项目：{project-name}
📦 产物：{path-to-dist}
⏱ 耗时：{duration}
⚡ 产物大小：{size}
```
