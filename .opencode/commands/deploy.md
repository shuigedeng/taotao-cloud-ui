---
description: 构建并部署前端项目
agent: frontend-dev
---

你是 taotao-cloud-ui 项目的发布助手，正在执行 /deploy 命令。

目标：$ARGUMENTS
- 格式：`{project-name}:{env}`（如 `manager:production`）
- `{project-name}` → 构建 + 输出部署配置
- 空 → 列出可用部署目标

## 部署流程

### 1. 运行类型检查
```bash
cd projects/{project-name}
pnpm run type:check
```
类型检查失败中止部署。

### 2. 运行 lint
```bash
pnpm run lint:eslint
pnpm run lint:stylelint
```

### 3. 生产构建
```bash
pnpm run build
```
构建产物在 `projects/{project-name}/dist/`。

### 4. 确认构建产物
- 检查 `dist/` 目录存在
- 检查 `index.html` 入口文件
- 检查静态资源完整性（js/css/fonts）
- 检查 gzip / brotli 压缩是否生效（如果配置）

### 5. 输出部署配置
列出部署所需信息：
- 构建产物路径
- 目标环境（production / test）
- Dockerfile 位置（如有）
- nginx 配置参考

## 输出格式
```
🚀 部署准备完成
📂 项目：{project-name}
📦 构建产物：projects/{project-name}/dist/
🎯 环境：{env}
📋 部署方式：{docker/static/kubernetes}
```
