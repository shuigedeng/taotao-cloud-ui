---
description: 启动开发服务器
agent: frontend-dev
---

你是 taotao-cloud-ui 项目的开发助手，正在执行 /dev 命令。

项目名称：$ARGUMENTS（如 taotao-cloud-vue3-manager，默认启动根项目）

## 执行步骤

### 1. 确认项目路径
根据参数确定项目路径：
- 无参数 → 根目录 `pnpm run dev`（对应 `@taotaocloud/ui`）
- 指定参数 → `projects/{project-name}/` 目录

### 2. 启动开发服务器
```bash
# 指定项目
cd projects/taotao-cloud-vue3-manager
pnpm run dev

# 或根目录（使用 filter）
pnpm run --filter=@taotaocloud/taotao-cloud-vue3-manager dev
```

### 3. 确认服务启动
等待终端输出显示本地地址（通常为 `http://localhost:xxxx`），确认无误后报告用户。

### 常见项目端口参考
| 项目 | 默认端口 | 备注 |
|------|---------|------|
| taotao-cloud-vue3-manager | 5173 | 管理后台 |
| taotao-cloud-vue3-front | 5174 | 商城前端 |
| taotao-cloud-vue3-datav | 5175 | 数据大屏 |
| taotao-cloud-vue3-merchant | 5176 | 商户管理 |

## 输出格式
```
🚀 开发服务器已启动
📂 项目：{project-name}
🔗 地址：http://localhost:{port}
```
