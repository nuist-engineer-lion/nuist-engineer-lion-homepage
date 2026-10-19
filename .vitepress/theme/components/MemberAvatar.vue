<script setup lang="ts">
import { ref, watch } from 'vue'

// 圆形成员头像：图片加载失败或没有头像时，退回显示名字首字母。
const props = defineProps<{ src: string; name: string; size?: number }>()

const failed = ref(false)
watch(() => props.src, () => (failed.value = false))
</script>

<template>
  <span class="member-avatar" :style="{ '--size': `${size ?? 150}px` }">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="`${name} 的头像`"
      loading="lazy"
      referrerpolicy="no-referrer"
      @error="failed = true"
    />
    <span v-else class="member-avatar-initial">{{ name.charAt(0).toUpperCase() }}</span>
  </span>
</template>

<style scoped>
.member-avatar {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--size);
  height: var(--size);
  overflow: hidden;
  border-radius: 50%;
  background: var(--vp-c-brand-soft);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-avatar-initial {
  font-size: calc(var(--size) * 0.4);
  font-weight: 700;
  color: var(--vp-c-brand-1);
}
</style>
