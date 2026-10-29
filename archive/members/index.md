---
title: 成员列表
description: 海上修机师成员列表
layout: page
# 整页翻屏，页面本身不滚动，默认页脚放进第二屏底部
footer: false

# 分组与顺序写在这里（页面本身由 .vitepress/theme/components/MembersPage.vue 渲染）：
#   current 是「现有成员」，alumni 是「往届成员」，各届都按年份倒序，新的一届写在最上面。
#   title   分组标题，带四位年份时会成为页面锚点（例如 #y2025）
#   note    可选，显示在这一届卡片上方的一段文字
#   members 成员 id（entries/ 下的文件名，不带 .md），用逗号分隔，按想要的顺序排列
# 一届成员毕业后，把这一届从 current 整段剪到 alumni 的最上面。
# 没写进任何分组的成员（例如 bot 刚加的人）会自动出现在现有成员最后的「其他成员」里。

current:
  - title: 2025 届
    members: 杨宇鑫, 袁健轩
  - title: 2024 届
    members: 赵梓虬
  - title: 2023 届
    members: 江楠, 黄姜皓, 王昊, 刘志铭, 陆敏思, 沈傲杰

alumni:
  - title: 2022 届
    members: 张旨涵, 吴天一, 韩杰炜, 陈坤, 陈非凡, 刘烨舒, 黄睦童, 石登辉, 冯子如, 刘硕
  - title: 2021 届
    members: 郑振廷, 林琪, 王雨轩, 于航, 邹恒彬, 杨韩森
  - title: 2020 届
    members: 袁榕, 余翰文, 吴恺诚, 李杨, 胡天骏
  - title: 2019 届
    members: 马赫, 田飞, 戴逸飞, 庄家威, 陈固昊, 陆钰, 朱倍江, 付益辉
  - title: 2018 届
    members: 周思蕴, 王彦智, 杨一凡, 周莼璐, 林月菲, 郭庭瑞
  - title: 2017 届
    members: 徐鲁力, 夏晨洋, 杨晓麟, 沈骁睿, 李余婷, 安昕辰, 蔡映呈, 郝忠云, 何子安, 李典, 李暕, 李宗根, 潘锦程, 张鹏
  - title: 2016 届
    members: 李振生, 倪金阳, 姚云龙, 张博凯, 仇翰章, 季广宇, 李睿轩, 顾家华, 汤琳俪, 胡棪, 赵志杰, 陈兴泉, 韩正杰
---

<script setup>
import MembersPage from '../../.vitepress/theme/components/MembersPage.vue'
</script>

<MembersPage />
