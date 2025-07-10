---
layout: default
title: "MCP 教程"
permalink: /mcp/
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">MCP 教程系列</span>
    </h1>
    <p class="hero-subtitle">
      深入了解 Model Context Protocol (MCP) 的理论与实践
    </p>
  </div>
</div>

<section class="section">
  <div class="container">
    <h2 class="section-title">教程列表</h2>
    
    <div class="posts-grid">
      {% for post in site.mcp %}
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
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2 class="section-title">关于 MCP</h2>
    
    <div class="about-grid">
      <div class="about-item">
        <div class="about-icon">🔌</div>
        <h3>协议标准</h3>
        <p>MCP (Model Context Protocol) 是一个开放的标准协议，用于连接 AI 模型与外部工具和数据源。</p>
      </div>
      
      <div class="about-item">
        <div class="about-icon">🛠️</div>
        <h3>实用工具</h3>
        <p>通过 MCP，我们可以让 AI Agent 获得与真实世界交互的能力，如控制设备、访问数据库等。</p>
      </div>
      
      <div class="about-item">
        <div class="about-icon">🚀</div>
        <h3>快速集成</h3>
        <p>使用 Node-RED 和相关插件，可以快速构建符合 MCP 标准的服务，并集成到各种 AI 平台中。</p>
      </div>
    </div>
  </div>
</section>
