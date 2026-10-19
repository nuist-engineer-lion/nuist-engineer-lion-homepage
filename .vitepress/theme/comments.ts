// 成员详情页评论（Twikoo，后端部署在 Cloudflare Workers + D1）。
//
// TWIKOO_ENV_ID 填 Worker 的地址（带 https://，末尾不要斜杠），例如 https://twikoo.nuist.dev。
// 留空时评论区整块不显示，站点其他部分不受影响。
// 前端 twikoo 包版本固定在 package.json 里，升级时与后端一起升，避免前后端不兼容。
export const TWIKOO_ENV_ID = 'https://twikoo.nuist.dev'
