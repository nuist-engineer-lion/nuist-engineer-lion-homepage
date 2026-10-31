import { createContentLoader } from 'vitepress'
import { avatarOf, parseIds } from './memberUtils'

// 成员数据加载器：构建时扫描 archive/members/entries/*.md，每份当前或往届介绍独立存放。
// 分组与顺序写在成员列表页 archive/members/index.md 的 frontmatter 里（current 现有成员、alumni 往届成员），
// 现有成员不分年级；未列出的新条目自动追加到现有成员末尾。
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
  tagline: string
  note: string
  noteLayout?: 'poem'
  members: Member[]
}

export interface MembersData {
  current: Member[]
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

    function resolveMember(id: string, context: string): Member {
      const member = byId.get(id)
      if (!member) {
        throw new Error(
          `archive/members/index.md「${context}」里的成员 id「${id}」不存在，应与 entries/ 下的文件名一致`
        )
      }
      listed.add(id)
      return member
    }

    const currentIds = fm.current ?? []
    if (!Array.isArray(currentIds) || currentIds.some((id) => typeof id !== 'string')) {
      throw new Error('archive/members/index.md 的 current 需为成员 id 列表')
    }
    const current = currentIds.map((id: string) => resolveMember(id, '现有成员'))

    function alumniGroups(): MemberGroup[] {
      const raw = fm.alumni ?? []
      if (!Array.isArray(raw)) throw new Error('archive/members/index.md 的 alumni 需为列表')
      return raw.map((g: any) => {
        if (!g?.title) throw new Error('archive/members/index.md 的 alumni 里有分组缺少 title')
        // members 可以写成「a, b, c」字符串，也可以写成 YAML 列表
        const ids = Array.isArray(g.members) ? g.members.map(String) : parseIds(String(g.members ?? ''))
        const list = ids.map((id: string) => resolveMember(id, String(g.title)))
        const year = String(g.title).match(/\d{4}/)?.[0]
        return {
          key: year ? `y${year}` : `g${++seq}`,
          title: String(g.title),
          tagline: g.tagline ? String(g.tagline) : '',
          note: g.note ? String(g.note) : '',
          noteLayout: g.noteLayout === 'poem' ? 'poem' : undefined,
          members: list
        }
      })
    }

    const alumni = alumniGroups()
    const rest = members.filter((m) => !listed.has(m.id))
    current.push(...rest)

    return { current, alumni }
  }
})
