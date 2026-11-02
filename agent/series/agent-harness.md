---
layout: default
title: "Agent Harness · 平台改造实录"
description: "生产型 Agent Harness 改造手记：能力供给、架构边界、工具协议和运行时自身。计划 4 篇，第 1 篇已发布。"
permalink: /agent/series/agent-harness/
keywords:
  - Agent Harness
  - 能力供给
  - 技能体系
  - 上下文
---

<div class="hero-section hero-section--compact">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">Agent Harness</span>
    </h1>
    <p class="hero-subtitle">
      能力供给、架构边界、协议闭环、运行时自身。计划 4 篇。
    </p>
  </div>
</div>

<section class="section">
  <div class="container container--narrow series-page">
    <p class="series-lead">
      这一系列写夹具层怎样上线、怎样运维、怎样长大。题目不是让模型变强。四篇由外及内：能力供给、架构边界、协议闭环、运行时自身。每一节从还没关掉的约束往下推。
    </p>

    <h2>系列文章</h2>
    <p class="series-status">连载中 · 第 1 篇已发布，计划共 4 篇。</p>

    <div class="posts-grid">
      {% assign series_posts = site.agent | where: "series", "agent-harness" | sort: "series_order" %}
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
    <p>还没有已发布章节。可以先从 <a href="{{ '/agent/' | relative_url }}">Agent 技术</a> 看已经写完的系列。</p>
    {% endif %}

    <h2>相关阅读</h2>
    <ul>
      <li><a href="{{ '/agent/agent-from-0-to-1-part3/' | relative_url }}">我们删了三次子 Agent</a> — 短文里的同一判断：能力是当前轮次里的过程，不是另一个执行域</li>
      <li><a href="{{ '/agent/series/agent-from-0-to-1/' | relative_url }}">Agent 从 0 到 1</a> — 长事务那一侧的生产化手记</li>
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
