import { nextTick } from 'vue'

let activeAnimation: Animation | undefined
let lastPath = ''
let sequence = 0

/** 只为新页面正文播放入场动画，保留顶栏与目录的固定定位。 */
export async function animatePageChange() {
  const path = location.pathname
  if (path === lastPath) return
  const initial = !lastPath
  lastPath = path
  const current = ++sequence
  activeAnimation?.cancel()
  activeAnimation = undefined

  if (initial || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  await nextTick()
  if (current !== sequence) return

  const content = document.querySelector<HTMLElement>(
    '.VPDoc .content-container, .VPPage, .VPHome, .NotFound'
  )
  if (!content?.animate) return
  activeAnimation = content.animate(
    [
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    {
      duration: 280,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
    }
  )
}
