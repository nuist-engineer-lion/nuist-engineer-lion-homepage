import { createContentLoader } from 'vitepress'
import { avatarOf, parseIds } from './memberUtils'

// 成员数据加载器：构建时扫描 archive/members/entries/*.md，一人一个文件。
// 显示顺序与分组写在 archive/members/index.md 里：<MemberList ids="a, b" /> 按给定顺序列出，
// <MemberList rest /> 列出 index.md 里没有点名的成员（例如 bot 新加、还没排进分组的人）。
// index.md 也在扫描范围内，改动分组后数据会跟着刷新。

export interface Member {
  id: string
  url: string
  name: string
  bio: string
  avatar: string
}

export interface MembersData {
  members: Member[]
  // index.md 里已点名的成员 id
  listed: string[]
}

declare const data: MembersData
export { data }

const ENTRY_PREFIX = '/archive/members/entries/'
const IDS_RE = /<MemberList\b[^>]*\bids="([^"]*)"/g

export default createContentLoader(
  ['/archive/members/entries/*.md', '/archive/members/index.md'],
  {
    includeSrc: true,
    transform(rawData): MembersData {
      const members = rawData
        .filter(({ url }) => url.startsWith(ENTRY_PREFIX))
        .map(({ url, frontmatter: fm }): Member => {
          if (!fm.name || !fm.bio) {
            throw new Error(`成员文件 ${url} 缺少必填的 name 或 bio`)
          }
          return {
            id: url.slice(ENTRY_PREFIX.length).replace(/\.html$/, ''),
            url,
            name: String(fm.name),
            bio: String(fm.bio),
            avatar: avatarOf(fm)
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))

      // 校验 index.md 点名的 id 都存在，写错时直接让构建失败
      const index = rawData.find(({ url }) => !url.startsWith(ENTRY_PREFIX))
      const known = new Set(members.map((m) => m.id))
      const listed: string[] = []
      // 去掉 HTML 注释，注释里的示例写法不算点名
      const src = (index?.src ?? '').replace(/<!--[\s\S]*?-->/g, '')
      for (const match of src.matchAll(IDS_RE)) {
        for (const id of parseIds(match[1])) {
          if (!known.has(id)) {
            throw new Error(
              `archive/members/index.md 里的成员 id「${id}」不存在，应与 entries/ 下的文件名一致`
            )
          }
          listed.push(id)
        }
      }

      return { members, listed }
    }
  }
)
