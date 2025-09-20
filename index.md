---
layout: default
title: "首页"
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">Xunberg's Tech Blog</span>
    </h1>
    <p class="hero-subtitle">
      专注于 MCP、AI Agent、LLM 技术分享
    </p>
    <div class="hero-buttons">
      <a href="/mcp/" class="btn btn-primary">开始阅读</a>
      <a href="#latest-posts" class="btn btn-secondary">最新文章</a>
    </div>
  </div>
</div>

<section id="latest-posts" class="section">
  <div class="container">
    <h2 class="section-title">最新文章</h2>
      <article class="post-card">
        <div class="post-meta">
          <span class="post-category">LLM</span>
          <time class="post-date">2025-09-20</time>
        </div>
        <h3 class="post-title">
          <a href="/llm/use_es_hnsw/">从 RAG 检索效率瓶颈，到 HNSW 算法的深度解密</a>
        </h3>
        <p class="post-excerpt">
          深入探索 Elasticsearch 中 HNSW 算法的核心原理，从 RAG 检索效率瓶颈出发，详解分层导航小世界网络的构建与查询机制。
        </p>
        <div class="post-tags">
          <span class="tag">HNSW</span>
          <span class="tag">Elasticsearch</span>
          <span class="tag">向量检索</span>
          <span class="tag">RAG</span>
        </div>
      </article>
      <article class="post-card">
        <div class="post-meta">
          <span class="post-category">LLM</span>
          <time class="post-date">2025-07-22</time>
        </div>
        <h3 class="post-title">
          <a href="/llm/use_vLLM/">驾驭 vLLM 大模型推理：一次关于并发、长度与显存的探索之旅</a>
        </h3>
        <p class="post-excerpt">
          深入探索 vLLM 推理框架的核心参数配置，包括 max-num-batched-tokens、max-num-seqs、max-model-len 和 gpu-memory-utilization 的原理和调优策略。
        </p>
        <div class="post-tags">
          <span class="tag">vLLM</span>
          <span class="tag">大语言模型</span>
          <span class="tag">推理优化</span>
          <span class="tag">显存管理</span>
        </div>
      </article>
      <article class="post-card">
        <div class="post-meta">
          <span class="post-category">AI编程</span>
          <time class="post-date">2025-07-06</time>
        </div>
        <h3 class="post-title">
          <a href="/agent/vibe-coding/">Agent实战：用 Vibe Coding 方式开发移液枪自动化调参系统</a>
        </h3>
        <p class="post-excerpt">
          记录一次使用AI编程去完整的实现一个Agent实践，从草图到 V1.0，体验 bolt.new + Claude + Copilot 的开发流程。
        </p>
        <div class="post-tags">
          <span class="tag">AI编程</span>
          <span class="tag">Agent</span>
          <span class="tag">自动化</span>
        </div>
      </article>
      <article class="post-card">
        <div class="post-meta">
          <span class="post-category">AI Agent</span>
          <time class="post-date">2025-07-09</time>
        </div>
        <h3 class="post-title">
          <a href="/mcp/mcp-dify-integration/">AI Agent 实战：Node-RED MCP 服务接入 Dify</a>
        </h3>
        <p class="post-excerpt">
          实战演示如何将通过 Node-RED 创建的 MCP 设备服务成功接入到 Dify 平台。
        </p>
        <div class="post-tags">
          <span class="tag">Dify</span>
          <span class="tag">Node-RED</span>
          <span class="tag">集成</span>
        </div>
      </article>
      <article class="post-card">
        <div class="post-meta">
          <span class="post-category">实战指南</span>
          <time class="post-date">2025-07-08</time>
        </div>
        <h3 class="post-title">
          <a href="/mcp/node-red-mcp-guide/">Node-RED MCP 插件实践指南</a>
        </h3>
        <p class="post-excerpt">
          详细介绍 Node-RED MCP 插件的安装、配置和使用，包含常见问题的解决方案。
        </p>
        <div class="post-tags">
          <span class="tag">Node-RED</span>
          <span class="tag">插件</span>
          <span class="tag">实践</span>
        </div>
      </article>
      <article class="post-card">
        <div class="post-meta">
          <span class="post-category">MCP 教程</span>
          <time class="post-date">2025-05-08</time>
        </div>
        <h3 class="post-title">
          <a href="/mcp/mcp_from_0_1/">从0-1实现一个满足 MCP 协议的 Server</a>
        </h3>
        <p class="post-excerpt">
          从零开始构建 MCP Server，详细介绍 Model Context Protocol 的实现原理和实践方法。
        </p>
        <div class="post-tags">
          <span class="tag">Python</span>
          <span class="tag">FastAPI</span>
          <span class="tag">MCP</span>
        </div>
      </article>
      <article class="post-card">
        <div class="post-meta">
          <span class="post-category">技术深度</span>
          <time class="post-date">2025-04-28</time>
        </div>
        <h3 class="post-title">
          <a href="/mcp/mcp-sse-deep-dive/">深度解析 MCP SSE+HTTP 传输协议：从理论到实践</a>
        </h3>
        <p class="post-excerpt">
          深入分析 MCP 的 SSE+HTTP 传输协议运行机制，从开发 Dify OpenAPI 转 MCP SSE 插件的角度详解实现过程。
        </p>
        <div class="post-tags">
          <span class="tag">MCP</span>
          <span class="tag">SSE</span>
          <span class="tag">HTTP</span>
          <span class="tag">深度解析</span>
        </div>
      </article>
      <div class="posts-grid">
      <article class="post-card">
        <div class="post-meta">
          <span class="post-category">集成指南</span>
          <time class="post-date">2025-04-10</time>
        </div>
        <h3 class="post-title">
          <a href="/mcp/dify-local-tools-integration/">Dify 本地工具与 MCP 集成完整指南</a>
        </h3>
        <p class="post-excerpt">
          详细介绍两种方式将本地工具集成到 Dify 平台：OpenAPI 模式和 MCP SSE 模式，包含完整代码示例和配置步骤。
        </p>
        <div class="post-tags">
          <span class="tag">Dify</span>
          <span class="tag">MCP</span>
          <span class="tag">本地工具</span>
          <span class="tag">集成</span>
        </div>
      </article>
      <article class="post-card">
        <div class="post-meta">
          <span class="post-category">技术深度</span>
          <time class="post-date">2023-07-11</time>
        </div>
        <h3 class="post-title">
          <a href="/daily/flink-keyby-thinking/">Flink KeyBy 数据倾斜问题深度解析与优化实践</a>
        </h3>
        <p class="post-excerpt">
          记录在 Flink 实时数据处理中遇到的 KeyBy 数据倾斜问题，深入分析 Flink KeyGroup 分配机制，并提供了自定义 Key 重平衡的解决方案。
        </p>
        <div class="post-tags">
          <span class="tag">Flink</span>
          <span class="tag">数据倾斜</span>
          <span class="tag">实时计算</span>
        </div>
      </article>
      <article class="post-card">
        <div class="post-meta">
          <span class="post-category">Bug修复</span>
          <time class="post-date">2024-08-17</time>
        </div>
        <h3 class="post-title">
          <a href="/daily/fastjson-bytebuffer-bug-fix/">FastJSON ByteBuffer 序列化Bug深度解析与修复</a>
        </h3>
        <p class="post-excerpt">
          记录一次数据同步中遇到的 FastJSON 序列化 ByteBuffer 导致的 Bug，从问题发现到源码分析，最终找到解决方案的完整过程。
        </p>
        <div class="post-tags">
          <span class="tag">FastJSON</span>
          <span class="tag">ByteBuffer</span>
          <span class="tag">Bug修复</span>
        </div>
      </article>
      <article class="post-card">
        <div class="post-meta">
          <span class="post-category">故障排查</span>
          <time class="post-date"> 2022-03-05</time>
        </div>
        <h3 class="post-title">
          <a href="/daily/troubleshooting-of-service-feigned-death/">Java服务假死问题排查实战：从线程堆栈到超时配置</a>
        </h3>
        <p class="post-excerpt">
          记录一次生产环境中Java服务假死问题的完整排查过程，从发现问题到最终解决，涉及K8S监控、线程堆栈分析、网络超时配置等技术要点。
        </p>
        <div class="post-tags">
          <span class="tag">Java</span>
          <span class="tag">故障排查</span>
          <span class="tag">K8S</span>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <h2 class="section-title">关于项目</h2>
    <div class="about-grid">
      <div class="about-item">
        <div class="about-icon">🚀</div>
        <h3>技术前沿</h3>
        <p>专注于最新的 AI Agent 和 MCP 技术，提供实用的开发指南和最佳实践。</p>
      </div>
      <div class="about-item">
        <div class="about-icon">💡</div>
        <h3>实战导向</h3>
        <p>所有文章都基于实际项目经验，提供可执行的代码示例和详细的实现步骤。</p>
      </div>
      <div class="about-item">
        <div class="about-icon">🔧</div>
        <h3>工具整合</h3>
        <p>探索各种工具的集成方案，如 Node-RED、Dify 等，构建完整的技术生态。</p>
      </div>
    </div>
  </div>
</section> 


