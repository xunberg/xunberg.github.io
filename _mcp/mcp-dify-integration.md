---
layout: post
title: "AI Agent 实战：将 Node-RED 创建的 MCP 设备服务接入 Dify"
date: 2024-12-25
category: "AI Agent"
tags: ["Dify", "Node-RED", "MCP", "集成"]
excerpt: "实战演示如何将通过 Node-RED 创建的 MCP 设备服务成功接入到 Dify 平台。"
permalink: /mcp/mcp-dify-integration/
---

# AI Agent 实战：将 Node-RED 创建的 MCP 设备服务接入 Dify

## 引言

在上一篇《Node-RED MCP 插件实践指南》中，我们成功地使用 Node-RED 构建并暴露了一个符合 MCP（Model Context Protocol）规范的边缘设备服务。这完成了"服务端"的搭建。

本文将承接上文，介绍如何将这个部署在边缘端的 MCP 服务集成到强大的 AI 应用开发平台（如 **Dify** 或其衍生版本 **MegaAgent**）中。通过这种方式，我们可以赋予 AI Agent 直接与物理世界交互的能力，最终实现通过自然语言控制硬件设备。

## 前提条件

在开始之前，请确保你已满足以下条件：
- 已根据上一篇文章，成功部署并运行了 Node-RED MCP 服务。
- 拥有一个可用的 Dify 或 MegaAgent 平台实例。
- 确保你的 Dify/MegaAgent 平台能够通过网络访问到 Node-RED 服务器的 IP 地址和端口。

## 集成步骤

### 第一步：在 Dify 中安装 MCP 插件

首先，我们需要在 Dify（或 MegaAgent）的插件市场中安装一个用于连接 MCP 服务的插件。这里我们推荐使用 **"MCP SSE / StreamableHTTP"** 插件，该插件维护活跃，并且支持流式响应，性能良好。

### 第二步：配置并注册 MCP 服务

安装插件后，进入插件配置页面。我们需要在这里告诉 Dify 我们的 MCP 服务在哪里以及如何访问它。配置信息以 JSON 格式提供：

```json
{
    "balance_service": {
        "transport": "streamable_http",
        "url": "http://{在此处替换为你的Node-RED服务器的IP地址}:8098/mcp"
    }
}
```

**配置说明：**

- `balance_service`: 这是你为该服务自定义的名称，可以根据实际设备进行修改（例如 `temperature_sensor_service`）。
- `transport`: 指定使用的传输协议，与插件名称对应。
- `url`: 这是你的 Node-RED MCP 服务的访问端点。
  - **重要提示**：请务必将 `{在此处替换为你的Node-RED服务器的IP地址}` 修改为 Node-RED 运行所在服务器的实际局域网或公网 IP 地址。端口 `8098` 应与你在 Node-RED 中配置的端口一致。

配置完成后，保存即可。

![Dify MCP Plugin Setting](/assets/images/mcp/mcp-dify-integration-setting.png)

### 第三步：在 Agent 中启用新工具

服务注册成功后，我们就可以在创建或编辑 Agent 时，将其作为可用工具添加进来了。

1. 在 Agent 的"工具"配置部分，点击"添加工具"。

![Dify MCP Agent Tools](/assets/images/mcp/mcp-dify-integration-agent-add-tools.png)

2. 从插件列表中，选择我们刚刚配置好的 "MCP SSE / StreamableHTTP" 插件。Dify 会自动发现并通过该插件获取到你在 Node-RED 中注册的工具（例如 `get_weight_tool`）。

![Dify MCP Agent Chat](/assets/images/mcp/mcp-dify-integration-agent-agent-chat.png)

## 总结与展望

至此，我们已经成功打通了从 **AI Agent** 到 **边缘端 Node-RED**，再到 **物理设备** 的完整控制链路。

这意味着，现在你可以通过自然语言与 Agent 对话，来查询和控制连接在 Node-RED 上的设备了。例如，你可以直接在对话框中输入：

> "请获取一下天平的当前重量"

Agent 将会理解你的意图，调用它刚刚获得的 `get_weight_tool` 工具，通过 MCP 协议向 Node-RED 发送请求，Node-RED 执行相应的流程（如向串口发送指令），最后将设备返回的数据格式化后回复给 Agent。

这为实现复杂的、自动化的物理世界交互场景打开了大门，无论是智能实验室、工业自动化控制，还是个性化的智能家居，都可以在此基础上进行构建。