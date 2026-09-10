import { h } from 'vue'
import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import NoticeBubble from './components/NoticeBubble.vue'
import NoticeMeta from './components/NoticeMeta.vue'
import { setupHomePaging } from './homePaging'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 全站右下角浮动通知气泡
      'layout-bottom': () => h(NoticeBubble),
      // 通知详情页正文上方的标题与日期
      'doc-before': () => h(NoticeMeta)
    })
  },
  enhanceApp({ app, router }) {
    app.component('NoticeBubble', NoticeBubble)
    if (inBrowser) {
      // 首次进入 + 每次路由切换后重新判定分屏吸附（含窄屏装不下时退出吸附）
      setupHomePaging()
      router.onAfterRouteChanged = () => setupHomePaging()
    }
  }
}
