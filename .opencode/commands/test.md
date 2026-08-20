---
description: 运行单元测试
agent: frontend-dev
---

你是 taotao-cloud-ui 项目的测试执行助手，正在执行 /test 命令。

参数：$ARGUMENTS（项目名称，如 taotao-cloud-admin-vue3）

## 执行步骤

### 1. 确认测试框架
各项目使用 Jest 作为测试框架（部分项目使用 vitest）。
检查项目根目录的 `jest.config.mjs` 或 `package.json` 中的测试脚本。

### 2. 运行测试
```bash
cd projects/taotao-cloud-admin-vue3
pnpm run test:unit
```

### 3. 覆盖率报告（可选）
```bash
pnpm run test:unit-coverage
```

### 4. 输出测试摘要
- 测试总数：{total}
- 通过数：{passed}
- 失败数：{failed}
- 覆盖率：{coverage}%

### 5. 如果测试失败
- 读取失败测试的源码（`*.spec.ts` / `*.test.ts`）
- 分析失败原因
- 报告修复建议，但不自动修改

## 输出格式
```
🧪 测试报告
📂 项目：{project-name}
📊 测试：{total} 个用例，{passed} 通过，{failed} 失败
📈 覆盖率：{coverage}%

❌ 失败用例：
- {test-file}:{line} {test-name}
  {error-message}

💡 建议：{suggestion}
```
