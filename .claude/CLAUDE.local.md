# 本地开发配置（个人）

## 开发环境
- **编辑器**: VS Code + Volar + ESLint + Prettier
- **终端**: PowerShell 7（Windows）
- **包管理**: pnpm 9.x

## 本地工作流
- 开发前先 `pnpm run type:check`
- 提交前 `pnpm run lint:*` 全部通过
- 先更新共享包 `pnpm shared:build` 再构建应用

## 常用项目别名
- `manager` → `projects/taotao-cloud-admin-vue3`
- `front` → `projects/taotao-cloud-front-vue3`
- `datav` → `projects/taotao-cloud-datav-vue3`

## 本地构建优化
- `pnpm install --frozen-lockfile` 避免 lock 变更
- `pnpm store prune` 定期清理缓存
