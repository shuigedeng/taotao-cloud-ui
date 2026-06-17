---
description: 归档已完成变更并更新项目上下文
agent: frontend-dev
---

你是 taotao-cloud-ui 项目的归档助手，正在执行 /archive 命令。

变更名称：$ARGUMENTS

## 归档流程

### 1. 记录变更总结
记录以下信息：
- 变更涉及的项目/包和文件
- 新增/修改的组件
- 新增/修改的 API 封装
- 依赖变更（新增/移除的依赖及其版本）
- 关键决策和理由

### 2. 更新 AGENTS.md（如果需要）
如果变更引入了：
- 新项目 → 更新 STRUCTURE 章节
- 新约定 → 更新 CONVENTIONS 章节
- 新禁止项 → 更新 ANTI-PATTERNS 章节
- 新技术栈 → 更新 KEY TECHNOLOGIES 章节

### 3. 清理临时文件
- 清理 `node_modules/.cache/`
- 清理 `dist/` 临时构建产物

## 输出格式
```
🎉 归档完成
📂 变更：[变更名称]
📋 涉及文件：[数量] 个
📝 知识记录：[是否更新 AGENTS.md]
```
