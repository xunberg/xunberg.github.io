---
layout: default
title: "生命科学推理平台"
description: "有限 GPU 下为生命科学 Agent 搭建推理平台：负载画像、选型取舍、Agent 协同与可观测性。系列共 3 篇，已完结。"
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
      <span class="gradient-text">生命科学推理平台</span>
    </h1>
    <p class="hero-subtitle">
      有限 GPU 算力下，为生命科学 Agent 搭一套推理平台。共 3 篇，已完结。
    </p>
  </div>
</div>

<section class="section">
  <div class="container container--narrow series-page">
    <p class="series-lead">
      这一系列只讨论推理平台本身：负载为什么不像通用推理服务、队列和 GPU 怎么选，以及平台怎样和 Agent 协同、怎样度量成本。移液枪等单点实践放在 Agent 栏目的「日常 Agent 分享」里。
    </p>

    <h2>系列文章</h2>
    <p class="series-status">已完结，共 3 篇。</p>

    <div class="posts-grid">
      {% assign series_posts = site.agent | where: "series", "life-science-agent" | sort: "series_order" %}
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
