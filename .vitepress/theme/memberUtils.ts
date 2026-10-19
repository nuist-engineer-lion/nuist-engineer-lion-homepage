// 成员相关的小工具，供数据加载器与组件共用。
// 单独成文件是因为 .data 文件在客户端只保留 data，其他导出拿不到。

// 头像地址：优先用 frontmatter 里的 avatar；否则按 QQ 号取 QQ 头像；
// 都没有时返回空串，由页面显示名字首字母。
export function avatarOf(fm: Record<string, any>): string {
  if (fm.avatar) return String(fm.avatar)
  if (fm.qq) return `https://q1.qlogo.cn/g?b=qq&nk=${fm.qq}&s=640`
  return ''
}

// 解析 <MemberList ids="a, b c" /> 里的 id 列表，中英文逗号与空白都可作分隔
export function parseIds(value: string): string[] {
  return value.split(/[\s,，]+/).filter(Boolean)
}
