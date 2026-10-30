---
layout: default
title: "实验室自动化"
description: "实验室自动化设备智能化：用 MCP 把 Node-RED 设备服务接到 Dify 等大模型平台，并持续关注 Anthropic 的 Model Hardware Standard（MHS）。"
permalink: /mcp/
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">实验室自动化</span>
    </h1>
    <p class="hero-subtitle">
      设备智能化：实验设备怎样被 Agent 发现和调用
    </p>
  </div>
</div>

<section class="section">
  <div class="container">
    <p class="section-lead">
      已发布的文章走 MCP：在 Node-RED 里把设备做成服务，再接到 Dify，让模型调用真实设备上的动作。Anthropic 在 2026 年 8 月放出 <a href="https://www.anthropic.com/news/model-hardware-standard-research-preview">Model Hardware Standard（MHS）</a> 研究预览，给显微镜、液体处理、机械臂这类可编程设备一套统一驱动和读写原语，Agent 可以通过 MCP、命令行或代码访问它。标准还在小范围预览、尚未完全开源，后续笔记会继续放在这里。
    </p>

    <h2 class="section-title">文章</h2>

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
    <h2 class="section-title">这一栏写什么</h2>

    <div class="about-grid">
      <div class="about-item">
        <div class="about-icon">🔬</div>
        <h3>设备智能化</h3>
        <p>专题是实验设备怎样进入 Agent 的工具列表：发现、调用、把称量和移液这类动作交回模型编排。</p>
      </div>

      <div class="about-item">
        <div class="about-icon">🔌</div>
        <h3>当前：MCP</h3>
        <p>Model Context Protocol。Node-RED 暴露设备服务，Dify 通过 MCP 调用，模型由此碰到真实设备。</p>
      </div>

      <div class="about-item">
        <div class="about-icon">🧰</div>
        <h3>后续：MHS</h3>
        <p>Anthropic 的 Model Hardware Standard。统一的设备驱动和读写原语，面向实验室和制造设备，可通过 MCP 访问。开源之后的实践会补在这里。</p>
      </div>
    </div>
  </div>
</section>
