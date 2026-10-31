export interface MembersViewState {
  hash: string
  screenIndex: number
  scrollTops: number[]
}

// 列表卸载后仍保留屏内位置，供浏览器后退和详情页的返回链接恢复。
export let savedMembersView: MembersViewState | undefined

export function saveMembersView(state: MembersViewState) {
  savedMembersView = state
}
