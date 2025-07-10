---
layout: post
title: "深度解析 MCP SSE+HTTP 传输协议：从理论到实践"
date: 2025-04-28
category: "技术深度"
tags: ["MCP", "SSE", "HTTP", "协议", "深度解析"]
excerpt: "深入分析 MCP 的 SSE+HTTP 传输协议运行机制，从开发 Dify OpenAPI 转 MCP SSE 插件的角度详解实现过程。"
permalink: /mcp/mcp-sse-deep-dive/
---

# 深度解析 MCP SSE+HTTP 传输协议：从理论到实践

## MCP 协议概述

这个问题不想阐述了，看官网说明最好~ [MCP 官方介绍](https://modelcontextprotocol.io/introduction)

MCP 目前主要有2种传输协议：

*   **Stdio** - 标准输入输出协议
*   **SSE+HTTP/Streamable HTTP** - 服务器发送事件协议
    

##  深入理解 SSE+HTTP 协议

本篇文章主要讲述的是 **SSE+HTTP** 的传输协议。

具体 SSE+HTTP 是怎么运行的，怎么去开发一个这样的服务，会从开发一个 Dify OpenAPI 转 MCP SSE 插件的角度去分析下怎么去开发。

### 什么是 SSE？

SSE 的全称是 **Server-Sent Events**，这个协议主要是解决浏览器往客户端消息推送的，就像流式处理一样。了解 OpenAI SDK 使用的人知道，我们如果开启 `stream = true`，正常我们就是采用的这种方式。

其实看了很多网上的文章，说 MCP，但是没有讲清楚 MCP 中 SSE 的模式究竟是怎么运行的。

![MCP SSE+HTTP 流程图](/assets/images/mcp/d87a1f42c5b2733ef70bdfed5dbb1e2d.png)

![MCP SSE+HTTP 流程图](/assets/images/mcp/d87a1f42c5b2733ef70bdfed5dbb1e2d.png)

### SSE+HTTP 工作流程解析

从上面的流程图中可以看到，SSE+HTTP 的工作机制非常有趣：

1. **建立 SSE 长连接**：客户端首先发起 GET 请求建立 SSE 长连接（图中虚线表示流式请求）
2. **异步请求处理**：客户端通过 POST 请求发送具体的业务请求
3. **快速响应确认**：服务端立即返回 202 Accept 状态码，表示请求已接收
4. **流式结果推送**：真正的处理结果通过 SSE 长连接异步推送给客户端

### 设计优势分析

这种传输协议设计非常巧妙，本质上是一种**异步编程模式**：

- **解决响应延迟问题**：当服务端处理消息比较慢时（想象一下使用 GPT Chat 的场景），如果不采用流式处理，页面可能要等很久才有响应
- **契合 LLM 特性**：现代 LLM 都采用 token 流式输出，SSE+HTTP 模式天然适配这种场景
- **用户体验优化**：客户端可以实时看到处理进度，而不是长时间的等待

### 技术挑战与限制

当然，SSE+HTTP 模式也有一些限制：

1. **服务端复杂度高**：需要维护长连接状态，对服务架构要求较高
2. **扩展性问题**：分布式部署或水平扩展时，连接状态管理成为挑战
3. **单向通信限制**：SSE 只能服务器主动推送，客户端无法通过 SSE 主动交互
4. **故障感知困难**：当服务器不可用时，客户端难以及时感知，且无法进行状态恢复

### 协议演进

关于 MCP 传输协议的最新发展，可以参考官方的 [Streamable HTTP 提案](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/206)。2024年3月24日，社区已经提交了 Streamable HTTP 的合并请求，具体的改进细节值得关注。

## 实战：开发 MCP SSE 服务

下面通过实际代码来演示如何实现一个 MCP SSE 服务。以下是我在开发 Dify 插件中的核心代码：

### SSE 端点实现

```python
def create_sse_message(event, data):
    return f"event: {event}\ndata: {json.dumps(data) if isinstance(data, (dict, list)) else data}\n\n"

class SSEEndpoint(Endpoint):
    def _invoke(self, r: Request, values: Mapping, settings: Mapping) -> Response:
        """
        Invokes the endpoint with the given request.
        """
        session_id = str(uuid.uuid4()).replace("-", "")

        def generate():
            endpoint = f"messages/?session_id={session_id}"
            yield create_sse_message("endpoint", endpoint)

            while True:
                message = None
                try:
                    message = self.session.storage.get(session_id)
                except:
                    pass
                if message is None:
                    time.sleep(0.5)
                    continue
                message = message.decode()
                self.session.storage.delete(session_id)
                yield create_sse_message("message", message)

        return Response(generate(), status=200, content_type="text/event-stream")

```

### 核心实现逻辑

上面这段代码实现了 SSE 端点的核心功能：

1. **生成会话ID**：为每个连接创建唯一的会话标识
2. **建立 SSE 连接**：返回 `text/event-stream` 内容类型，告诉客户端这是一个长连接
3. **发送端点地址**：首先推送一个包含会话ID的消息地址给客户端
4. **消息轮询机制**：持续检查是否有新消息需要推送

### 连接建立过程

![SSE 长连接建立](/assets/images/mcp/ee47e2284f93c5897fa4be5b89c1ab57.png)

当客户端首次访问 `endpoint/sse` 地址时，服务器：
1. 返回 `text/event-stream` 响应类型
2. 推送包含 `session_id` 的消息地址
3. 客户端基于此地址进行后续的初始化请求

### 初始化请求处理

客户端接收到服务器端的第一个消息后，会使用新地址进行初始化：

![初始化请求](/assets/images/mcp/d9fabf618ab9d148178711785a5c1d35.png)

客户端采用 POST 请求访问 `endpoint/messages` 地址，方法是 `initialize`：

### Initialize 方法实现

```python
def _handle_initialize(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        处理 initialize 请求。

        Args:
            data (Dict[str, Any]): The request data.

        Returns:
            Dict[str, Any]: The response data.
        """
        return {
            "jsonrpc": "2.0",
            "id": data.get("id"),
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "experimental": {},
                    "prompts": {"listChanged": False},
                    "resources": {"subscribe": False, "listChanged": False},
                    "tools": {"listChanged": False},
                },
                "serverInfo": {"name": "Dify", "version": "1.3.0"},
            },
        }
```

### 响应流程

![SSE 响应返回](/assets/images/mcp/80cbca0f10f575bb40eca8e125edc172.png)

如前所述，服务端处理 `initialize` 请求的返回结果是通过 SSE 长连接返回的，而不是直接的 HTTP 响应。

后续的 `tools/list` 等请求也遵循同样的模式：
1. 客户端发送 POST 请求
2. 服务端返回 202 Accept
3. 真正的结果通过 SSE 连接推送

### 支持的方法列表

具体要支持多少方法，可以参考官方规范：

![MCP 支持方法列表](/assets/images/mcp/330c0c60411a183a644603a0a8386004.png)

根据 MCP 规范，服务端需要实现的核心方法包括：
- `initialize` - 初始化连接
- `tools/list` - 获取工具列表  
- `tools/call` - 调用具体工具
- `resources/list` - 获取资源列表
- `prompts/list` - 获取提示列表

## 项目开源

**完整的 Dify 插件代码（OpenAPI 转 MCP SSE）已开源：**
[https://github.com/xunberg/dify-plugin-openapi-to-mcp](https://github.com/xunberg/dify-plugin-openapi-to-mcp)

## 下一步计划

下个版本将支持 **Streamable+HTTP** 协议，这将进一步优化 MCP 的传输效率和可靠性。
