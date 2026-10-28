---
layout: default
title: "Agent 从 0 到 1 · 生产化手记"
description: "Agent 生产化系列：从 Demo 到可上线 10 个月的有状态长事务——人机提问、子 Agent、运行时拆分、Checkpoint 与记忆预算，按踩坑顺序连载。"
permalink: /agent/series/agent-from-0-to-1/
keywords:
  - Agent 生产化
  - AI Agent 架构
  - HITL
  - 长事务
---

<div class="hero-section hero-section--compact">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">Agent 从 0 到 1</span>
    </h1>
    <p class="hero-subtitle">
      生产化手记：当 Agent 不再是一次请求，而是一笔可能持续几十分钟、会中断、会失败、要花钱、要被人看懂的长事务。
    </p>
  </div>
</div>

<section class="section">
  <div class="container container--narrow series-page">
    <p class="series-lead">
      本系列不写框架教程，也不罗列最佳实践清单。记录的是内测与上线过程中的<strong>故障现场、判断与代价</strong>——刷新丢卡片、确认码过期、Checkpoint 拖垮排队、254KB 记忆烧掉十几万 token。计划共 8 篇，按踩坑顺序更新。
    </p>

    <h2>系列文章</h2>
    <p class="series-status">连载中，新章节发布后自动出现在下方列表。</p>

    <div class="posts-grid">
      {% assign series_posts = site.agent | where: "series", "agent-from-0-to-1" | sort: 'series_order' %}
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
    <p>暂无已发布章节。你可以在 <a href="{{ '/agent/' | relative_url }}">Agent 技术</a> 栏目查看其他实战文。</p>
    {% endif %}

    <h2>相关阅读</h2>
    <ul>
      <li><a href="{{ '/agent/series/life-science-agent/' | relative_url }}">生命科学 Agent 推理平台</a> — 算力约束下的 Agent 工具链与平台契约</li>
      <li><a href="{{ '/agent/vibe-coding/' | relative_url }}">Vibe Coding 与移液枪自动化</a> — 设备侧 Agent 落地</li>
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
