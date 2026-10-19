<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../members.data.mts'
import { parseIds } from '../memberUtils'
import MemberAvatar from './MemberAvatar.vue'

// 成员卡片堆（头像 + 名字 + 一句话介绍），点进去是成员详情页。
//   <MemberList ids="a350_ti, hereiszd" />  按给定顺序列出这些成员
//   <MemberList rest title="其他成员" />      列出页面里没点名的成员；一个都没有时整块不显示
//   <MemberList />                           列出全部成员
const props = defineProps<{ ids?: string; rest?: boolean; title?: string }>()

const members = computed(() => {
  if (props.ids) {
    const byId = new Map(data.members.map((m) => [m.id, m]))
    return parseIds(props.ids)
      .map((id) => byId.get(id))
      .filter((m) => m !== undefined)
  }
  if (props.rest) {
    const listed = new Set(data.listed)
    return data.members.filter((m) => !listed.has(m.id))
  }
  return data.members
})
</script>

<template>
  <template v-if="members.length">
    <h2 v-if="title" class="member-group-title">{{ title }}</h2>
    <div class="member-grid">
      <a
        v-for="m in members"
        :key="m.id"
        class="member-card"
        :href="withBase(m.url)"
      >
        <MemberAvatar :src="m.avatar" :name="m.name" :size="104" />
        <span class="member-name">{{ m.name }}</span>
        <span class="member-bio">{{ m.bio }}</span>
      </a>
    </div>
  </template>
</template>

<style scoped>
.member-grid {
  display: grid;
  /* 按卡片宽度自动排列：成员列表页放宽后一行四个，较窄时自动减少 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0 28px;
}

.member-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  padding: 20px 14px 22px;
  border-radius: 22px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  text-align: center;
  transition: transform 0.25s, box-shadow 0.25s;
}

.member-card,
.member-card:hover {
  text-decoration: none;
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.16);
}

.dark .member-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}

.member-name {
  max-width: 100%;
  margin-top: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.member-bio {
  margin-top: 8px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* 窄屏改两列，再收小头像与字号 */
@media (max-width: 560px) {
  .member-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .member-card {
    padding: 16px 10px 18px;
    border-radius: 18px;
  }

  .member-card :deep(.member-avatar) {
    --size: 80px !important;
  }

  .member-name {
    margin-top: 12px;
    font-size: 16px;
  }

  .member-bio {
    margin-top: 4px;
    font-size: 12.5px;
  }
}
</style>
