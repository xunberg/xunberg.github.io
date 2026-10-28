---
layout: default
title: "首页"
description: "Xunberg 技术博客：MCP 协议、AI Agent 实战、LLM 推理与生命科学 Agent 落地教程，含 Node-RED、Dify 集成与开源项目。"
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">Xunberg's Tech Blog</span>
    </h1>
    <p class="hero-subtitle">
      MCP · AI Agent · LLM 实战 · Agent 生产化手记连载中
    </p>
    <div class="hero-buttons">
      <a href="{{ '/mcp/' | relative_url }}" class="btn btn-primary">MCP 教程</a>
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
    <h2 class="section-title">关于项目</h2>
    <div class="about-grid">
      <div class="about-item">
        <div class="about-icon">🚀</div>
        <h3>技术前沿</h3>
        <p>专注于 MCP、AI Agent 与 LLM 工程化，提供可复现的教程与开源实践。</p>
      </div>
      <div class="about-item">
        <div class="about-icon">💡</div>
        <h3>实战导向</h3>
        <p>文章基于真实项目，含 Node-RED、Dify、企业 Agent 与生命科学场景。</p>
      </div>
      <div class="about-item">
        <div class="about-icon">🔧</div>
        <h3>工具整合</h3>
        <p>探索 MCP 与现有工具链集成，构建从原型到上线的完整路径。</p>
      </div>
    </div>
  </div>
</section>
