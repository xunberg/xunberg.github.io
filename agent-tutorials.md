---
layout: default
title: "AI 编程实践"
permalink: /agent/
---

<div class="hero-section">
  <h1>AI 编程实践</h1>
  <p class="hero-subtitle">探索 AI 辅助编程的实战经验和技术分享</p>
</div>

<div class="tutorials-grid">
  {% for post in site.agent %}
    <article class="tutorial-card">
      <div class="tutorial-header">
        <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
        <div class="tutorial-meta">
          <span class="date">{{ post.date | date: "%Y-%m-%d" }}</span>
          <span class="category">{{ post.category }}</span>
        </div>
      </div>
      
      {% if post.excerpt %}
        <p class="tutorial-excerpt">{{ post.excerpt }}</p>
      {% endif %}
      
      {% if post.tags %}
        <div class="tutorial-tags">
          {% for tag in post.tags %}
            <span class="tag">{{ tag }}</span>
          {% endfor %}
        </div>
      {% endif %}
      
      <a href="{{ post.url | relative_url }}" class="read-more">阅读全文 →</a>
    </article>
  {% endfor %}
</div>

{% if site.agent.size == 0 %}
  <div class="empty-state">
    <h3>内容即将上线</h3>
    <p>AI 编程相关的内容正在准备中，敬请期待！</p>
  </div>
{% endif %}

<style>
.hero-section {
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-top: 1rem;
}

.tutorials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.tutorial-card {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.tutorial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.tutorial-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
}

.tutorial-header h2 a {
  color: #2c3e50;
  text-decoration: none;
}

.tutorial-header h2 a:hover {
  color: #3498db;
}

.tutorial-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.tutorial-excerpt {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.tutorial-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: #f8f9fa;
  color: #495057;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid #dee2e6;
}

.read-more {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-top: 0.5rem;
}

.read-more:hover {
  color: #0056b3;
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@media (max-width: 768px) {
  .tutorials-grid {
    grid-template-columns: 1fr;
  }
  
  .tutorial-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
