# 通知目录使用说明

每一条通知是一个独立的 Markdown 文件，放在 `notices/entries/` 目录下。文件一经合入，首页"最新通知"气泡与 [通知中心](/notices/) 会自动更新，无需改动任何其他文件。

## 文件命名

```
notices/entries/YYYY-MM-DD-标题拼音或英文.md
```

例如：`notices/entries/2026-09-10-zhaoxin-qidong.md`

## 文件格式

```markdown
---
title: 通知标题（必填）
date: 2026-09-10
---

显示在列表中的摘要文字。

<!-- more -->

摘要之后、正文其余部分，只在通知详情页显示。
```

## 规则

- `title` 与 `date` 为必填 frontmatter 字段；`date` 使用 `YYYY-MM-DD` 格式。
- 列表按 `date` 倒序排列，首页气泡自动取最新一条。
- 摘要与正文用 `<!-- more -->` 分隔；若不写分隔符，列表中将不显示摘要。
- 删除文件即撤销该通知。
