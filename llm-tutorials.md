---
layout: default
title: "LLM 技术"
permalink: /llm/
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">LLM 技术</span>
    </h1>
    <p class="hero-subtitle">
      大语言模型技术的深度探索与实践
    </p>
  </div>
</div>

<section class="section">
  <div class="container">
    <h2 class="section-title">技术分享</h2>
    
    <div class="posts-grid">
      {% for post in site.llm %}
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
    <h2 class="section-title">关于 LLM</h2>
    
    <div class="about-grid">
      <div class="about-item">
        <div class="about-icon">🧠</div>
        <h3>大语言模型</h3>
        <p>深入探索 LLM 的部署、优化和推理技术，包括 vLLM、Transformers 等框架的使用心得。</p>
      </div>
      
      <div class="about-item">
        <div class="about-icon">⚡</div>
        <h3>性能优化</h3>
        <p>从显存管理到并发处理，分享大模型部署和推理过程中的性能调优经验和最佳实践。</p>
      </div>
      
      <div class="about-item">
        <div class="about-icon">🚀</div>
        <h3>应用实践</h3>
        <p>记录 LLM 在实际项目中的应用经验，包括模型选择、部署方案和效果评估等实战分享。</p>
      </div>
    </div>
  </div>
</section>
