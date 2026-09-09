<script setup>
import { data as notices } from '../notices.data.mts'

const latest = notices[0]

function fmt(d) {
  return new Date(d).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <section class="notice-bubble-wrap">
    <a v-if="latest" :href="latest.url" class="notice-bubble">
      <div class="notice-bubble-head">
        <span class="notice-bubble-badge">最新通知</span>
        <time class="notice-bubble-date">{{ fmt(latest.frontmatter.date) }}</time>
      </div>
      <p class="notice-bubble-title">{{ latest.frontmatter.title }}</p>
      <div v-if="latest.excerpt" class="notice-bubble-excerpt" v-html="latest.excerpt" />
      <span class="notice-bubble-tail" aria-hidden="true" />
    </a>
    <div v-else class="notice-bubble notice-bubble--empty">
      <div class="notice-bubble-head">
        <span class="notice-bubble-badge">最新通知</span>
      </div>
      <p class="notice-bubble-title">暂无通知</p>
      <span class="notice-bubble-tail" aria-hidden="true" />
    </div>
    <a class="notice-bubble-more" href="/notices/">查看全部通知 →</a>
  </section>
</template>

<style scoped>
.notice-bubble-wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.notice-bubble {
  position: relative;
  display: block;
  margin: 0 auto 26px;
  padding: 18px 22px;
  text-align: left;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.notice-bubble:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.notice-bubble:hover .notice-bubble-title {
  color: var(--vp-c-brand-1);
}

/* 方形气泡尾巴：一个旋转 45° 的小方块 */
.notice-bubble-tail {
  position: absolute;
  left: 30px;
  bottom: -7px;
  width: 12px;
  height: 12px;
  background: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  transform: rotate(45deg);
  pointer-events: none;
}

.notice-bubble-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.notice-bubble-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.notice-bubble-date {
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.notice-bubble-title {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.notice-bubble-excerpt {
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.notice-bubble-excerpt :deep(p) {
  margin: 0;
}

.notice-bubble-more {
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}

.notice-bubble-more:hover {
  text-decoration: underline;
}
</style>
