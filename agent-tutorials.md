---
layout: default
title: "Agent 技术"
description: "AI Agent 实战：Vibe Coding、生命科学 Agent 系列、LLM 编排与企业落地案例与教程。"
permalink: /agent/
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">Agent 技术</span>
    </h1>
    <p class="hero-subtitle">
      AI Agent 实战与工程化：从 Vibe Coding 到生命科学场景落地
    </p>
  </div>
</div>

<section class="section section-alt">
  <div class="container">
    <h2 class="section-title">进行中的系列</h2>
    {% assign ls = site.data.series.life-science-agent %}
    <article class="post-card series-highlight">
      <div class="post-meta">
        <span class="post-category">{{ ls.status }}</span>
      </div>
      <h3 class="post-title">
        <a href="{{ ls.permalink | relative_url }}">{{ ls.title }}</a>
      </h3>
      <p class="post-excerpt">{{ ls.summary }}</p>
      <div class="post-tags">
        {% for kw in ls.keywords %}
        <span class="tag">{{ kw }}</span>
        {% endfor %}
      </div>
    </article>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title">实践案例</h2>
    
    <div class="posts-grid">
      {% for post in site.agent %}
      <article class="post-card">
        <div class="post-meta">
          {% if post.category %}
          <span class="post-category">{{ post.category }}</span>
          {% endif %}
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
        <p class="post-excerpt">{{ post.excerpt }}</p>
        {% endif %}
        
        {% if post.tags %}
        <div class="post-tags">
          {% for tag in post.tags %}
          <span class="tag">{{ tag }}</span>
          {% endfor %}
        </div>
        {% endif %}
      </article>
      {% endfor %}
    </div>
    
    {% if site.agent.size == 0 %}
    <div class="empty-state">
      <div class="empty-icon">🚀</div>
      <h3>内容即将上线</h3>
      <p>Agent相关的内容正在准备中，敬请期待！</p>
    </div>
    {% endif %}
  </div>
</section>
