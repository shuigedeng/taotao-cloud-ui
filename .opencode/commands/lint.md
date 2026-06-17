---
description: 运行代码检查和格式化
agent: frontend-dev
---

你是 taotao-cloud-ui 项目的代码质量助手，正在执行 /lint 命令。

范围：$ARGUMENTS
- 空 → 全部检查（eslint + stylelint + prettier + typecheck）
- `eslint` → 仅 ESLint
- `stylelint` → 仅 Stylelint
- `prettier` → 仅 Prettier 格式化
- `typecheck` / `tsc` → 仅 TypeScript 类型检查
- `{project-name}:{scope}` → 指定项目 + 范围

## 执行步骤

### 1. ESLint 检查
```bash
cd projects/taotao-cloud-vue3-manager
pnpm run lint:eslint
```

### 2. Stylelint 检查
```bash
cd projects/taotao-cloud-vue3-manager
pnpm run lint:stylelint
```

### 3. Prettier 格式化
```bash
cd projects/taotao-cloud-vue3-manager
pnpm run lint:prettier
```

### 4. TypeScript 类型检查
```bash
cd projects/taotao-cloud-vue3-manager
pnpm run type:check
```

## 规则
- ESLint 使用 `--max-warnings 0` 模式，不允许任何警告
- Stylelint 自动修复（`--fix`）
- 类型检查失败 → 停止构建
- 对 monorepo 批量检查应使用 pnpm filter

## 输出格式
```
📋 Lint 报告
✅ ESLint: {pass/fail} ({issues} warnings)
✅ Stylelint: {pass/fail}
✅ Prettier: {pass/fail}
✅ TypeScript: {pass/fail}
```
