import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import NoticeBubble from './components/NoticeBubble.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 全站右下角浮动通知气泡
      'layout-bottom': () => h(NoticeBubble)
    })
  },
  enhanceApp({ app }) {
    app.component('NoticeBubble', NoticeBubble)
  }
}
