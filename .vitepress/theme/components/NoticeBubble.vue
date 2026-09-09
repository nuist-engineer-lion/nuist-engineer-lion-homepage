<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vitepress'
import { data as notices } from '../notices.data.mts'

// 全站右下角浮动通知气泡：展示最新一条通知
// 关闭状态记录在 localStorage，同一通知只弹一次；新通知合入后自动重新弹出
const route = useRoute()
const latest = notices[0]
const DISMISS_KEY = 'notice-dismissed-url'

const visible = ref(false)

function fmt(d) {
  return new Date(d).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  visible.value = !!latest && localStorage.getItem(DISMISS_KEY) !== latest.url
})

function dismiss() {
  visible.value = false
  if (latest) {
    try {
      localStorage.setItem(DISMISS_KEY, latest.url)
    } catch {
      /* 隐私模式下忽略 */
    }
  }
}
</script>

<template>
  <transition name="notice-bubble-fade">
    <div
      v-if="visible && latest && !route.path.startsWith('/notices')"
      class="notice-bubble"
      role="status"
    >
      <div class="notice-bubble-head">
        <span class="notice-bubble-badge">最新通知</span>
        <time class="notice-bubble-date">{{ fmt(latest.frontmatter.date) }}</time>
        <button class="notice-bubble-close" aria-label="关闭通知" @click="dismiss">×</button>
      </div>
      <a :href="latest.url" class="notice-bubble-link">
        <p class="notice-bubble-title">{{ latest.frontmatter.title }}</p>
        <div v-if="latest.excerpt" class="notice-bubble-excerpt" v-html="latest.excerpt" />
      </a>
      <span class="notice-bubble-tail" aria-hidden="true" />
    </div>
  </transition>
</template>

<style scoped>
.notice-bubble {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 40;
  width: 320px;
  max-width: calc(100vw - 32px);
  padding: 14px 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
}

/* 方形气泡尾巴：旋转 45° 的小方块 */
.notice-bubble-tail {
  position: absolute;
  right: 34px;
  bottom: -7px;
  width: 12px;
  height: 12px;
  background: var(--vp-c-bg);
  border-right: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  transform: rotate(45deg);
  pointer-events: none;
}

.notice-bubble-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.notice-bubble-badge {
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.notice-bubble-date {
  flex: 1;
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-align: right;
}

.notice-bubble-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 16px;
  line-height: 1;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}

.notice-bubble-close:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.notice-bubble-link {
  display: block;
  text-decoration: none;
}

.notice-bubble-title {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.notice-bubble-link:hover .notice-bubble-title {
  color: var(--vp-c-brand-1);
}

.notice-bubble-excerpt {
  font-size: 13px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notice-bubble-excerpt p {
  margin: 0;
}

.notice-bubble-fade-enter-active,
.notice-bubble-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.notice-bubble-fade-enter-from,
.notice-bubble-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 560px) {
  .notice-bubble {
    right: 16px;
    bottom: 16px;
    width: calc(100vw - 32px);
  }
}
</style>
