<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { avatarOf } from '../memberUtils'
import { savedMembersView } from '../membersViewState'
import MemberAvatar from './MemberAvatar.vue'

// 成员详情页（archive/members/entries/*.md）在正文上方补出头像、名字与一句话介绍：
// 这几项只写在 frontmatter 里，正文从详细介绍开始。
const { page } = useData()

const isEntry = computed(() =>
  (page.value.relativePath || '').startsWith('archive/members/entries/')
)
const fm = computed(() => page.value.frontmatter)
const avatar = computed(() => avatarOf(fm.value))
</script>

<template>
  <div v-if="isEntry" class="member-meta">
    <a class="member-back page-back" :href="withBase('/archive/members/') + (savedMembersView?.hash ?? '')">← 返回成员列表</a>
    <div class="member-meta-head">
      <MemberAvatar v-if="avatar" :src="avatar" :name="String(fm.name ?? '')" :size="112" />
      <div>
        <h1 class="member-meta-name">{{ fm.name }}</h1>
        <p v-if="fm.bio" class="member-meta-bio">{{ fm.bio }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.member-meta {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.member-back {
  margin-bottom: 20px;
}

.member-meta-head {
  display: flex;
  gap: 24px;
  align-items: center;
}

.member-meta-name {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.member-meta-bio {
  margin: 8px 0 0;
  font-size: 16px;
  color: var(--vp-c-text-2);
}

@media (max-width: 560px) {
  .member-meta-head {
    gap: 16px;
  }

  .member-meta-head :deep(.member-avatar) {
    --size: 80px !important;
  }

  .member-meta-name {
    font-size: 24px;
  }
}
</style>
