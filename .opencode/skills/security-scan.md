# Security Scan — 前端安全扫描技能

适配项目：taotao-cloud-ui（Vue3/React/TypeScript 前端应用）

## 检查项

### 1. 敏感信息泄露
```bash
# 检查 .env 文件中的敏感信息
grep -r "password\|secret\|token\|jwt-secret\|access-key\|api-key" \
  --include="*.env*" --include="*.env.*" \
  --include="*.ts" --include="*.js" --include="*.vue" \
  --exclude-dir=node_modules --exclude-dir=dist .
```

### 2. XSS 漏洞
- `v-html` 使用审计（确认内容已消毒）
- `dangerouslySetInnerHTML` 使用审计（React 项目）
- innerHTML 直接赋值（非 Vue/React 受控模式）

### 3. 第三方依赖漏洞
```bash
# 检查已知漏洞
pnpm audit
```

### 4. API 安全
- Token 存储在 httpOnly cookie（优先）vs localStorage
- API 请求统一使用 axios 拦截器注入 token
- 敏感接口校验来源（Referer / Origin）

### 5. 依赖供应链安全
- 锁定依赖版本（使用 `pnpm-lock.yaml`）
- 定期 `pnpm audit` 检查

## 输出格式
```
🔒 安全扫描报告

✅ 通过：
- [通过的检查项]

⚠️ 警告：
- [警告项]

❌ 风险：
- [严重度] [位置] [风险描述]
```
