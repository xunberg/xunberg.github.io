---
layout: default
title: "Agent 观测与评测"
description: "Agent 观测与评测系统搭建系列：链路追踪、运行指标、评测集和回归。章节随后补充。"
permalink: /agent/series/agent-observe-eval/
keywords:
  - Agent 可观测性
  - Agent 评测
  - Trace
  - 系统搭建
---

<div class="hero-section hero-section--compact">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">Agent 观测与评测</span>
    </h1>
    <p class="hero-subtitle">
      怎样给 Agent 搭一套能看清运行过程、也能衡量效果的系统。章节随后补充。
    </p>
  </div>
</div>

<section class="section">
  <div class="container container--narrow series-page">
    <p class="series-lead">
      这一系列记录观测和评测系统怎么搭：一次会话怎样串起 trace，线上指标看什么，评测集和回归怎样接到发布流程里。文章会按写作顺序加到下面。
    </p>

    <h2>系列文章</h2>
    <p class="series-status">筹备中，新章节发布后自动出现在下方列表。</p>

    <div class="posts-grid">
      {% assign series_posts = site.agent | where: "series", "agent-observe-eval" | sort: "series_order" %}
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
    <p>还没有已发布章节。可以先从 <a href="{{ '/agent/' | relative_url }}">AI Agent</a> 看已经写完的系列。</p>
    {% endif %}

    <h2>相关阅读</h2>
    <ul>
      <li><a href="{{ '/agent/series/agent-from-0-to-1/' | relative_url }}">Agent 从 0 到 1</a> — 生产化里已经碰到的追踪和账单问题</li>
      <li><a href="{{ '/agent/series/life-science-agent/' | relative_url }}">生命科学推理平台</a> — 推理侧的指标与成本归因</li>
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
