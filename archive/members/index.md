---
title: 成员列表
description: 海上修机师成员列表
aside: false
pageClass: members-page
---

<script setup>
import MemberList from '../../.vitepress/theme/components/MemberList.vue'
</script>

# 成员列表

海上修机师的每一位成员都在这里。点开卡片，可以看到他们更详细的自我介绍。

<!--
  排序与分组写在这里：标题、文字可以随意插在卡片堆之间，
  ids 里按想要的顺序写成员 id（即 entries/ 下的文件名，不带 .md），用逗号分隔。

  ## 2023级

  <MemberList ids="张三, 李四" />

  ## 2024级

  <MemberList ids="王五, 赵六, 钱七" />

  没写进任何 ids 的成员（例如 bot 刚加的人）会出现在最下面的 rest 里，
  排进分组后自动从那里消失。
-->
<MemberList rest title="成员" />

想加入列表或更新自己的介绍？在群里找海上修机师 bot，或者按 [填写指南](./README.md) 自己提交 PR。
