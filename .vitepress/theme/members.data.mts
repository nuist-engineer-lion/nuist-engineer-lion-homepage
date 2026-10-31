import { createContentLoader } from 'vitepress'
import { avatarOf, parseIds } from './memberUtils'
import { memberUrl } from './memberRoutes'

// 成员数据加载器：构建时分别扫描 archive/members/current/ 和 alumni/ 下的介绍。
// 分组与顺序写在成员列表页 archive/members/index.md 的 frontmatter 里（current 现有成员、alumni 往届成员），
// current/ 中未列出的新条目自动追加到现有成员末尾；alumni/ 中的介绍必须加入年份分组。
// 公开地址沿用 entries/，与配置中的 rewrites 一致；文件移入往届目录时不改变链接与评论归档。

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

const LIST_PAGE = '/archive/members/index.md'
type Category = 'current' | 'alumni'

export default createContentLoader([
  '/archive/members/current/*.md',
  '/archive/members/alumni/*.md',
  LIST_PAGE
], {
  transform(rawData): MembersData {
    function loadMembers(category: Category): Member[] {
      const prefix = `/archive/members/${category}/`
      return rawData
        .filter(({ url }) => url.startsWith(prefix))
        .map(({ url, frontmatter: fm }): Member => {
          if (!fm.name || !fm.bio) {
            throw new Error(`成员文件 ${url} 缺少必填的 name 或 bio`)
          }
          const id = url.slice(prefix.length).replace(/\.html$/, '')
          return {
            id,
            url: memberUrl(category, id),
            name: String(fm.name),
            bio: String(fm.bio),
            avatar: avatarOf(fm)
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    }

    const currentMembers = loadMembers('current')
    const alumniMembers = loadMembers('alumni')
    const byId = {
      current: new Map(currentMembers.map((m) => [m.id, m])),
      alumni: new Map(alumniMembers.map((m) => [m.id, m]))
    }
    const urls = new Set<string>()
    for (const member of [...currentMembers, ...alumniMembers]) {
      if (urls.has(member.url)) {
        throw new Error(`成员详情地址「${member.url}」重复，请在 memberRoutes.ts 中为同名介绍配置独立地址`)
      }
      urls.add(member.url)
    }
    const listed = { current: new Set<string>(), alumni: new Set<string>() }
    const fm = rawData.find(({ url }) => url === '/archive/members/')?.frontmatter ?? {}
    let seq = 0

    function resolveMember(id: string, category: Category, context: string): Member {
      const member = byId[category].get(id)
      if (!member) {
        throw new Error(
          `archive/members/index.md「${context}」里的成员 id「${id}」不存在，应与 ${category}/ 下的文件名一致`
        )
      }
      listed[category].add(id)
      return member
    }

    const currentIds = fm.current ?? []
    if (!Array.isArray(currentIds) || currentIds.some((id) => typeof id !== 'string')) {
      throw new Error('archive/members/index.md 的 current 需为成员 id 列表')
    }
    const current = currentIds.map((id: string) => resolveMember(id, 'current', '现有成员'))

    function alumniGroups(): MemberGroup[] {
      const raw = fm.alumni ?? []
      if (!Array.isArray(raw)) throw new Error('archive/members/index.md 的 alumni 需为列表')
      return raw.map((g: any) => {
        if (!g?.title) throw new Error('archive/members/index.md 的 alumni 里有分组缺少 title')
        // members 可以写成「a, b, c」字符串，也可以写成 YAML 列表
        const ids = Array.isArray(g.members) ? g.members.map(String) : parseIds(String(g.members ?? ''))
        const list = ids.map((id: string) => resolveMember(id, 'alumni', String(g.title)))
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
    const unlistedAlumni = alumniMembers.filter((m) => !listed.alumni.has(m.id))
    if (unlistedAlumni.length) {
      throw new Error(
        `alumni/ 中的成员 ${unlistedAlumni.map((m) => `「${m.id}」`).join('、')} 未加入 archive/members/index.md 的 alumni 年份分组`
      )
    }
    const rest = currentMembers.filter((m) => !listed.current.has(m.id))
    current.push(...rest)

    return { current, alumni }
  }
})
