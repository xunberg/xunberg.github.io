---
layout: default
title: "数据与模型"
description: "数据与模型工程：Elasticsearch HNSW 向量检索、vLLM 推理服务，以及小模型 SFT。"
permalink: /llm/
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">数据与模型</span>
    </h1>
    <p class="hero-subtitle">
      向量检索、推理服务和小模型微调
    </p>
  </div>
</div>

<section class="section">
  <div class="container">
    <h2 class="section-title">文章</h2>
    
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
    <h2 class="section-title">这一栏写什么</h2>
    
    <div class="about-grid">
      <div class="about-item">
        <div class="about-icon">🧠</div>
        <h3>向量检索</h3>
        <p>Elasticsearch HNSW 这一类近似最近邻，用在 RAG 的召回上。</p>
      </div>
      
      <div class="about-item">
        <div class="about-icon">⚡</div>
        <h3>推理服务</h3>
        <p>vLLM 的部署和推理调优，对应生命科学推理平台里那一层模型服务。</p>
      </div>
      
      <div class="about-item">
        <div class="about-icon">🚀</div>
        <h3>微调</h3>
        <p>小模型 SFT 和指令数据：什么时候该训，数据怎样进训练。</p>
      </div>
    </div>
  </div>
</section>
