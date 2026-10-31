// 保留已发布的详情页地址；同名介绍可以在不同源目录中独立存放。
export const memberRewrites: Record<string, string> = {
  'archive/members/alumni/江楠.md': 'archive/members/entries/江楠-2023.md',
  'archive/members/current/:id.md': 'archive/members/entries/:id.md',
  'archive/members/alumni/:id.md': 'archive/members/entries/:id.md'
}

export function memberUrl(category: 'current' | 'alumni', id: string): string {
  const source = `archive/members/${category}/${id}.md`
  const target = memberRewrites[source] ?? `archive/members/entries/${id}.md`
  return '/' + target.replace(/\.md$/, '.html')
}
