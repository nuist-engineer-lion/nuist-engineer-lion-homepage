<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data } from '../members.data.mts'
import type { Member } from '../members.data.mts'

// 成员详情页底部的「上一位 / 下一位」翻页。
// 顺序与成员列表一致：先现有成员，再按年份倒序的往届成员，拼成一条序列；首尾没有就不显示那一侧。
const { page } = useData()

const PREFIX = 'archive/members/entries/'

// 按详情页地址识别成员：现有与往届可以有同名 id（例如往届的介绍另有地址），地址才是唯一的。
// 同一地址若在多个分组里出现，只按第一次出现的位置算
const sequence = computed<Member[]>(() => {
  const seen = new Set<string>()
  const all = [...data.current, ...data.alumni.flatMap((g) => g.members)]
  return all.filter((m) => (seen.has(m.url) ? false : (seen.add(m.url), true)))
})

// 当前页的地址：relativePath 是重写后的 archive/members/entries/<id>.md
const currentUrl = computed(() => {
  const rel = page.value.relativePath || ''
  return rel.startsWith(PREFIX) ? '/' + rel.replace(/\.md$/, '.html') : ''
})

const position = computed(() => sequence.value.findIndex((m) => m.url === currentUrl.value))
const prev = computed(() => (position.value > 0 ? sequence.value[position.value - 1] : null))
const next = computed(() =>
  position.value >= 0 && position.value < sequence.value.length - 1
    ? sequence.value[position.value + 1]
    : null
)
</script>

<template>
  <nav v-if="position >= 0 && (prev || next)" class="member-pager" aria-label="成员翻页">
    <a v-if="prev" class="pager-link prev" :href="withBase(prev.url)">
      <span class="pager-label">
        <span class="page-back-arrow" aria-hidden="true"></span>上一位
      </span>
      <span class="pager-name">{{ prev.name }}</span>
      <span class="pager-bio">{{ prev.bio }}</span>
    </a>
    <span v-else class="pager-placeholder" aria-hidden="true"></span>

    <a v-if="next" class="pager-link next" :href="withBase(next.url)">
      <span class="pager-label">
        下一位<span class="page-back-arrow is-next" aria-hidden="true"></span>
      </span>
      <span class="pager-name">{{ next.name }}</span>
      <span class="pager-bio">{{ next.bio }}</span>
    </a>
  </nav>
</template>

<style scoped>
.member-pager {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.pager-link {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: 14px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  transition: border-color 0.25s, background-color 0.25s;
}

.pager-link:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.pager-link.next {
  grid-column: 2;
  align-items: flex-end;
  text-align: right;
}

.pager-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

/* 复用返回按钮的粗箭头，翻页这里静止不晃 */
.pager-label :deep(.page-back-arrow),
.pager-label .page-back-arrow {
  width: 16px;
  height: 16px;
  animation: none;
}

.pager-label .page-back-arrow.is-next {
  transform: scaleX(-1);
}

.pager-name {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 17px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.pager-bio {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

@media (max-width: 560px) {
  .member-pager {
    gap: 10px;
  }

  .pager-link {
    padding: 12px 14px;
  }

  .pager-name {
    font-size: 15px;
  }
}
</style>
