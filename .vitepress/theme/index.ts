import DefaultTheme from 'vitepress/theme'
import NoticeBubble from './components/NoticeBubble.vue'
import NoticeList from './components/NoticeList.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('NoticeBubble', NoticeBubble)
    app.component('NoticeList', NoticeList)
  }
}
