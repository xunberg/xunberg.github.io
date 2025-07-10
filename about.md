---
layout: default
title: "关于"
permalink: /about/
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">关于我</span>
    </h1>
    <p class="hero-subtitle">
      专注于 AI Agent 和物联网技术的开发者
    </p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="about-content">
      <div class="about-text">
        <h2>Hello! 我是 Xunberg</h2>
        
        <p>
          我是一名对 AI 技术和物联网充满热情的开发者，专注于 Model Context Protocol (MCP) 和 AI Agent 技术的研究与实践。
        </p>
        
        <p>
          在这个快速发展的 AI 时代，我致力于探索如何让人工智能更好地与现实世界交互。通过 MCP 协议，我们可以构建强大的 AI Agent，让它们不仅能够理解和生成文本，还能够控制物理设备、访问实时数据，真正成为我们生活和工作中的智能助手。
        </p>
        
        <h3>技术专长</h3>
        <ul>
          <li><strong>MCP (Model Context Protocol)</strong> - 深入理解 MCP 协议标准，具有丰富的服务端开发经验</li>
          <li><strong>Node-RED</strong> - 熟练使用 Node-RED 进行可视化流程编排和物联网应用开发</li>
          <li><strong>AI Agent 开发</strong> - 有经验将 AI 模型与外部工具集成，构建实用的智能应用</li>
          <li><strong>Python & FastAPI</strong> - 使用 Python 生态系统开发高性能的 API 服务</li>
          <li><strong>物联网 (IoT)</strong> - 边缘计算、设备管理和数据采集</li>
        </ul>
        
        <h3>项目经验</h3>
        <div class="project-list">
          <div class="project-item">
            <h4>Node-RED MCP 插件</h4>
            <p>
              基于开源项目二次开发，完整实现了 MCP 核心协议，解决了与 Dify、Claude 等平台集成的关键问题。
              该插件使 Node-RED 用户能够轻松构建符合 MCP 标准的服务。
            </p>
            <div class="project-links">
              <a href="https://github.com/xunberg/node-red-contrib-mcp-server" target="_blank">
                <i class="fab fa-github"></i> GitHub
              </a>
              <a href="https://flows.nodered.org/node/node-red-contrib-mcp-server" target="_blank">
                <i class="fas fa-external-link-alt"></i> NPM
              </a>
            </div>
          </div>
        </div>
        
        <h3>写作目标</h3>
        <p>
          通过这个博客，我希望能够：
        </p>
        <ul>
          <li>分享 MCP 和 AI Agent 开发的实战经验</li>
          <li>提供详细的技术教程和最佳实践</li>
          <li>探讨 AI 技术在实际应用中的可能性</li>
          <li>与技术社区交流学习，共同推动技术发展</li>
        </ul>
        
        <h3>联系我</h3>
        <p>
          如果您对我的文章有任何问题或建议，或者想要进行技术交流，欢迎通过以下方式联系我：
        </p>
        <div class="contact-links">
          <a href="https://github.com/xunberg" target="_blank" class="contact-link">
            <i class="fab fa-github"></i>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-text {
  line-height: 1.8;
}

.about-text h2 {
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.about-text h3 {
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.about-text ul {
  margin-bottom: 2rem;
  padding-left: 1.5rem;
}

.about-text li {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.project-list {
  margin-top: 2rem;
}

.project-item {
  background: var(--background-secondary);
  padding: 2rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border);
  margin-bottom: 2rem;
}

.project-item h4 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.project-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.project-links a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  font-size: 0.875rem;
  transition: var(--transition);
}

.project-links a:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.contact-links {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: var(--background-secondary);
  border: 1px solid var(--border);
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  color: var(--text-primary);
  transition: var(--transition);
}

.contact-link:hover {
  border-color: var(--primary-color);
  background-color: var(--background);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.contact-link i {
  font-size: 1.25rem;
  color: var(--primary-color);
}
</style>
