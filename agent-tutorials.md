---
layout: default
title: "Agent 技术"
description: "Agent 文章分四条线：生命科学推理平台、Agent 从 0 到 1、观测与评测，以及日常 Agent 分享。"
permalink: /agent/
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">Agent 技术</span>
    </h1>
    <p class="hero-subtitle">
      四条阅读线：生命科学推理平台、Agent 从 0 到 1、观测与评测，以及日常 Agent 分享。
    </p>
  </div>
</div>

<section class="section">
  <div class="container agent-tracks">
    {% assign platform = site.data.series.life-science-agent %}
    {% assign platform_posts = site.agent | where: "series", "life-science-agent" | sort: "series_order" %}
    {% assign zero_one = site.data.series.agent-from-0-to-1 %}
    {% assign zero_one_posts = site.agent | where: "series", "agent-from-0-to-1" | sort: "series_order" %}
    {% assign observe = site.data.series.agent-observe-eval %}
    {% assign observe_posts = site.agent | where: "series", "agent-observe-eval" | sort: "series_order" %}
    {% assign notes = site.agent | where_exp: "item", "item.series == nil" | sort: "date" %}

    <article class="agent-track">
      <header class="agent-track__head">
        <span class="agent-track__index">01</span>
        <div>
          <h2 class="agent-track__title">
            <a href="{{ platform.permalink | relative_url }}">生命科学推理平台</a>
          </h2>
          <p class="agent-track__summary">{{ platform.summary }}</p>
        </div>
        <span class="agent-track__status">{{ platform.status }}</span>
      </header>
      <ol class="agent-track__chapters">
        {% for post in platform_posts %}
        <li>
          <a href="{{ post.url | relative_url }}">
            <span class="agent-track__no">{{ post.series_order }}</span>
            <span class="agent-track__name">{{ post.title }}</span>
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time>
          </a>
        </li>
        {% endfor %}
      </ol>
    </article>

    <article class="agent-track">
      <header class="agent-track__head">
        <span class="agent-track__index">02</span>
        <div>
          <h2 class="agent-track__title">
            <a href="{{ zero_one.permalink | relative_url }}">Agent 从 0 到 1</a>
          </h2>
          <p class="agent-track__summary">{{ zero_one.summary }}</p>
        </div>
        <span class="agent-track__status">{{ zero_one.status }}</span>
      </header>
      <ol class="agent-track__chapters">
        {% for post in zero_one_posts %}
        <li>
          <a href="{{ post.url | relative_url }}">
            <span class="agent-track__no">{{ post.series_order }}</span>
            <span class="agent-track__name">{{ post.title }}</span>
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time>
          </a>
        </li>
        {% endfor %}
      </ol>
    </article>

    <article class="agent-track">
      <header class="agent-track__head">
        <span class="agent-track__index">03</span>
        <div>
          <h2 class="agent-track__title">
            <a href="{{ observe.permalink | relative_url }}">Agent 观测与评测</a>
          </h2>
          <p class="agent-track__summary">{{ observe.summary }}</p>
        </div>
        <span class="agent-track__status">{{ observe.status }}</span>
      </header>
      {% if observe_posts.size > 0 %}
      <ol class="agent-track__chapters">
        {% for post in observe_posts %}
        <li>
          <a href="{{ post.url | relative_url }}">
            <span class="agent-track__no">{{ post.series_order }}</span>
            <span class="agent-track__name">{{ post.title }}</span>
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time>
          </a>
        </li>
        {% endfor %}
      </ol>
      {% else %}
      <p class="agent-track__empty">这一系列还没开始更新，观测和评测的搭建笔记会补在这里。</p>
      {% endif %}
    </article>

    <article class="agent-track agent-track--notes">
      <header class="agent-track__head">
        <span class="agent-track__index">04</span>
        <div>
          <h2 class="agent-track__title">日常 Agent 分享</h2>
          <p class="agent-track__summary">不属于上面几个系列的单篇实践。这一组会继续补充。</p>
        </div>
        <span class="agent-track__status">持续补充</span>
      </header>
      {% if notes.size > 0 %}
      <ol class="agent-track__chapters">
        {% for post in notes %}
        <li>
          <a href="{{ post.url | relative_url }}">
            <span class="agent-track__no">·</span>
            <span class="agent-track__name">{{ post.title }}</span>
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time>
          </a>
        </li>
        {% endfor %}
      </ol>
      {% else %}
      <p class="agent-track__empty">还没有单篇。之后的日常分享会放在这里。</p>
      {% endif %}
    </article>
  </div>
</section>

<style>
.agent-tracks {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 980px;
}

.agent-track {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

.agent-track__head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 1rem 1.25rem;
  align-items: start;
  padding: 1.35rem 1.5rem 1.15rem;
}

.agent-track__index {
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--primary-color);
  padding-top: 0.2rem;
}

.agent-track__title {
  margin: 0 0 0.4rem;
  font-size: 1.35rem;
  line-height: 1.3;
}

.agent-track__title a {
  color: var(--text-primary);
  text-decoration: none;
}

.agent-track__title a:hover {
  color: var(--primary-color);
}

.agent-track__summary {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 0.95rem;
}

.agent-track__status {
  justify-self: end;
  white-space: nowrap;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary-color);
  background: var(--background-tertiary);
  border-radius: 999px;
  padding: 0.3rem 0.7rem;
}

.agent-track__chapters {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--border);
}

.agent-track__chapters a {
  display: grid;
  grid-template-columns: 1.75rem minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: baseline;
  padding: 0.85rem 1.5rem;
  text-decoration: none;
  color: var(--text-primary);
  border-top: 1px solid var(--border-light);
}

.agent-track__chapters li:first-child a {
  border-top: 0;
}

.agent-track__chapters a:hover {
  background: var(--background-secondary);
}

.agent-track__chapters a:hover .agent-track__name {
  color: var(--primary-color);
}

.agent-track__no {
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  font-size: 0.85rem;
}

.agent-track__name {
  line-height: 1.55;
}

.agent-track__chapters time {
  color: var(--text-muted);
  font-size: 0.82rem;
  white-space: nowrap;
}

.agent-track__empty {
  margin: 0;
  padding: 0.2rem 1.5rem 1.25rem;
  color: var(--text-secondary);
}

@media (max-width: 720px) {
  .agent-track__head {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .agent-track__status {
    grid-column: 2;
    justify-self: start;
  }

  .agent-track__chapters a {
    grid-template-columns: 1.5rem minmax(0, 1fr);
  }

  .agent-track__chapters time {
    grid-column: 2;
  }
}
</style>
