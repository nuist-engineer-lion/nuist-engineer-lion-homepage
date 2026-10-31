<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { data } from '../members.data.mts'
import type { MemberGroup } from '../members.data.mts'
import { savedMembersView, saveMembersView } from '../membersViewState'
import MemberCard from './MemberCard.vue'

// 成员列表独立页面（archive/members/index.md 用 layout: page 挂载本组件）。
//
// 整页翻屏，参考 fullPage.js 的 scrollOverflow 模式与 Swiper 的嵌套滚动：
//   - 页面本身不滚动，导航栏下面是一个固定高度的视窗，里面上下叠着两屏，任何时候都正好显示一整屏；
//     翻屏是整屏平移（transform），不会出现「半屏现有、半屏往届」
//   - 一屏内容比视窗高时在屏内滚动；滚到这一屏的尽头先停住，**下一次**滚动（新的一次手势）才翻屏，
//     同一次手势的惯性不会直接翻过去——即「先保留整一屏再翻页」
//   - 触屏：停在屏的顶 / 底端时再往同方向滑才翻屏；键盘：↑↓ / PageUp / PageDown / 空格同理
//   - 顶部切换条显示当前所在的屏，点了直接翻过去；年份导航只在往届成员屏显示
//   - 地址 #alumni 直接打开往届成员，#y2019 这类直接跳到对应年份
// 分组数据来自 index.md 的 frontmatter，见 members.data.mts。

type ScreenKey = 'current' | 'alumni'

const screens: { key: ScreenKey; label: string; groups: MemberGroup[] }[] = [
  {
    key: 'current',
    label: '现有成员',
    groups: [{ key: 'current', title: '现有成员', tagline: '', note: '', members: data.current }]
  },
  { key: 'alumni', label: '往届成员', groups: data.alumni }
]

const DURATION = 700 // 翻屏动画时长，与 CSS 里的 transition 一致
const GESTURE_GAP = 180 // 滚轮事件间隔超过这么久，就算一次新的手势
const WHEEL_THRESHOLD = 120 // 停在屏尽头后，新手势累计滚动超过这个量才翻屏（一格普通滚轮约 100）
const SWIPE_THRESHOLD = 60 // 触屏在屏尽头再滑动这么多像素才翻屏

const index = ref(0)
const animating = ref(false)
const instant = ref(false) // 打开带锚点的地址时直接定位，不播动画
const pull = ref(0) // 在屏尽头继续滚动的进度（0~1），驱动提示箭头
const activeGroup = ref('')
const chips = ref<HTMLElement | null>(null)
const tabsInNav = ref(false)
// 等主导航完成挂载后再创建 Teleport，避免 SSR 水合时目标尚未就绪。
const tabsReady = ref(false)
let navMedia: MediaQueryList | undefined
function updateTabsLocation() {
  tabsInNav.value = navMedia?.matches ?? false
}
const scrollers: HTMLElement[] = []
let viewHash = ''
let initialPositionTimer: number | undefined

// 分组元素的 id 故意和地址里的锚点（#y2019）不同：否则浏览器原生的锚点跳转和 VitePress 路由
// 会在页面加载时抢先去滚动屏内容器，和这里的定位叠加后跳过头
const groupId = (key: string) => `members-${key}`

const activeScreen = computed(() => screens[index.value])
const countOf = (groups: MemberGroup[]) => groups.reduce((n, g) => n + g.members.length, 0)

function setScroller(el: unknown, i: number) {
  if (el instanceof HTMLElement) scrollers[i] = el
}

const current = () => scrollers[index.value]
const atTop = (el: HTMLElement) => el.scrollTop <= 1
const atBottom = (el: HTMLElement) => el.scrollTop + el.clientHeight >= el.scrollHeight - 1

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function setHash(hash: string) {
  viewHash = hash
  history.replaceState(history.state, '', hash || location.pathname + location.search)
}

/** 翻到第 i 屏。toTop：新屏从顶部开始看（往下翻、点切换条时） */
async function go(i: number, opts: { toTop?: boolean; instant?: boolean } = {}) {
  if (i < 0 || i >= screens.length) return
  const el = scrollers[i]
  if (opts.toTop && el) el.scrollTop = 0
  if (i !== index.value) {
    if (opts.instant || reducedMotion()) {
      instant.value = true
      index.value = i
      await nextTick()
      requestAnimationFrame(() => (instant.value = false))
    } else {
      index.value = i
      animating.value = true
      window.setTimeout(() => (animating.value = false), DURATION)
    }
    setHash(i === 1 ? '#alumni' : '')
  }
  pull.value = 0
  el?.focus({ preventScroll: true })
  updateActiveGroup()
}

function groupTop(el: HTMLElement, scroller: HTMLElement): number {
  return el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
}

async function jumpTo(key: string, opts: { instant?: boolean } = {}) {
  const i = screens.findIndex((s) => s.groups.some((g) => g.key === key))
  if (i < 0) return
  const switching = i !== index.value
  await go(i, { instant: opts.instant })
  const scroller = scrollers[i]
  const el = document.getElementById(groupId(key))
  if (!scroller || !el) return
  scroller.scrollTo({
    top: groupTop(el, scroller) - 16,
    behavior: switching || opts.instant || reducedMotion() ? 'auto' : 'smooth'
  })
  activeGroup.value = key
  setHash('#' + key)
}

/** 高亮当前屏里正在看的那一届：最后一个标题已经越过视窗顶部附近的分组 */
function updateActiveGroup() {
  const scroller = current()
  if (!scroller) return
  const line = scroller.getBoundingClientRect().top + 40
  let key = activeScreen.value.groups[0]?.key ?? ''
  for (const g of activeScreen.value.groups) {
    const el = document.getElementById(groupId(g.key))
    if (el && el.getBoundingClientRect().top <= line) key = g.key
  }
  if (key === activeGroup.value) return
  activeGroup.value = key
  // 窄屏的年份条跟着把当前年份滚进可视范围
  const box = chips.value
  const chip = box?.querySelector<HTMLElement>(`[data-key="${key}"]`)
  if (box && chip) {
    box.scrollTo({ left: chip.offsetLeft - box.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' })
  }
}

function onPaneScroll(i: number) {
  if (i === index.value) updateActiveGroup()
}

// —— 滚轮：一次手势只翻一屏，且手势开始时就得停在屏的尽头 ——
let gesture = { last: 0, acc: 0, edgeDown: false, edgeUp: false, consumed: false }

function onWheel(e: WheelEvent) {
  if (e.ctrlKey || e.metaKey) return // 缩放
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return // 横向手势
  const now = performance.now()
  const el = current()
  if (!el) return

  if (now - gesture.last > GESTURE_GAP) {
    gesture = { last: now, acc: 0, edgeDown: atBottom(el), edgeUp: atTop(el), consumed: false }
  }
  gesture.last = now

  // 动画中、或这次手势已经翻过一屏：吞掉剩余惯性，避免连翻或把新屏滚走
  if (animating.value || gesture.consumed) {
    e.preventDefault()
    return
  }

  const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * el.clientHeight : e.deltaY
  const down = delta > 0
  const canFlip = down ? gesture.edgeDown && index.value < screens.length - 1 : gesture.edgeUp && index.value > 0
  if (!canFlip) {
    pull.value = 0
    return // 交给浏览器在屏内正常滚动
  }

  e.preventDefault()
  gesture.acc += Math.abs(delta)
  pull.value = Math.min(1, gesture.acc / WHEEL_THRESHOLD) * (down ? 1 : -1)
  if (gesture.acc < WHEEL_THRESHOLD) return
  gesture.consumed = true
  go(index.value + (down ? 1 : -1), { toTop: down })
}

// —— 触屏：手指按下时已经停在屏的尽头，继续往同方向滑才翻屏 ——
let touch: { x: number; y: number; edgeDown: boolean; edgeUp: boolean; done: boolean } | null = null

function onTouchStart(e: TouchEvent) {
  const el = current()
  if (!el || e.touches.length !== 1 || (e.target as HTMLElement).closest('.fp-bar')) {
    touch = null
    return
  }
  const t = e.touches[0]
  touch = { x: t.clientX, y: t.clientY, edgeDown: atBottom(el), edgeUp: atTop(el), done: false }
}

function onTouchMove(e: TouchEvent) {
  if (!touch || touch.done || animating.value) return
  const t = e.touches[0]
  const dx = t.clientX - touch.x
  const dy = t.clientY - touch.y
  if (Math.abs(dx) > Math.abs(dy)) return
  if (dy < -SWIPE_THRESHOLD && touch.edgeDown && index.value < screens.length - 1) {
    touch.done = true
    go(index.value + 1, { toTop: true })
  } else if (dy > SWIPE_THRESHOLD && touch.edgeUp && index.value > 0) {
    touch.done = true
    go(index.value - 1)
  }
}

// —— 键盘：屏内照常滚动，到了尽头再按才翻屏 ——
function onKey(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return
  const t = e.target as HTMLElement | null
  if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return
  const el = current()
  if (!el) return

  const page = el.clientHeight * 0.85
  const step: Record<string, number> = {
    ArrowDown: 80,
    ArrowUp: -80,
    PageDown: page,
    PageUp: -page,
    ' ': e.shiftKey ? -page : page
  }
  const amount = step[e.key]
  if (amount === undefined) return
  // 空格落在按钮 / 链接上时是在点击它们
  if (e.key === ' ' && t && t.closest('button, a')) return
  e.preventDefault()
  if (animating.value) return

  if (amount > 0 && atBottom(el)) go(index.value + 1, { toTop: true })
  else if (amount < 0 && atTop(el)) go(index.value - 1)
  else el.scrollBy({ top: amount, behavior: reducedMotion() ? 'auto' : 'smooth' })
}

function applyHash() {
  viewHash = location.hash
  const hash = decodeURIComponent(location.hash.slice(1))
  if (hash === 'alumni') go(1, { instant: true, toTop: true })
  else if (hash) jumpTo(hash, { instant: true })
  else updateActiveGroup()
}

async function restoreView() {
  const saved = savedMembersView
  // 新打开的年份链接仍按锚点定位；返回原地址时才恢复精确的屏内位置。
  if (!saved || saved.hash !== location.hash) {
    applyHash()
    return
  }
  await go(saved.screenIndex, { instant: true })
  setHash(saved.hash)
  scrollers.forEach((el, i) => {
    el.scrollTop = saved.scrollTops[i] ?? 0
  })
  updateActiveGroup()
}

onMounted(() => {
  viewHash = location.hash
  tabsReady.value = true
  navMedia = window.matchMedia('(min-width: 1100px)')
  updateTabsLocation()
  navMedia.addEventListener('change', updateTabsLocation)
  // 页面本身不滚动，所有滚动都发生在屏内
  document.documentElement.classList.add('mp-fullpage')
  // VitePress 路由挂载后还会按自己的偏移滚到地址里的锚点，晚一拍再处理才不会被它盖掉
  initialPositionTimer = window.setTimeout(restoreView, 0)
  window.addEventListener('keydown', onKey)
  window.addEventListener('hashchange', applyHash)
  window.addEventListener('resize', updateActiveGroup)
})

onBeforeUnmount(() => {
  window.clearTimeout(initialPositionTimer)
  saveMembersView({
    hash: viewHash,
    screenIndex: index.value,
    scrollTops: scrollers.map((el) => el.scrollTop)
  })
  navMedia?.removeEventListener('change', updateTabsLocation)
  document.documentElement.classList.remove('mp-fullpage')
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('hashchange', applyHash)
  window.removeEventListener('resize', updateActiveGroup)
})
</script>

<template>
  <div class="fp" @wheel="onWheel" @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove">
    <div class="fp-bar">
      <div class="fp-bar-inner">
        <Teleport v-if="tabsReady" to="#members-nav-tabs" :disabled="!tabsInNav">
          <nav class="fp-tabs" aria-label="成员分类">
            <button
              v-for="(s, i) in screens"
              :key="s.key"
              type="button"
              class="fp-tab"
              :class="{ active: index === i }"
              :aria-current="index === i ? 'true' : undefined"
              @click="go(i, { toTop: true })"
            >
              {{ s.label }}<span class="fp-count">{{ countOf(s.groups) }}</span>
            </button>
          </nav>
        </Teleport>

        <nav v-if="index === 1" ref="chips" class="fp-chips" aria-label="年份">
          <!-- 用按钮而不是 #锚点链接：VitePress 路由会接管锚点点击并按自己的方式滚动 -->
          <button
            v-for="g in activeScreen.groups"
            :key="g.key"
            type="button"
            :data-key="g.key"
            class="fp-chip"
            :class="{ active: activeGroup === g.key }"
            @click="jumpTo(g.key)"
          >{{ g.title }}</button>
        </nav>
      </div>
    </div>

    <div class="fp-viewport">
      <div
        class="fp-track"
        :class="{ 'is-instant': instant }"
        :style="{ transform: `translate3d(0, ${-index * 100}%, 0)` }"
      >
        <section
          v-for="(s, i) in screens"
          :key="s.key"
          class="fp-screen"
          :class="{ 'is-active': index === i }"
          :aria-label="s.label"
          :aria-hidden="index !== i"
        >
          <div
            :ref="(el) => setScroller(el, i)"
            class="fp-scroll"
            tabindex="-1"
            @scroll.passive="onPaneScroll(i)"
          >
            <div class="fp-inner">
              <header v-if="i === 0" class="fp-head">
                <h1 class="fp-title">成员列表</h1>
                <p class="fp-intro">
                  海上修机师的每一位成员都在这里。点开卡片，可以看到他们更详细的自我介绍。
                </p>
              </header>
              <header v-else class="fp-head">
                <button type="button" class="fp-back page-back" @click="go(0)">
                  <span aria-hidden="true">↑</span> 现有成员
                </button>
                <h2 class="fp-title">往届成员</h2>
                <p class="fp-intro">
                  一届届前辈把修机师带到了今天。点开卡片可以看到他们的自我介绍。
                </p>
              </header>

              <div class="fp-body" :class="{ 'has-groups': s.key === 'alumni' }">
                <main class="fp-main">
                  <section v-for="g in s.groups" :id="groupId(g.key)" :key="g.key" class="fp-group">
                    <h3 v-if="s.key === 'alumni'" class="fp-group-title">
                      {{ g.title }}<span class="fp-group-count">{{ g.members.length }} 人</span>
                    </h3>
                    <p v-if="g.tagline" class="fp-group-tagline">{{ g.tagline }}</p>
                    <div v-if="g.note && g.noteLayout === 'poem'" class="fp-group-note fp-poem">
                      <p v-for="(stanza, stanzaIndex) in g.note.trim().split(/\n\s*\n/)" :key="stanzaIndex">{{ stanza }}</p>
                    </div>
                    <p v-else-if="g.note" class="fp-group-note">{{ g.note }}</p>
                    <div class="fp-grid">
                      <MemberCard v-for="m in g.members" :key="m.id" :member="m" />
                    </div>
                  </section>
                </main>

                <aside v-if="s.key === 'alumni'" class="fp-aside" :aria-label="`${s.label}目录`">
                  <p class="fp-aside-title">{{ s.label }}</p>
                  <button
                    v-for="g in s.groups"
                    :key="g.key"
                    type="button"
                    class="fp-aside-link"
                    :class="{ active: index === i && activeGroup === g.key }"
                    @click="jumpTo(g.key)"
                  >{{ g.title }}</button>
                </aside>
              </div>

              <button
                v-if="i === 0"
                type="button"
                class="fp-next"
                :style="{ '--pull': pull > 0 ? pull : 0 }"
                @click="go(1, { toTop: true })"
              >
                <span>继续下滑，看看往届成员</span>
                <span class="fp-next-arrow" aria-hidden="true">↓</span>
              </button>

              <footer v-else class="fp-foot">
                <p>
                  想加入列表或更新自己的介绍？在群里找海上修机师 bot，或者按
                  <a href="/archive/members/README">填写指南</a> 自己提交 PR。
                </p>
                <p class="fp-license">
                  本站代码以
                  <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noreferrer">AGPL-3.0</a>
                  协议开源 ·
                  <a href="https://github.com/nuist-engineer-lion/nuist-engineer-lion-homepage" target="_blank" rel="noreferrer">获取源码</a>
                </p>
              </footer>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧分页圆点（fullPage.js 式），桌面端显示 -->
      <nav class="fp-dots" aria-label="翻屏">
        <button
          v-for="(s, i) in screens"
          :key="s.key"
          type="button"
          class="fp-dot"
          :class="{ active: index === i }"
          :aria-label="s.label"
          :title="s.label"
          @click="go(i, { toTop: true })"
        ></button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
/* —— 整页视窗：导航栏以下正好一屏 —— */
.fp {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--vp-nav-height));
  height: calc(100dvh - var(--vp-nav-height));
  overflow: hidden;
}

.fp a {
  color: var(--vp-c-brand-1);
}

/* —— 顶部切换条 —— */
.fp-bar {
  flex: none;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.fp-bar-inner {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 1152px;
  margin: 0 auto;
  padding: 12px 24px;
}

.fp-tabs {
  display: inline-flex;
  align-self: flex-start;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
}

.fp-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.25s, background-color 0.25s, box-shadow 0.25s;
}

.fp-tab:hover {
  color: var(--vp-c-text-1);
}

.fp-tab.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.fp-count {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

/* 窄屏的年份条：横向滑动 */
.fp-chips {
  display: flex;
  gap: 8px;
  margin: 0 -24px;
  padding: 0 24px 2px;
  overflow-x: auto;
  scrollbar-width: none;
}

.fp-chips::-webkit-scrollbar {
  display: none;
}

.fp-chip {
  flex: none;
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background-color 0.2s;
}

.fp-chip.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

/* —— 两屏叠放，整屏平移 —— */
.fp-viewport {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.fp-track {
  height: 100%;
  /* fullPage.js 默认的 easeInOutCubic */
  transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
  will-change: transform;
}

.fp-track.is-instant,
.fp-track.is-instant .fp-scroll {
  transition: none;
}

.fp-screen {
  height: 100%;
}

/* 离开视窗的那一屏稍微变淡，翻屏时有层次感 */
.fp-screen > .fp-scroll {
  transition: opacity 0.7s ease;
}

.fp-screen:not(.is-active) > .fp-scroll {
  opacity: 0.35;
}

.fp-scroll {
  height: 100%;
  overflow-y: auto;
  /* 屏内滚到头时不把滚动链到页面上，手机上也不会触发下拉刷新 */
  overscroll-behavior: contain;
  outline: none;
  scrollbar-width: thin;
  scrollbar-gutter: stable both-edges;
}

.fp-inner {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  max-width: 1152px;
  margin: 0 auto;
  padding: 32px 24px 40px;
}

/* —— 标题区 —— */
.fp-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--vp-c-text-1);
}

.fp-intro {
  margin: 10px 0 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.fp-back {
  margin-bottom: 14px;
  font-weight: 600;
}

/* —— 分组与卡片 —— */
.fp-body {
  display: block;
}

.fp-group {
  margin-top: 32px;
}

.fp-group-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.fp-group-count {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.fp-group-tagline,
.fp-group-note {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.fp-group-note {
  margin-top: 16px;
  white-space: pre-line;
}

.fp-poem {
  display: grid;
  gap: 16px 24px;
}

.fp-poem p {
  margin: 0;
  min-width: 0;
  font-size: inherit;
  line-height: inherit;
}

@media (min-width: 768px) {
  .fp-poem {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.fp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.fp-aside {
  display: none;
}

/* —— 第一屏底部：往下翻的提示，在屏尽头继续滚动时跟着被「拉」下去 —— */
.fp-next {
  --pull: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: auto auto 0;
  padding: 40px 24px 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transform: translateY(calc(var(--pull) * 10px));
  transition: color 0.2s, transform 0.15s ease-out;
}

.fp-next:hover {
  color: var(--vp-c-brand-1);
}

.fp-next-arrow {
  display: inline-block;
  font-size: 18px;
  color: var(--vp-c-brand-1);
  animation: fp-bounce 1.6s ease-in-out infinite;
}

@keyframes fp-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

.fp-foot {
  margin-top: auto;
  padding-top: 48px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.fp-foot p {
  margin: 0;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.fp-foot .fp-license {
  margin-top: 8px;
  padding-top: 0;
  border-top: none;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

/* —— 右侧分页圆点 —— */
.fp-dots {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .fp-track,
  .fp-screen > .fp-scroll {
    transition: none;
  }

  .fp-next-arrow {
    animation: none;
  }
}

/* 桌面端：年份目录在右侧，切换条里不再放年份 */
@media (min-width: 960px) {
  .fp-bar-inner {
    padding: 12px 32px;
  }

  .fp-chips {
    display: none;
  }

  .fp-inner {
    padding: 32px 32px 40px;
  }

  .fp-body.has-groups {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 160px;
    gap: 48px;
  }

  .fp-aside {
    position: sticky;
    top: 24px;
    align-self: start;
    display: flex;
    flex-direction: column;
    margin-top: 32px;
    padding: 4px 0 4px 16px;
    border-left: 1px solid var(--vp-c-divider);
  }

  .fp-aside-title {
    margin: 0 0 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  .fp-aside-link {
    position: relative;
    padding: 4px 0;
    font-size: 14px;
    text-align: left;
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: color 0.2s;
  }

  .fp-aside-link:hover {
    color: var(--vp-c-text-1);
  }

  .fp-aside-link.active {
    color: var(--vp-c-brand-1);
    font-weight: 600;
  }

  .fp-aside-link.active::before {
    content: '';
    position: absolute;
    top: 7px;
    bottom: 7px;
    left: -17px;
    width: 2px;
    border-radius: 1px;
    background: var(--vp-c-brand-1);
  }

  .fp-dots {
    position: absolute;
    top: 50%;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transform: translateY(-50%);
  }

  .fp-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--vp-c-text-3);
    opacity: 0.5;
    cursor: pointer;
    transition: transform 0.25s, opacity 0.25s, background-color 0.25s;
  }

  .fp-dot:hover {
    opacity: 0.9;
  }

  .fp-dot.active {
    background: var(--vp-c-brand-1);
    opacity: 1;
    transform: scale(1.4);
  }
}

/* 宽屏：分类移入主导航后，省去页面内的切换栏。 */
@media (min-width: 1100px) {
  .fp-bar {
    display: none;
  }
}

/* 手机：两列卡片，收紧间距 */
@media (max-width: 560px) {
  .fp-bar-inner {
    padding: 10px 16px;
  }

  .fp-chips {
    margin: 0 -16px;
    padding: 0 16px 2px;
  }

  .fp-inner {
    padding: 24px 16px 28px;
  }

  .fp-title {
    font-size: 26px;
  }

  .fp-group {
    margin-top: 26px;
  }

  .fp-group-title {
    font-size: 19px;
  }

  .fp-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}
</style>
