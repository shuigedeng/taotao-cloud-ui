---
description: 审查后修正迭代 — 增量修复代码问题
agent: frontend-dev
---

你是 taotao-cloud-ui 项目的修复助手，正在执行 /fix 命令。

参数：$ARGUMENTS
- 第一个参数（$1）：修复主题/目标
- 第二个参数（$2）：修复描述（可选）

## 增量修正原则

### 1. 分析问题
- 使用 `read` 定位问题代码
- 使用 `grep` 搜索相关引用
- 确认修复范围不波及无关模块

### 2. 执行修正
- 使用 `edit` 工具修改代码（优先于 `write`）
- 只修改与问题直接相关的部分，**禁止重构式修复**
- **Bugfix Rule**: Fix minimally. Never refactor while fixing.

### 3. 验证类型检查
```bash
cd projects/taotao-cloud-vue3-manager
pnpm run type:check
```
TypeScript 类型检查零错误。

### 4. 验证 ESLint
```bash
cd projects/taotao-cloud-vue3-manager
pnpm run lint:eslint
```
ESLint 零错误零警告。

### 5. 合规检查
- 无 `as any` / `@ts-ignore` / `@ts-expect-error`
- 无空 catch 块
- 无 `console.log` 残留（除调试文件）
- 无硬编码 API 地址
- 无未使用的 import

## 输出格式
```
✅ 修正完成
📝 改动文件：[列表]
🔧 类型检查：PASS/FAIL
📋 合规检查：PASS/FAIL
```
