---
title: 成员站点
description: 海上修机师成员站点与线上资源集合：收录成员自建的个人站点、文件站与工具站，并标注各站点可用状态。
---

<div class="store-page">

<div class="store-hero">

# 成员站点

成员个人站点与线上资源的收藏处：这里收录大家自建的文件站、工具站与个人主页，并标注各站点的可用状态，方便按需访问。

<span class="store-chip">共收录 6 个站点</span><span class="store-chip chip-online">1 个在线</span><span class="store-chip chip-error">5 个无法访问</span><span class="store-chip">检测于 2026-09-13</span>

</div>

## 在线站点

<div class="store-grid">

<a class="store-card is-online" href="https://index.dustella.net" target="_blank" rel="noopener"><span class="store-avatar">D</span><span class="store-body"><span class="store-name-row"><span class="store-name">dustella</span><span class="store-pill pill-online">在线</span></span><span class="store-domain">index.dustella.net</span><span class="store-desc">基于 OpenList 搭建的文件索引与分享站，可直接浏览与下载资源。</span></span></a>

</div>

## 暂时无法访问

以下站点在最近一次检测中失联。为避免访问到被他人接管的失效域名，这里不再提供跳转链接。

<div class="store-grid">

<div class="store-card is-down"><span class="store-avatar">N</span><span class="store-body"><span class="store-name-row"><span class="store-name">nuist.link</span><span class="store-pill pill-error">源站异常</span></span><span class="store-domain">index.nuist.link</span><span class="store-desc">原「成员站点集合」入口站。当前 Cloudflare 返回 525（源站 SSL 握手失败），暂时无法打开。</span></span></div>

<div class="store-card is-down"><span class="store-avatar">N</span><span class="store-body"><span class="store-name-row"><span class="store-name">nuistshare</span><span class="store-pill pill-warn">服务已停止</span></span><span class="store-domain">index.nuistshare.cn</span><span class="store-desc">组织曾经的文件分享站。服务器可连通，但页面显示 “Sorry, the website has been stopped”，空间已被停用。</span></span></div>

<div class="store-card is-down"><span class="store-avatar">J</span><span class="store-body"><span class="store-name-row"><span class="store-name">jinzhi</span><span class="store-pill pill-error">服务器无响应</span></span><span class="store-domain">index.jinzhi.tech</span><span class="store-desc">成员 jinzhi 的个人站点。域名解析正常，但连接持续超时。</span></span></div>

<div class="store-card is-down"><span class="store-avatar">Q</span><span class="store-body"><span class="store-name-row"><span class="store-name">qlozin</span><span class="store-pill pill-error">域名失效</span></span><span class="store-domain">index.qlozin.top</span><span class="store-desc">成员 qlozin 的个人站点。域名已无法解析（NXDOMAIN），可能未续费。</span></span></div>

<div class="store-card is-down"><span class="store-avatar">J</span><span class="store-body"><span class="store-name-row"><span class="store-name">jerrynya</span><span class="store-pill pill-error">网关错误</span></span><span class="store-domain">index.jerrynya.fun</span><span class="store-desc">成员 jerry 的个人站点。网关返回 502，后端服务未在运行。</span></span></div>

</div>

## 收录说明

- 各站点的可用状态为 **2026-09-13** 的人工检测结果，仅代表检测时点的情况，请以实际访问为准。
- 想把自己的站点加进来？Fork [本站仓库](https://github.com/nuist-engineer-lion/nuist-engineer-lion-homepage)，编辑 `archive/store/index.md` 后提交 PR 即可。
- 长期无法恢复的站点会在确认后从列表移除；重新上线的站点会移回「在线站点」。

</div>

<style scoped>
.store-page {
  --st-green: #1a7f37;
  --st-green-bg: rgba(46, 160, 67, 0.1);
  --st-green-bd: rgba(46, 160, 67, 0.35);
  --st-amber: #9a6700;
  --st-amber-bg: rgba(212, 167, 44, 0.12);
  --st-amber-bd: rgba(212, 167, 44, 0.4);
  --st-red: #cf222e;
  --st-red-bg: rgba(207, 34, 46, 0.08);
  --st-red-bd: rgba(207, 34, 46, 0.35);
}

.dark .store-page {
  --st-green: #4ade80;
  --st-green-bg: rgba(74, 222, 128, 0.1);
  --st-green-bd: rgba(74, 222, 128, 0.3);
  --st-amber: #fbd38d;
  --st-amber-bg: rgba(251, 191, 36, 0.1);
  --st-amber-bd: rgba(251, 191, 36, 0.3);
  --st-red: #f87171;
  --st-red-bg: rgba(248, 113, 113, 0.1);
  --st-red-bd: rgba(248, 113, 113, 0.3);
}

/* —— 顶部横幅 —— */
.store-hero {
  margin: 0 0 30px;
  padding: 26px 28px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background:
    radial-gradient(480px 200px at 85% 0%, var(--vp-c-brand-soft), transparent 70%),
    var(--vp-c-bg-soft);
}

.store-hero h1 {
  margin: 0 0 10px;
  padding: 0;
  border-top: none;
}

.store-hero p {
  margin: 0 0 14px;
  font-size: 15px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.store-chip {
  display: inline-block;
  margin: 0 8px 8px 0;
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.store-chip.chip-online {
  color: var(--st-green);
  background: var(--st-green-bg);
  border-color: var(--st-green-bd);
}

.store-chip.chip-error {
  color: var(--st-red);
  background: var(--st-red-bg);
  border-color: var(--st-red-bd);
}

/* —— 站点卡片 —— */
.store-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 14px;
  margin: 0 0 10px;
}

.store-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}

a.store-card,
a.store-card:hover {
  text-decoration: none;
}

a.store-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.store-card.is-down {
  opacity: 0.82;
}

.store-avatar {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  font-size: 19px;
  font-weight: 700;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.is-down .store-avatar {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
}

.store-body {
  display: block;
  min-width: 0;
}

.store-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.store-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.store-pill {
  flex: none;
  padding: 4px 8px;
  border: 1px solid;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.pill-online {
  color: var(--st-green);
  background: var(--st-green-bg);
  border-color: var(--st-green-bd);
}

.pill-warn {
  color: var(--st-amber);
  background: var(--st-amber-bg);
  border-color: var(--st-amber-bd);
}

.pill-error {
  color: var(--st-red);
  background: var(--st-red-bg);
  border-color: var(--st-red-bd);
}

.store-domain {
  display: block;
  overflow: hidden;
  margin-top: 2px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
}

.store-desc {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

/* —— 窄屏收紧 —— */
@media (max-width: 560px) {
  .store-hero {
    padding: 20px 18px 16px;
  }

  .store-grid {
    grid-template-columns: 1fr;
  }
}
</style>
