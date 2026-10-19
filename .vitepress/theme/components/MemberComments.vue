<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { TWIKOO_ENV_ID } from '../comments'

// 成员详情页（archive/members/entries/*.md）正文下方的评论区。
// twikoo 依赖浏览器环境，只在挂载后动态加载；VitePress 切换页面时组件不会重建，
// 所以监听页面变化重新初始化。
const { page } = useData()

const PREFIX = 'archive/members/entries/'
const memberId = computed(() => {
  const rel = page.value.relativePath || ''
  return rel.startsWith(PREFIX) ? rel.slice(PREFIX.length).replace(/\.md$/, '') : ''
})
const enabled = computed(() => Boolean(TWIKOO_ENV_ID && memberId.value))

const failed = ref(false)

async function mount() {
  if (!enabled.value) return
  failed.value = false
  await nextTick()
  const el = document.getElementById('member-comments')
  if (!el) return
  el.innerHTML = ''
  try {
    // twikoo 是 UMD 包，经打包器转换后 init 可能在模块上，也可能 default 本身就是 init
    const mod: any = await import('twikoo')
    const init = mod.init ?? mod.default?.init ?? mod.default
    await init({
      envId: TWIKOO_ENV_ID,
      el: '#member-comments',
      // 评论按成员 id 归档，不受 .html 后缀或链接写法影响；改 id 会对不上原来的评论
      path: `/archive/members/${memberId.value}`,
      lang: 'zh-CN'
    })
  } catch (e) {
    console.error('[member-comments] 评论加载失败', e)
    failed.value = true
  }
}

onMounted(mount)
watch(memberId, mount)
</script>

<template>
  <section v-if="enabled" class="member-comments">
    <h2 class="member-comments-title">留言</h2>
    <p v-if="failed" class="member-comments-failed">评论区加载失败，请稍后刷新重试。</p>
    <div id="member-comments" :key="memberId"></div>
  </section>
</template>

<style scoped>
.member-comments {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.member-comments-title {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.member-comments-failed {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
