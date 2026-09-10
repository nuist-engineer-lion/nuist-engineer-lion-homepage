---
layout: home

hero:
  name: "NUIST"
  text: "海上修机师"
  tagline: 电脑义修 · 技术服务 · 经验传承——服务全校师生的修机组织
  image:
    src: /assets/logo.svg
    alt: 海上修机师
  actions:
    - theme: brand
      text: 最新通知
      link: /notices/
    - theme: alt
      text: 修机文档
      link: /docs/
    - theme: alt
      text: 档案馆
      link: /archive/
---

<script setup>
import NoticeList from './.vitepress/theme/components/NoticeList.vue'
</script>

<!-- 首屏（第一页）由主题 hero 渲染，见上方 frontmatter；以下为其余分屏。服务内容已并入「我们是谁」 -->

<div class="fp-root">

<section class="fp-slide fp-about">
  <div class="fp-inner">
    <h2>我们是谁</h2>
    <p>
      海上修机师是一支面向全校师生的电脑义修队伍，所有服务均免费。
    </p>
    <p>
      我们与学生工作处（学工处）保持合作，依托宿舍园区与校园活动开展常态化义修服务：
      电脑坏了找修机师，修不好的也帮你把问题讲明白。
    </p>
    <p class="fp-quote">
      历史活动是群众的事业，随着历史活动的深入，必将是群众队伍的扩大。——《神圣家族》
    </p>

<h3>服务内容</h3>

面向全校师生提供以下四类服务，复杂的维修需求我们会给出诊断结论和后续建议。

<div class="svc-grid">

<div class="svc-card">

<span class="svc-icon">🔧</span>

### 电脑故障维修

软硬件故障诊断与修复，现场排查处理。

- 无法开机、蓝屏、白屏、频繁死机
- 系统卡顿、异常弹窗、病毒查杀
- 外设失灵：键盘、鼠标、耳机、手柄等
- 硬件故障初判与更换建议

</div>

<div class="svc-card">

<span class="svc-icon">💻</span>

### 系统与软件服务

一条龙搞定系统与常用软件环境。

- Windows 安装 / 重装 / 双系统（UEFI、legacy）
- Office 及常用软件部署与激活咨询
- 开发环境配置：Python、Conda、VSCode、WSL 等
- 数据备份与迁移指导

</div>

<div class="svc-card">

<span class="svc-icon">🧹</span>

### 清灰保养升级

让老机器焕发新生。

- 笔记本 / 台式机深度清灰
- 更换硅脂，散热优化、降低噪音
- 加装内存、固态硬盘（SSD）与系统迁移
- 选购建议：按需求与预算给方案

</div>

<div class="svc-card">

<span class="svc-icon">📚</span>

### 技术文档沉淀

把经验留给每一届后来者。

- 修机日志与技术教程持续归档
- 从装系统到修手柄的实战记录
- 面向新成员的入门培训资料
- [修机文档一览](/docs/)

</div>

</div>

  </div>
</section>

<section class="fp-slide fp-notices">
  <div class="fp-inner">
    <h2>最新动态</h2>
    <p class="fp-desc">活动预告、服务安排与组织动态。</p>
    <NoticeList :limit="3" />
    <a class="fp-more" href="/notices/">查看全部通知 →</a>
  </div>
</section>

<!-- 联系方式：二维码为占位图，替换 public/assets/qr/ 下同名文件即可 -->

<section class="fp-slide fp-contact" id="contact">
  <div class="fp-inner">
    <h2>联系我们</h2>
    <p class="fp-desc">义修预约、活动报名、日常技术求助，均可扫码或加群咨询。</p>
    <div class="contact-grid">

<figure class="contact-card">
  <img src="/assets/qr/official.svg" width="160" height="160" alt="微信公众号二维码" loading="lazy" />
  <figcaption>
    <strong>微信公众号</strong>
    <span>关注获取最新动态</span>
  </figcaption>
</figure>

<figure class="contact-card">
  <img src="/assets/qr/recruit.svg" width="160" height="160" alt="招新群二维码" loading="lazy" />
  <figcaption>
    <strong>招新群</strong>
    <span>群号：待补充</span>
  </figcaption>
</figure>

<figure class="contact-card">
  <img src="/assets/qr/notice.svg" width="160" height="160" alt="通知群二维码" loading="lazy" />
  <figcaption>
    <strong>通知群</strong>
    <span>群号：待补充</span>
  </figcaption>
</figure>

</div>
  </div>
</section>

</div>
