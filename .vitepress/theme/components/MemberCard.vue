<script setup lang="ts">
import { withBase } from 'vitepress'
import type { Member } from '../members.data.mts'
import MemberAvatar from './MemberAvatar.vue'

// 成员卡片：有头像时是「头像 + 名字 + 介绍」居中卡片；
// 没有头像时是文字卡片：名字与介绍左对齐，右下角是淡淡的名字首字水印，比空头像占位更紧凑。
defineProps<{ member: Member }>()
</script>

<template>
  <a class="member-card" :class="{ 'is-plain': !member.avatar }" :href="withBase(member.url)">
    <MemberAvatar v-if="member.avatar" :src="member.avatar" :name="member.name" :size="104" />
    <span v-else class="member-mark" aria-hidden="true">{{ member.name.charAt(0) }}</span>
    <span class="member-name">{{ member.name }}</span>
    <span class="member-bio">{{ member.bio }}</span>
  </a>
</template>

<style scoped>
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
  text-decoration: none;
  transition: transform 0.25s, box-shadow 0.25s;
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

/* —— 无头像的文字卡片 —— */
.member-card.is-plain {
  position: relative;
  overflow: hidden;
  align-items: flex-start;
  justify-content: flex-end;
  min-height: 128px;
  padding: 26px 20px 20px;
  text-align: left;
}

/* 顶部一小段品牌色短线 */
.member-card.is-plain::before {
  content: '';
  position: absolute;
  top: 18px;
  left: 20px;
  width: 22px;
  height: 3px;
  border-radius: 2px;
  background: var(--vp-c-brand-1);
  opacity: 0.7;
  transition: width 0.25s;
}

.member-card.is-plain:hover::before {
  width: 36px;
}

/* 右下角的首字水印 */
.member-mark {
  position: absolute;
  right: -6px;
  bottom: -30px;
  font-size: 112px;
  font-weight: 800;
  line-height: 1;
  color: var(--vp-c-brand-1);
  opacity: 0.09;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.25s, transform 0.25s;
}

.member-card.is-plain:hover .member-mark {
  opacity: 0.16;
  transform: translateY(-4px);
}

.member-card.is-plain .member-name,
.member-card.is-plain .member-bio {
  position: relative;
}

.member-card.is-plain .member-name {
  margin-top: 0;
}

.member-card.is-plain .member-bio {
  margin-top: 6px;
}

/* 窄屏收小头像与字号 */
@media (max-width: 560px) {
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

  .member-card.is-plain {
    min-height: 104px;
    padding: 22px 14px 14px;
  }

  .member-card.is-plain::before {
    top: 14px;
    left: 14px;
  }

  .member-mark {
    font-size: 88px;
    bottom: -24px;
  }
}
</style>
