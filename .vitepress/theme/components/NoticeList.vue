<script setup>
import { data as notices } from '../notices.data.mts'

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
    <a v-for="n in notices" :key="n.url" :href="n.url" class="notice-item">
      <div class="notice-item-head">
        <time class="notice-item-date">{{ fmt(n.frontmatter.date) }}</time>
        <span class="notice-item-arrow" aria-hidden="true">→</span>
      </div>
      <p class="notice-item-title">{{ n.frontmatter.title }}</p>
      <div v-if="n.excerpt" class="notice-item-excerpt" v-html="n.excerpt" />
    </a>
    <p v-if="!notices.length" class="notice-empty">暂无通知</p>
  </div>
</template>
