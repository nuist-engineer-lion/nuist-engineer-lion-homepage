import { defineConfig } from 'vitepress'
import { getSidebar } from 'vitepress-plugin-auto-sidebar'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "海上修机师",
  description: "海上修机师 · 通知动态、修机文档与档案馆",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/logo.svg',
    nav: [
      { text: '修机文档', link: '/docs/' },
      { text: '最新通知', link: '/notices/' },
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
      { icon: 'github', link: 'https://github.com/nuist-engineer-lion/nuist-engineer-lion.github.io' }
    ],

    footer: {
      message: '基于 AGPL-3.0 协议开源',
      copyright: 'Copyright © 2016-present 海上修机师 · NUIST'
    }
  }
})
