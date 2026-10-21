---
layout: default
title: "生命科学 Agent 实战系列"
description: "生命科学场景下的 AI Agent 实战系列：架构设计、MCP 工具接入、LLM 编排与落地踩坑，文章陆续更新。"
permalink: /agent/series/life-science-agent/
keywords:
  - 生命科学 Agent
  - 实验室 AI
  - MCP
  - Agent 实战
---

<div class="hero-section hero-section--compact">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">生命科学 Agent 实战</span>
    </h1>
    <p class="hero-subtitle">
      面向生命科学业务的 Agent 落地系列：从场景拆解到可运行的工具链与编排，持续更新。
    </p>
  </div>
</div>

<section class="section">
  <div class="container container--narrow series-page">
    <p class="series-lead">
      本系列记录我在生命科学方向构建 Agent 的完整过程，包括需求与合规边界、工具与 MCP 设计、模型与推理、以及与现有系统（LIMS、设备、数据平台）的集成思路。
      如果你在做 <strong>实验室自动化</strong>、<strong>移液/调参</strong>、或 <strong>企业内部 Agent 平台</strong>，可以从下面路径读起。
    </p>

    <h2>系列文章</h2>
    <p class="series-status">🚧 正文撰写中，首篇发布后将自动出现在下方列表。</p>

    <div class="posts-grid">
      {% assign series_posts = site.agent | where: "series", "life-science-agent" | sort: 'date' | reverse %}
      {% for post in series_posts %}
      <article class="post-card">
        <div class="post-meta">
          {% if post.date %}
          <time class="post-date" datetime="{{ post.date | date_to_xmlschema }}">
            {{ post.date | date: "%Y年%m月%d日" }}
          </time>
          {% endif %}
        </div>
        <h3 class="post-title">
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h3>
        {% if post.excerpt %}
        <p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 160 }}</p>
        {% endif %}
      </article>
      {% endfor %}
    </div>

    {% if series_posts.size == 0 %}
    <p>暂无已发布章节。你可以在 <a href="{{ '/agent/' | relative_url }}">Agent 技术</a> 栏目查看已上线的 Vibe Coding 等实战文。</p>
    {% endif %}

    <h2>相关阅读</h2>
    <ul>
      <li><a href="{{ '/agent/vibe-coding/' | relative_url }}">用 Vibe Coding 开发移液枪自动化调参系统</a> — 与本系列同属「设备 + Agent」方向</li>
      <li><a href="{{ '/mcp/' | relative_url }}">MCP 教程</a> — Agent 对外工具能力的基础</li>
    </ul>
  </div>
</section>

<style>
.series-page .series-lead {
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.series-page .series-status {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.series-page h2 {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.35rem;
}

.series-page ul {
  padding-left: 1.25rem;
  color: var(--text-secondary);
}

.series-page li {
  margin-bottom: 0.5rem;
}
</style>
