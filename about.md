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
      十二年软件开发 · 实验室自动化、AI Agent 与数据架构
    </p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="about-content">
      <div class="about-text">
        <h2>Hello! 我是 Xunberg</h2>
        <p>
          我是一名有十二年软件开发经验的工程师。这个站点按三件事来组织：实验室自动化里的设备智能化、AI Agent 怎样进入生产，以及数据和模型这一侧的架构。
        </p>
        <p>
          性格开朗，乐于沟通，喜欢和同事交流技术心得。我认同一句话：<strong>写代码从来不是瓶颈，代码最大的成本是理解，而不是写出来</strong>。设备侧我目前用 MCP，在 Node-RED 里把实验设备做成服务，再接到 Dify，让模型调用真实设备。Anthropic 在 2026 年 8 月放出了 Model Hardware Standard（MHS）的研究预览，面向显微镜、液体处理、机械臂这类可编程设备，Agent 可以通过 MCP、命令行或代码访问它。标准还在小范围预览，我会继续跟，笔记写在「实验室自动化」。
        </p>
        <p>
          Agent 和生产系统记在 AI Agent 栏目：生命科学推理平台、从演示到上线的生产化手记，以及之后的观测与评测。数据侧做过 Flink、Spark 和数据湖，模型侧的检索、推理和微调记在「数据与模型」。企业内部的 LLM 和 Agent 平台用开源组件来搭。移液枪自动化调参是用 Vibe Coding 做完的一个完整项目，工具包括 bolt.new、Claude 和 Copilot。我对 AGI 有兴趣，也觉得它会到来。
        </p>
        
        <h3>生活爱好</h3>
        <p>
          工作之余，我是一个热爱运动的人，喜欢打篮球、游泳、骑车、撸铁等各种运动，这些运动不仅让我保持身体健康，也让我在紧张的开发工作中找到放松和平衡。
        </p>
        <p>
          我喜欢在 CSDN、掘金等平台分享技术博客，通过写作来整理思路、总结经验，也希望能够帮助到其他开发者。除了技术类书籍，我还喜欢阅读社会心理学相关的书籍，如《大问题》《乌合之众》等，这些阅读帮助我从不同角度理解世界和人性。
        </p>
        
        <h3>技术专长</h3>
        <p>
          在工作中，我能够独立完成前后端及数据相关的开发任务，技术栈较为全面：
        </p>
        <ul>
          <li><strong>编程语言与框架</strong> - .NET、Java、Python、前端 Vue/Element-UI</li>
          <li><strong>大数据技术</strong> - Flink、Spark、数据湖等技术栈</li>
          <li><strong>容器化与云平台</strong> - Docker、K8S，熟悉 AWS、腾讯云、阿里云</li>
          <li><strong>AI 编程实践</strong> - 熟练使用 bolt.new、Claude、GitHub Copilot 等 AI 工具进行快速原型开发和全栈应用构建</li>
          <li><strong>实验室设备接入</strong> - 用 MCP 把 Node-RED 设备服务接到 Dify；持续关注 Anthropic 的 Model Hardware Standard（MHS）</li>
          <li><strong>Node-RED</strong> - 熟练使用 Node-RED 进行可视化流程编排和物联网应用开发</li>
          <li><strong>AI Agent 开发</strong> - 有经验将 AI 模型与外部工具集成，构建实用的智能应用</li>
          <li><strong>企业级 AI 平台</strong> - LLM 系统构建、Agent 平台开发、大模型落地应用</li>
        </ul>
        <h3>项目经验</h3>
        <div class="project-list">
          <div class="project-item">
            <h4>移液枪自动化调参系统 (AI 编程实践)</h4>
            <p>
              使用 "Vibe Coding" 方式开发的完整项目，从草图到 V1.0 版本。结合 LLM+Agent 技术，实现移液枪的自动化参数调整。
              项目涵盖了前端界面（bolt.new 生成）、后端 API（Claude 生成）、Agent 规划执行、硬件对接等完整技术栈。
            </p>
            <div class="project-tags">
              <span class="tag">Vibe Coding</span>
              <span class="tag">bolt.new</span>
              <span class="tag">Claude</span>
              <span class="tag">Copilot</span>
              <span class="tag">React</span>
              <span class="tag">Node.js</span>
              <span class="tag">自动化</span>
            </div>
          </div>
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
          <div class="project-item">
            <h4>Dify openapi 转 MCP 插件</h4>
            <p>
              基于企业内部的需要，部分 API 需要转 MCP 的协议，在 Dify 上使用，开发了相关项目去解决此问题
            </p>
             <div class="project-tags">
              <span class="tag">Dify Plugin</span>
              <span class="tag">MCP</span>
              <span class="tag">OpenAPI</span>
            </div>
            <div class="project-links">
              <a href="https://github.com/xunberg/dify-plugin-openapi-to-mcp" target="_blank">
                <i class="fab fa-github"></i> GitHub
              </a>
            </div>
          </div>
        </div>
        <h3>写作目标</h3>
        <p>
          通过这个博客，我希望能够：
        </p>
        <ul>
          <li>记录实验设备怎样接到大模型，从现在的 MCP 到之后的 MHS</li>
          <li>记录 Agent 进入生产要补上的状态、等待、运行时和观测</li>
          <li>记录数据和模型工程里的选型、训练和故障</li>
          <li>把线上问题写成可以复用的笔记</li>
        </ul>
        
        <blockquote style="border-left: 4px solid var(--primary-color); padding-left: 1rem; margin: 2rem 0; font-style: italic; color: var(--text-secondary);">
          "LLM很强大，但并未解决根本问题。写代码的成本确实降低了，但团队一起理解代码的成本并没有降低。这才是真正的瓶颈。"
        </blockquote>
        
        <h3>联系我</h3>
        <p>
          如果您对我的文章有任何问题或建议，或者想要进行技术交流，欢迎通过以下方式联系我：
        </p>
        <p>
          如果博客内容对你有帮助，也欢迎前往
          <a href="{{ '/support/' | relative_url }}">支持作者</a>
          页面自愿打赏。
        </p>
        <div class="contact-links">
          <a href="https://github.com/xunberg" target="_blank" class="contact-link">
            <i class="fab fa-github"></i>
            <span>GitHub</span>
          </a>
          <a href="https://blog.csdn.net/zxlp520" target="_blank" class="contact-link">
            <i class="fas fa-blog"></i>
            <span>CSDN 博客</span>
          </a>
          <a href="https://juejin.cn/user/1239904848969895" target="_blank" class="contact-link">
            <i class="fas fa-gem"></i>
            <span>掘金</span>
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

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.project-tags .tag {
  background: var(--background);
  color: var(--text-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
  border: 1px solid var(--border);
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
