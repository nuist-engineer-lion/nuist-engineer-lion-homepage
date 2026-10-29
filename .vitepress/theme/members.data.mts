import { createContentLoader } from 'vitepress'
import { avatarOf, parseIds } from './memberUtils'

// 成员数据加载器：构建时扫描 archive/members/entries/*.md，一人一个文件。
// 分组与顺序写在成员列表页 archive/members/index.md 的 frontmatter 里（current 现有成员、alumni 往届成员），
// 没被任何分组点名的成员（例如 bot 新加、还没排进分组的人）自动归到现有成员最后的「其他成员」。
// index.md 也在扫描范围内，改动分组后数据会跟着刷新；分组里写了不存在的 id 时直接让构建失败。

export interface Member {
  id: string
  url: string
  name: string
  bio: string
  avatar: string
}

export interface MemberGroup {
  // 页面内锚点，例如 y2025；没有年份的分组用 g + 序号
  key: string
  title: string
  note: string
  members: Member[]
}

export interface MembersData {
  current: MemberGroup[]
  alumni: MemberGroup[]
}

declare const data: MembersData
export { data }

const ENTRY_PREFIX = '/archive/members/entries/'
const LIST_PAGE = '/archive/members/index.md'

export default createContentLoader(['/archive/members/entries/*.md', LIST_PAGE], {
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

    const byId = new Map(members.map((m) => [m.id, m]))
    const listed = new Set<string>()
    const fm = rawData.find(({ url }) => !url.startsWith(ENTRY_PREFIX))?.frontmatter ?? {}
    let seq = 0

    function groups(field: 'current' | 'alumni'): MemberGroup[] {
      const raw = fm[field] ?? []
      if (!Array.isArray(raw)) throw new Error(`archive/members/index.md 的 ${field} 需为列表`)
      return raw.map((g: any) => {
        if (!g?.title) throw new Error(`archive/members/index.md 的 ${field} 里有分组缺少 title`)
        // members 可以写成「a, b, c」字符串，也可以写成 YAML 列表
        const ids = Array.isArray(g.members) ? g.members.map(String) : parseIds(String(g.members ?? ''))
        const list = ids.map((id: string) => {
          const m = byId.get(id)
          if (!m) {
            throw new Error(
              `archive/members/index.md「${g.title}」里的成员 id「${id}」不存在，应与 entries/ 下的文件名一致`
            )
          }
          listed.add(id)
          return m
        })
        const year = String(g.title).match(/\d{4}/)?.[0]
        return {
          key: year ? `y${year}` : `g${++seq}`,
          title: String(g.title),
          note: g.note ? String(g.note) : '',
          members: list
        }
      })
    }

    const current = groups('current')
    const alumni = groups('alumni')
    const rest = members.filter((m) => !listed.has(m.id))
    if (rest.length) current.push({ key: 'rest', title: '其他成员', note: '', members: rest })

    return { current, alumni }
  }
})
