# Xunberg's Tech Blog

[xunberg.github.io](https://xunberg.github.io/) 的源码。这是一个用 Jekyll 构建、由 GitHub Pages 托管的中文技术博客，记录 MCP、AI Agent、LLM 工程实践和线上问题复盘。

## 栏目

| 栏目 | 路径 | 文章目录 |
| --- | --- | --- |
| MCP 教程 | [/mcp/](https://xunberg.github.io/mcp/) | `_mcp/` |
| Agent 技术 | [/agent/](https://xunberg.github.io/agent/) | `_agent/` |
| LLM | [/llm/](https://xunberg.github.io/llm/) | `_llm/` |
| 日常分享 | [/daily/](https://xunberg.github.io/daily/) | `_daily/` |
| 关于 | [/about/](https://xunberg.github.io/about/) | `about.md` |
| 支持作者 | [/support/](https://xunberg.github.io/support/) | `support.md` |

导航、站点信息和社交链接在 `_config.yml`。

## 系列

系列元数据在 `_data/series.yml`。文章 front matter 里设置 `series` 和 `series_order` 后，会出现在系列页，并带有上一篇 / 下一篇导航。

| 系列 | 状态 | 系列页 |
| --- | --- | --- |
| 生命科学 Agent 实战 | 已完结，共 3 篇 | [/agent/series/life-science-agent/](https://xunberg.github.io/agent/series/life-science-agent/) |
| Agent 从 0 到 1 · 生产化手记 | 连载中，第 1–4 篇已发布，计划 8 篇 | [/agent/series/agent-from-0-to-1/](https://xunberg.github.io/agent/series/agent-from-0-to-1/) |

## 阅读与站点能力

- 文章页：目录、阅读进度、面包屑、系列导航
- 右侧支持栏：微信 / 支付宝收款码，可点击放大
- SEO：`jekyll-seo-tag`、站点地图、RSS（`/feed.xml`）、Open Graph 与面包屑结构化数据
- 统计：GA4 看海外与 Google 来源，百度统计看国内访问；页脚计数是另一套展示，不从这两边回读

GitHub Pages 不渲染 Mermaid。正文插图使用 `assets/images/` 下的 PNG，并用 `relative_url` 引用。

本地启动、预览、发文和部署见 [用户手册](用户手册.md)。

## 仓库结构

```
_config.yml                 站点配置
_data/series.yml            系列标题、状态、链接
_layouts/                   default.html、post.html
_includes/                  导航、SEO、系列、支持栏、页脚统计
_mcp/  _agent/  _llm/  _daily/    已发布文章（Jekyll collections）
agent/series/               系列落地页
mcp-tutorials.md 等         栏目列表页
draft/                      未发布原稿，已从构建中排除
用户手册.md                 本地启动、预览、发文和部署
assets/                     样式、脚本、图片
```

`draft/` 和 `用户手册.md` 写在 `_config.yml` 的 `exclude` 里，不会出现在网站上。

## 作者

Xunberg · [GitHub](https://github.com/xunberg) · [CSDN](https://blog.csdn.net/zxlp520) · [掘金](https://juejin.cn/user/1239904848969895)
