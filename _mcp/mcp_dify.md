---
layout: post
title: "Dify 本地工具与 MCP 集成完整指南"
date: 2025-04-10
category: "集成指南"
tags: ["Dify", "MCP", "本地工具", "FastAPI", "SSE"]
excerpt: "详细介绍两种方式将本地工具集成到 Dify 平台：OpenAPI 模式和 MCP SSE 模式，包含完整代码示例和配置步骤。"
permalink: /mcp/dify-local-tools-integration/
---

# Dify 本地工具与 MCP 集成完整指南


## 方式一：本地 API 注册模式

### OpenAPI 规范实现

本地构建 RESTful API，满足 OpenAPI 的 Schema 文件要求。

具体协议可以参考：[OpenAPI 规范文档](https://swagger.io/specification/)

### 本地实现

```python
from fastapi import FastAPI
import uvicorn
import socket
#需要实现
from weather_service import WeatherService 

host = socket.gethostbyname(socket.gethostname())

# 指定 servers 参数
servers = [
    {
        "url": f"http://{host}:8000",
        "description": "本地开发服务器"
    }
]

app = FastAPI(servers=servers)
weather_service = WeatherService()

@app.get("/weather/{city}", summary="获取城市当前天气", description="根据城市名称获取当前天气信息", operation_id="custom_get_weather")
def get_weather(city: str):
    """
    获取指定城市的当前天气信息。

    - **city**: 城市名称
    """
    return weather_service.get_city_weather(city)

@app.get("/air-quality/{city}", summary="获取城市当前空气质量", description="根据城市名称获取当前空气质量信息", operation_id="custom_get_air_quality")
def get_air_quality(city: str):
    """
    获取指定城市的当前空气质量信息。

    - **city**: 城市名称
    """
    return weather_service.get_current_air_quality(city)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

```

**备注：FastAPI 会自动生成文档**

生成的文档地址：

*   Swagger 文档：[http://localhost:8000/docs#/](http://localhost:8000/docs#/)
*   OpenAPI 文件：[http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)
    

### 平台中配置

**记得地址要改成本机IP**

![Dify 平台配置本地 API](/assets/images/mcp/81f9583bf5cd4e37b7154f87475ac5dc.png)

从文字可以看到，目前的本地的工具 已经可以被配置到了平台中，后续再平台的工作流，agent 中均可以使用

### 平台中使用

![工具调用界面](/assets/images/mcp/015fa9e475ec9dd1e50ecaf24c752abe.png)

在聊天中我们可以看到，调用工具的具体信息：

![工具调用详情 1](/assets/images/mcp/e09bec9cfee1dad8fd7b7733aa45b6b6.png)

![工具调用详情 2](/assets/images/mcp/0c320a103a32444355c717116fcea949.png)

## 方式二：MCP SSE 模式

### MCP 协议概述

官方的架构图：

![MCP 官方架构图](/assets/images/mcp/5f2e019247c227a430f16cd28b0f2ce6.png)

目前 MCP 官方支持2种传输实现：

#### 1. Standard Input/Output (stdio) 标准输入输出

**适用场景：**
*   构建命令行工具
*   实现本地集成
*   需要简单进程通信
*   使用 shell 脚本

> **注意**：此方式主要用于本地资源集成和命令行工具，从我们目前本地操作 API 集成平台的目的分析，此方式不适用。

#### 2. Server-Sent Events (SSE) 服务器发送事件

SSE 传输通过 HTTP POST 请求实现服务器到客户端的流式通信。

**适用场景：**
*   只需要 server-to-client 的流式通信
*   在受限网络中工作
*   实现简单更新

> **技术考量**：此方式会对服务器有一定压力，主要是长连接需求。客户端和服务器需要保持持续的会话，这样服务器可以随时推送消息。但对大规模分布式部署可能不太友好。MCP 社区已经在做改进，预计后期会采用可流式 HTTP 传输，让服务器和客户端可以在需要时重连并恢复会话，既能做到状态追踪，也更便于横向扩容或处理断线情况。

### 本地 MCP 服务代码实现

使用 FastMCP 框架快速构建 MCP 服务：

```python
from mcp.server.fastmcp import FastMCP
from weather_service import WeatherService

mcp = FastMCP("weather_sse", port=8002, host="0.0.0.0")
weather_service = WeatherService()

@mcp.tool()
async def get_weather(city: str) -> str:
    """
     获取指定城市的当前天气信息。
    参数：
        - **city**: 城市名称
    返回：
        str: 天气信息。
    """
    return weather_service.get_city_weather(city)

@mcp.tool()
async def get_air_quality(city: str):
    """
    获取指定城市的当前空气质量信息。

    - **city**: 城市名称
    """
    return weather_service.get_current_air_quality(city)

if __name__ == "__main__":
    mcp.run(transport="sse")

```

> **参考文档**：具体的 MCP 安装流程和开发指南，可以参考官方的 quickstart - service 模块的开发文档。

### 平台的配置

![Dify 应用市场 MCP SSE 插件](/assets/images/mcp/e73049e1352f4100bc02f61584d74878.png)

在平台的应用市场中，找到 MCP SSE 的插件并安装：

![MCP SSE 插件安装](/assets/images/mcp/d0e8bdbe131a36eef2e0265e1281e3f8.png)

安装后在工作流中，选择此工具进行配置，配置格式如下：

```json
{
    "server_name": {
        "url": "http://{本地IP}:8002/sse",
        "headers": {},
        "timeout": 60,
        "sse_read_timeout": 3000
    }
}
```

### 平台的使用

![MCP SSE 使用效果 1](/assets/images/mcp/7349cefc427e770681a0e16568615391.png)

![MCP SSE 使用效果 2](/assets/images/mcp/861f70c944ceb88bd76d92c6dd801aff.png)

![MCP SSE 使用效果 3](/assets/images/mcp/c6ff06e40e53eacdd8afe7da6e40c175.png)

## 方法对比与选择建议

### OpenAPI 模式 vs MCP SSE 模式

| 特性 | OpenAPI 模式 | MCP SSE 模式 |
|------|-------------|-------------|
| **实现复杂度** | 简单，标准 REST API | 中等，需要理解 MCP 协议 |
| **性能** | 标准 HTTP 请求响应 | 支持流式处理，响应更快 |
| **扩展性** | 水平扩展友好 | 长连接限制，扩展需考虑状态管理 |
| **标准化** | OpenAPI 规范成熟 | MCP 协议较新，生态在发展 |
| **适用场景** | 传统 API 集成 | 实时交互，流式处理 |

### 推荐使用场景

**选择 OpenAPI 模式：**
- 已有成熟的 REST API 服务
- 需要稳定的生产环境部署
- 团队对 REST API 更熟悉

**选择 MCP SSE 模式：**
- 需要实时交互和流式处理
- 希望体验最新的 MCP 协议
- 对新技术有探索需求

## 总结

通过本文的介绍，你已经掌握了两种将本地工具集成到 Dify 平台的完整方法。无论选择哪种方式，都能够有效地扩展 Dify 的功能，实现更加灵活和强大的 AI 应用构建。

建议根据实际项目需求和团队技术栈来选择合适的集成方式。