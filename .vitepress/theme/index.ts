import { h } from 'vue'
import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import NoticeBubble from './components/NoticeBubble.vue'
import NoticeMeta from './components/NoticeMeta.vue'
import MemberMeta from './components/MemberMeta.vue'
import MemberComments from './components/MemberComments.vue'
import { setupHomePaging } from './homePaging'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-before': () => h('div', { id: 'members-nav-tabs' }),
      // 全站右下角浮动通知气泡
      'layout-bottom': () => h(NoticeBubble),
      // 通知详情页正文上方的标题与日期；成员详情页正文上方的头像、名字与介绍
      'doc-before': () => [h(NoticeMeta), h(MemberMeta)],
      // 成员详情页正文下方的评论区（未配置 Twikoo 地址时不显示）
      'doc-after': () => h(MemberComments)
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
