---
layout: default
title: "日常分享"
description: "开发日常：Java/Flink 故障排查、序列化 Bug 修复与工程踩坑记录。"
permalink: /daily/
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">日常分享</span>
    </h1>
    <p class="hero-subtitle">
      记录工作中遇到的问题、解决方案和技术心得
    </p>
  </div>
</div>

<section class="section">
  <div class="container">
    <h2 class="section-title">分享列表</h2>
    
    <div class="posts-grid">
      {% for post in site.daily %}
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
    
    {% if site.daily.size == 0 %}
    <div class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>内容即将上线</h3>
      <p>日常分享的内容正在准备中，敬请期待！</p>
    </div>
    {% endif %}
  </div>
</section>
