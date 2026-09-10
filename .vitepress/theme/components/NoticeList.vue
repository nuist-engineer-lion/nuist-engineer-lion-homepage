<script setup>
import { computed } from 'vue'
import { data as notices } from '../notices.data.mts'

// limit: 最多显示条数，0 表示全部
const props = defineProps({ limit: { type: Number, default: 0 } })

const list = computed(() =>
  props.limit > 0 ? notices.slice(0, props.limit) : notices
)

function fmt(d) {
  return new Date(d).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="notice-list">
    <a v-for="n in list" :key="n.url" :href="n.url" class="notice-item">
      <div class="notice-item-head">
        <time class="notice-item-date">{{ fmt(n.frontmatter.date) }}</time>
        <span class="notice-item-arrow" aria-hidden="true">→</span>
      </div>
      <p class="notice-item-title">{{ n.frontmatter.title }}</p>
      <div v-if="n.excerpt" class="notice-item-excerpt" v-html="n.excerpt" />
    </a>
    <p v-if="!list.length" class="notice-empty">暂无通知</p>
  </div>
</template>
