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
- 统计：Google Analytics 4 记录访问；页脚另有访问计数，数字不从 GA 回读

GitHub Pages 不渲染 Mermaid。正文插图使用 `assets/images/` 下的 PNG，并用 `relative_url` 引用。

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
assets/                     样式、脚本、图片
```

`draft/` 写在 `_config.yml` 的 `exclude` 里，推送到 `main` 也不会出现在网站上。

## 发布一篇文章

1. 在对应 collection 目录新增 Markdown，例如 `_agent/my-post.md`。
2. 写 front matter。`permalink` 与栏目路径保持一致。

```yaml
---
layout: post
title: "文章标题"
date: 2026-10-28
category: "Agent实战"
series: agent-from-0-to-1
series_order: 5
tags:
  - AI Agent
description: "用于搜索结果和社交分享的摘要。"
excerpt: "文章页标题下的导语。"
permalink: /agent/my-post/
---
```

3. 插图放到 `assets/images/`，在正文中这样引用：

```markdown
![图示说明]({{ '/assets/images/agent/example.png' | relative_url }})
```

4. 新系列除了文章 front matter，还要在 `_data/series.yml` 增加一条，并在 `agent/series/`（或其他栏目）放系列页。
5. 合并到 `main` 后，GitHub Pages 会重新构建。

## 本地预览

依赖 [github-pages](https://github.com/github/pages-gem) gem，本地构建与 Pages 使用同一套 Jekyll 版本。

```bash
git clone https://github.com/xunberg/xunberg.github.io.git
cd xunberg.github.io
bundle install
bundle exec jekyll serve
```

浏览器打开 `http://localhost:4000`。`draft/` 被排除，本地预览也不会带上未发布原稿。

常用命令：

```bash
bundle exec jekyll serve --livereload
bundle exec jekyll build
bundle exec jekyll clean
```

## 部署

站点由 GitHub Pages 从 `main` 分支的根目录构建（Jekyll，legacy 构建），没有单独的 Actions 工作流。推送到 `main` 后，线上站点为 [https://xunberg.github.io/](https://xunberg.github.io/)。

## 作者

Xunberg · [GitHub](https://github.com/xunberg) · [CSDN](https://blog.csdn.net/zxlp520) · [掘金](https://juejin.cn/user/1239904848969895)
