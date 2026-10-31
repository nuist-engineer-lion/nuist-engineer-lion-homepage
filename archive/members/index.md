---
title: 成员列表
description: 海上修机师成员列表
layout: page
# 整页翻屏，页面本身不滚动，默认页脚放进第二屏底部
footer: false

# 分组与顺序写在这里（页面本身由 .vitepress/theme/components/MembersPage.vue 渲染）：
#   current 是不分年级的「现有成员」id 列表，alumni 是按年份倒序的「往届成员」分组。
#   title   往届分组标题，带四位年份时会成为页面锚点（例如 #y2023）
#   tagline 可选，显示在年份标题下方的小字
#   note    可选，显示在这一届卡片上方的组织介绍，支持用 YAML | 保留换行
#   noteLayout 可选，poem 将介绍按空行分为诗节，宽屏三栏显示
#   members 成员 id（entries/ 下的文件名，不带 .md），用逗号分隔，按想要的顺序排列
# 往届介绍需要保留时，用独立的「姓名-年份」条目归档。
# 没写进任何列表的成员（例如 bot 刚加的人）会自动追加到现有成员末尾。

current:
  - 杨宇鑫
  - 袁健轩
  - 赵梓虬
  - 江楠

alumni:
  - title: 2023 届
    tagline: 山不是山，我还是我
    members: 江楠-2023, 黄姜皓, 王昊, 刘志铭, 陆敏思, 沈傲杰
  - title: 2022 届
    tagline: 山不容我，转身向海
    note: 由于种种原因，科协改组，带着修机这一核心服务，我们离开了科协，成立了海上修机师，直到目前，我们依然是一个没有注册的组织
    members: 张旨涵, 吴天一, 韩杰炜, 陈坤, 陈非凡, 刘烨舒, 黄睦童, 石登辉, 冯子如, 刘硕
  - title: 2021 届
    tagline: 有信相遇 技往开来
    members: 郑振廷, 林琪, 王雨轩, 于航, 邹恒彬, 杨韩森
  - title: 2020 届
    tagline: 信技的传说——信息技术部
    members: 袁榕, 余翰文, 吴恺诚, 李杨, 胡天骏
  - title: 2019 届
    tagline: 信好有你，技续前行
    noteLayout: poem
    note: |
      十字劈头伸出纤长的手，
      牵着螺丝舞了一周又一周。
      洒上世上最纯的酒，
      洗净主板上一处处的忧愁。

      纸质的海报也许终将陈旧，
      屏幕上的原稿却会永远停留。
      回忆中的故事也许会丢，
      播放器中的剪辑却静静循环到天长地久。

      我们总是在疾行奔走，
      但只要这里有求救，
      信息技术中心，
      总是会在此停留。
    members: 马赫, 田飞, 戴逸飞, 庄家威, 陈固昊, 陆钰, 朱倍江, 付益辉
  - title: 2018 届
    tagline: 信好有你，技续前行
    members: 周思蕴, 王彦智, 杨一凡, 周莼璐, 林月菲, 郭庭瑞
  - title: 2017 届
    tagline: 信好有你 技往开来
    members: 徐鲁力, 夏晨洋, 杨晓麟, 沈骁睿, 李余婷, 安昕辰, 蔡映呈, 郝忠云, 何子安, 李典, 李暕, 李宗根, 潘锦程, 张鹏
  - title: 2016 届
    tagline: 信息时代，技术并存
    members: 李振生, 倪金阳, 姚云龙, 张博凯, 仇翰章, 季广宇, 李睿轩, 顾家华, 汤琳俪, 胡棪, 赵志杰, 陈兴泉, 韩正杰
---

<script setup>
import MembersPage from '../../.vitepress/theme/components/MembersPage.vue'
</script>

<MembersPage />
