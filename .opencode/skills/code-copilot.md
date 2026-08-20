# Code Copilot — 前端开发辅助技能

适配项目：taotao-cloud-ui（pnpm Monorepo + Vue3/React/Svelte/Taro + TypeScript）

## 触发条件

通过 `/dev` → `/build` → `/lint` → `/test` → `/deploy` 命令触发。
通过 `帮我开发组件`、`修复这个 bug`、`创建新项目`、`代码审查` 等自然语言触发。

## 核心规则

1. **类型安全优先** — 禁止 `as any`、`@ts-ignore`、`@ts-expect-error`
2. **Composition API** — Vue3 统一使用 `<script setup lang="ts">` + Composition API
3. **状态管理统一** — 全局状态使用 Pinia store，不直接修改响应式数据
4. **共享优先** — 可复用的逻辑提取到 `packages/` 或 composables
5. **monorepo 依赖** — 跨项目引用 workspace 协议：`"@taotaocloud/core": "workspace:*"`

## 组件开发规范

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'UserAvatar' })

const props = defineProps<{
  src: string
  size?: 'small' | 'medium' | 'large'
  username?: string
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { t } = useI18n()

const avatarClass = computed(() => [
  'user-avatar',
  `user-avatar--${props.size ?? 'medium'}`
])

function handleClick(e: MouseEvent) {
  emit('click', e)
}
</script>

<template>
  <div :class="avatarClass" @click="handleClick">
    <img v-if="src" :src="src" :alt="username" />
    <span v-else class="user-avatar__placeholder">
      {{ username?.charAt(0)?.toUpperCase() }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;

  &--small { width: 24px; height: 24px; }
  &--medium { width: 40px; height: 40px; }
  &--large { width: 64px; height: 64px; }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    background: var(--primary-color, #1890ff);
    color: #fff;
    font-weight: 600;
    font-size: 0.8em;
  }
}
</style>
```

## 工作流

### `/dev` — 启动开发服务器
```bash
cd projects/taotao-cloud-admin-vue3
pnpm run dev
```

### `/build` — 生产构建
```bash
cd projects/taotao-cloud-admin-vue3
pnpm run build
```

### `/lint` — 代码检查
```bash
pnpm run lint:eslint
pnpm run lint:stylelint
pnpm run lint:prettier
pnpm run type:check
```

### `/test` — 运行测试
```bash
pnpm run test:unit
```

### `/deploy` — 部署
```bash
pnpm run build
# 产物在 projects/{name}/dist/
```
