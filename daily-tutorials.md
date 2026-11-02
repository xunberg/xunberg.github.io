---
layout: default
title: "工程笔记"
description: "数据链路和线上服务的故障排查与修复：Flink、序列化和服务假死。"
permalink: /daily/
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">工程笔记</span>
    </h1>
    <p class="hero-subtitle">
      数据链路和线上服务里的故障、修复和复盘
    </p>
  </div>
</div>

<section class="section">
  <div class="container">
    <h2 class="section-title">笔记</h2>
    
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
      <p>工程笔记还在整理，之后的故障复盘会放在这里。</p>
    </div>
    {% endif %}
  </div>
</section>
