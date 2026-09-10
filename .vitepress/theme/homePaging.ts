// 首页分屏吸附的运行时增强（仅在首页生效）
//
// 1) 只有「每一屏都装得下」时才启用吸附。
//    吸附区一旦高过吸附口，浏览器会额外生成「底边对齐」的吸附点，滚轮/手指的小幅滚动还会被
//    反复拽回，翻页体感很差。手机上的 我们是谁(1456px) / 联系我们(1085px) 就是这种情况 ——
//    一屏根本放不下一页，于是整页直接退回普通滚动（html 上加 .fp-snap-off，见 custom.css），
//    不再做任何接管。桌面 (1440×900)、平板竖屏 (768×1024) 这些装得下的尺寸仍然正常分页。
//
// 2) 滚轮 / 方向键翻页（仅吸附启用时）。
//    CSS scroll-snap 对「无级滚轮」不友好：实测连续 10 次 120px 增量后位移仍是 0，
//    因为每次增量都离当前吸附点更近、被吸附回去了。这里自行累计增量，够了就翻一页。

const SECTION_SELECTOR = '.VPHero, .fp-slide'
const SNAP_OFF_CLASS = 'fp-snap-off'

// 滚轮/方向键翻页开关：设为 false 就退回「纯 CSS 吸附」
const WHEEL_PAGING = true

const WHEEL_THRESHOLD = 40 // 累计增量超过这个值就翻页（一格普通滚轮约 100~120px）
const PAGE_COOLDOWN = 620 // 翻页动画期间的锁定时间，吞掉剩余惯性，避免连翻
const ACC_RESET = 220 // 静默这么久就清空累计量，避免零碎微滚攒成一页
const EDGE_TOLERANCE = 8 // 判定「停在分页停靠位置」的容差

let snapEnabled = false
let installed = false

function navHeight(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : 64
}

function isHome(): boolean {
  return !!document.querySelector('.fp-root')
}

function sections(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(SECTION_SELECTOR))
}

function documentTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY
}

/**
 * 每一页吸附后的实际停靠位置。
 * 注意最后一页：它的对齐位置可能落在文档末尾之外，会被截断成最大滚动量，
 * 所以底部那一屏同样算「停在最后一页」，否则从底部上滚的第一下会被判成不在页起点。
 */
function alignedTops(list: HTMLElement[]): number[] {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const nav = navHeight()
  return list.map((el) => Math.min(maxScroll, Math.max(0, documentTop(el) - nav)))
}

/** 每一屏都装得下才启用吸附，否则整页退回普通滚动 */
function refreshSnapMode(): void {
  if (!isHome()) return
  const snapport = window.innerHeight - navHeight()
  snapEnabled = sections().every((el) => el.getBoundingClientRect().height <= snapport)
  document.documentElement.classList.toggle(SNAP_OFF_CLASS, !snapEnabled)
}

/**
 * 翻一页。只有吸附启用、当前页装得下、且正停在它的停靠位置时才接管，
 * 否则交回浏览器自由滚动 —— 避免读长页面时被整屏跳过。
 */
function pageBy(step: number): boolean {
  if (!snapEnabled) return false

  const list = sections()
  if (list.length === 0) return false

  const tops = alignedTops(list)
  let idx = 0
  let distance = Number.POSITIVE_INFINITY
  tops.forEach((top, i) => {
    const d = Math.abs(window.scrollY - top)
    if (d < distance) {
      distance = d
      idx = i
    }
  })

  const next = idx + step
  if (next < 0 || next >= list.length) return false // 到头了，交回浏览器（还能滚到页脚）
  if (distance > EDGE_TOLERANCE) return false // 停在两页之间：让浏览器继续自由滚动

  const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'
  list[next].scrollIntoView({ behavior, block: 'start' })
  return true
}

export function setupHomePaging(): void {
  if (typeof window === 'undefined') return

  refreshSnapMode()

  if (installed) return
  installed = true

  // 布局稳定后再量一次（字体/图片可能改变高度）
  window.requestAnimationFrame(refreshSnapMode)
  window.addEventListener('load', refreshSnapMode)

  let resizeTimer = 0
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(refreshSnapMode, 150)
  })

  if (!WHEEL_PAGING) return

  let acc = 0
  let accTimer = 0
  let lockUntil = 0

  window.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      if (!snapEnabled || !isHome()) return
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return // 缩放/横向滚动不接管
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return // 横向手势不接管

      // deltaMode: 0=像素 1=行 2=页
      const delta =
        e.deltaMode === 1
          ? e.deltaY * 16
          : e.deltaMode === 2
            ? e.deltaY * window.innerHeight
            : e.deltaY

      const now = Date.now()
      if (now < lockUntil) {
        e.preventDefault() // 动画中吞掉剩余惯性
        return
      }

      acc += delta
      window.clearTimeout(accTimer)
      accTimer = window.setTimeout(() => {
        acc = 0
      }, ACC_RESET)

      if (Math.abs(acc) < WHEEL_THRESHOLD) return

      const step = acc > 0 ? 1 : -1
      if (!pageBy(step)) return

      acc = 0
      lockUntil = now + PAGE_COOLDOWN
      e.preventDefault()
    },
    { passive: false }
  )

  // 方向键同样会被吸附拽回，这里也按页翻；其余按键（空格/PageUp/PageDown 等）交给浏览器
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!snapEnabled || !isHome()) return
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

    const target = e.target as HTMLElement | null
    if (target && (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable)) return

    const now = Date.now()
    if (now < lockUntil) return
    if (!pageBy(e.key === 'ArrowDown' ? 1 : -1)) return

    lockUntil = now + PAGE_COOLDOWN
    e.preventDefault()
  })
}
