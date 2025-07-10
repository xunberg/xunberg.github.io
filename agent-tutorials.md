---
layout: default
title: "AI 编程实践"
permalink: /agent/
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">AI 编程实践</span>
    </h1>
    <p class="hero-subtitle">
      探索 AI 辅助编程的实战经验和技术分享
    </p>
  </div>
</div>

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
      <p>AI 编程相关的内容正在准备中，敬请期待！</p>
    </div>
    {% endif %}
  </div>
</section>
