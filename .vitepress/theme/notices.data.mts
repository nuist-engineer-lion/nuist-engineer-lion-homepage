import { createContentLoader } from 'vitepress'

// 通知数据加载器：构建时扫描 notices/entries/*.md，按日期倒序。
// 机器人提交 PR 时只需向该目录新增一个 .md 文件，首页气泡与通知栏目自动更新。
export default createContentLoader('/notices/entries/*.md', {
  // 必须用字符串分隔符：布尔值会走 gray-matter 默认的 `---`，导致摘要为空
  excerpt: '<!-- more -->',
  transform(rawData) {
    return rawData.sort(
      (a, b) =>
        Date.parse(b.frontmatter.date) - Date.parse(a.frontmatter.date)
    )
  }
})
