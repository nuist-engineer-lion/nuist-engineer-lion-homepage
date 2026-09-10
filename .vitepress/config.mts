import { defineConfig } from 'vitepress'
import type { HeadConfig } from 'vitepress'
import { getSidebar } from 'vitepress-plugin-auto-sidebar'

// 页脚版权年份跟随构建时间，避免 "present" 这种模糊写法
const buildYear = new Date().getFullYear()

// 站点正式域名（GitHub Pages 自定义域名），sitemap / canonical / og:url 都基于它
const siteUrl = 'https://www.nuist.dev'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '海上修机师',
  description:
    '海上修机师 · NUIST 校园电脑义修：故障维修、系统安装、清灰保养与硬件升级，另有修机文档、通知动态与档案馆。',

  // 生成 sitemap.xml（仓库/目录说明页只面向贡献者，不进 sitemap）
  sitemap: {
    hostname: siteUrl,
    transformItems: (items) => items.filter((item) => !/README\.html$/.test(item.url))
  },

  head: [
    // 站点图标：SVG 优先，附 32×32 PNG 兜底；iOS 用 180×180
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/assets/logo.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/assets/icon-32.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/assets/icon-180.png' }],
    ['meta', { name: 'theme-color', content: '#0aa2b8' }],
    // 社交分享卡片
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '海上修机师' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: `${siteUrl}/assets/og-cover.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}/assets/og-cover.png` }],
    // 结构化数据：让搜索引擎识别站点主体
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '海上修机师',
        alternateName: 'NUIST 校园电脑义修',
        url: siteUrl,
        logo: `${siteUrl}/assets/icon-180.png`,
        description:
          '面向南京信息工程大学全校师生的电脑义修组织，提供故障维修、系统安装、清灰保养与硬件升级服务。'
      })
    ]
  ],

  // 每页补 canonical 与 og/twitter 的标题、描述、地址（构建期生效）
  transformHead({ pageData, title, description }) {
    const path = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html')
    const url = `${siteUrl}/${encodeURI(path)}`
    const tags: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }]
    ]

    // 仓库/目录说明页（README）只面向贡献者，不参与索引
    if (/(^|\/)README\.md$/.test(pageData.relativePath)) {
      tags.push(['meta', { name: 'robots', content: 'noindex' }])
    }

    return tags
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/logo.svg',
    nav: [
      { text: '修机文档', link: '/docs/' },
      { text: '通知中心', link: '/notices/' },
      { text: '档案馆', link: '/archive/' },
      { text: '历届部长团', link: '/archive/team/2023' },
      { text: '成员资源仓库', link: '/archive/store/' },
    ],
    sidebar:
    {
      "/docs/":[{
        text: "修机日志",
        items: getSidebar({ contentRoot: '.', contentDirs:["docs"],collapsible: false, collapsed: false })
      }],
      "/archive/team/":[{
        text: "历届部长团",
        items: getSidebar({ contentRoot: '.', contentDirs:["archive/team"],collapsible: false, collapsed: false })
      }]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nuist-engineer-lion/nuist-engineer-lion-homepage' }
    ],

    footer: {
      // AGPL 第 13 条：作为网络服务，需向访问者提供获取对应源代码的入口
      message:
        '本站代码以 <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noreferrer">AGPL-3.0</a> 协议开源 · <a href="https://github.com/nuist-engineer-lion/nuist-engineer-lion-homepage" target="_blank" rel="noreferrer">获取源码</a>',
      copyright: `Copyright © 2016-${buildYear} 海上修机师 · NUIST`
    }
  }
})
