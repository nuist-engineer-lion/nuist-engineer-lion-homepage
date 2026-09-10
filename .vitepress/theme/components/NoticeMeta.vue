<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

// 通知详情页（notices/entries/*.md）在正文上方补出标题与日期：
// 这两项只写在 frontmatter 里，正文没有标题行，不补的话内页看不到标题和日期。
const { page } = useData()

const isEntry = computed(() =>
  (page.value.relativePath || '').startsWith('notices/entries/')
)

// frontmatter 的 date 会被 YAML 解析成 UTC 零点的 Date，这里只取日期部分：
// 既避免非 UTC+8 访客看到前一天，也避免 SSR 与客户端渲染结果不一致
const isoDate = computed(() => {
  const d = page.value.frontmatter.date
  if (!d) return ''
  return (d instanceof Date ? d.toISOString() : String(d)).slice(0, 10)
})

const displayDate = computed(() => {
  const [y, m, d] = isoDate.value.split('-').map(Number)
  return y && m && d ? `${y}年${m}月${d}日` : ''
})
</script>

<template>
  <div v-if="isEntry" class="notice-meta">
    <a class="notice-back" href="/notices/">← 返回通知中心</a>
    <h1 v-if="page.frontmatter.title" class="notice-meta-title">{{ page.frontmatter.title }}</h1>
    <time v-if="isoDate" class="notice-meta-date" :datetime="isoDate">{{ displayDate }}</time>
  </div>
</template>
