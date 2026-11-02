---
layout: default
title: "首页"
description: "Xunberg：实验室自动化、AI Agent 与数据架构。实验设备接入大模型、Agent 生产化，以及数据与模型工程。"
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">Xunberg's Tech Blog</span>
    </h1>
    <p class="hero-subtitle">
      实验室自动化 · AI Agent · 数据架构
    </p>
    <div class="hero-buttons">
      <a href="{{ '/mcp/' | relative_url }}" class="btn btn-primary">实验室自动化</a>
      <a href="{{ '/agent/series/agent-from-0-to-1/' | relative_url }}" class="btn btn-secondary">Agent 生产化手记</a>
      <a href="{{ '/agent/series/life-science-agent/' | relative_url }}" class="btn btn-secondary">生命科学系列</a>
      <a href="#latest-posts" class="btn btn-secondary">最新文章</a>
    </div>
  </div>
</div>

<section id="latest-posts" class="section">
  <div class="container">
    <h2 class="section-title">最新文章</h2>
    {% include latest-posts-grid.html limit=12 %}
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2 class="section-title">三条线</h2>
    <div class="about-grid">
      <div class="about-item">
        <div class="about-icon">🚀</div>
        <h3><a href="{{ '/mcp/' | relative_url }}">实验室自动化</a></h3>
        <p>实验设备怎样被 Agent 发现和调用。已发布的笔记用 MCP 把 Node-RED 设备服务接到 Dify；Anthropic 的 MHS 会继续写在这一栏。</p>
      </div>
      <div class="about-item">
        <div class="about-icon">💡</div>
        <h3><a href="{{ '/agent/' | relative_url }}">AI Agent</a></h3>
        <p>生命科学推理平台、从演示到上线的生产化手记，以及之后的观测与评测。</p>
      </div>
      <div class="about-item">
        <div class="about-icon">🔧</div>
        <h3><a href="{{ '/llm/' | relative_url }}">数据与模型</a></h3>
        <p>向量检索、推理服务和小模型微调。数据链路和线上故障记在 <a href="{{ '/daily/' | relative_url }}">工程笔记</a>。</p>
      </div>
    </div>
  </div>
</section>
