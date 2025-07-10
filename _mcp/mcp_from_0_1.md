---
layout: post
title: "MCP Server From 0 to 1"
date: 2024-12-30
category: "MCP 教程"
tags: ["Python", "FastAPI", "MCP", "Server"]
excerpt: "从零开始构建 MCP Server，详细介绍 Model Context Protocol 的实现原理和实践方法。"
permalink: /mcp/mcp_from_0_1/
---

# MCP Server From 0 to 1

```python
import asyncio
import uuid
import uvicorn
import json
import inspect
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from fastapi import FastAPI, Request, Response, HTTPException
from sse_starlette.sse import EventSourceResponse


# 定义一个请求模型
# {
#   jsonrpc: "2.0",
#   id: number | string,
#   method: string,
#   params?: object
# }
class MCPRequest(BaseModel):
    id: Optional[int | str] = None
    jsonrpc: str = "2.0"
    method: str
    params: Optional[dict] = None


# 定义一个响应模型
# {
#   jsonrpc: "2.0",
#   id: number | string,
#   result?: object,
#   error?: {
#     code: number,
#     message: string,
#     data?: unknown
#   }
# }
class MCPResponse(BaseModel):
    id: Optional[int | str] = None
    jsonrpc: str = "2.0"
    result: Optional[dict] = None
    error: Optional[Dict[str, Any]] = None


app = FastAPI()

# 存储活跃的MCP服务器实例
mcp_server_list: Dict[str, "MCPServer"] = {}

def get_current_weather(location: str):
    """获取当前天气信息
    Args:
        location (str): 城市，例如：苏州，上海
    Returns:
        dict: 包含天气信息的字典
    """
    return {
        "location": location,
        "temperature": "20°C",
        "forecast": "Sunny",
    }


class MCPServer:
    def __init__(self, tools, server_name="xunberg", server_version="0.0.1"):
        self.event_queue = asyncio.Queue()  # 用于存储事件消息
        self.client_id = str(uuid.uuid4())
        self.server_info = {
            "protocolVersion": "2024-11-05",
            "capabilities": {
                "experimental": {},
                "prompts": {"listChanged": False},
                "resources": {"subscribe": False, "listChanged": False},
                "tools": {"listChanged": False},
            },
            "serverInfo": {"name": server_name, "version": server_version},
        }
        self.tools = tools
        mcp_server_list[self.client_id] = self

    async def event_message_reader(self):
        """事件消息读取器，用于SSE连接"""
        try:
            while True:
                event_message = await self.event_queue.get()
                print(f"event_message: {event_message}")
                yield event_message
                self.event_queue.task_done()
        except asyncio.CancelledError:
            print(f"Client {self.client_id} disconnected")
            # 清理资源
            if self.client_id in mcp_server_list:
                del mcp_server_list[self.client_id]

    async def handle_message(self, request: MCPRequest):
        """处理接收到的MCP请求"""
        method = request.method
        handlers = {
            "initialize": self._handle_initialize,
            "notifications/initialized": lambda req: MCPResponse(
                id=req.id, result={}
            ),  # 处理初始化完成通知
            "tools/list": self._handle_tools_list,
            "tools/call": self._handle_tools_call,
            "resources/list": self._handle_resources_list,
            "prompts/list": self._handle_prompts_list,
        }

        handler = handlers.get(method)
        if handler:
            mcpResponse = handler(request)
            response = mcpResponse.model_dump_json(exclude_none=True)
            await self.event_queue.put({"event": "message", "data": response})
        else:
            # 处理未知方法
            error_response = MCPResponse(
                id=request.id,
                error={"code": -32601, "message": f"Method '{method}' not found"},
            ).model_dump_json(exclude_none=True)
            await self.event_queue.put({"event": "message", "data": error_response})

    def _handle_initialize(self, request: MCPRequest) -> MCPResponse:
        """处理初始化请求"""
        return MCPResponse(id=request.id, result=self.server_info)

    def _handle_tools_list(self, request: MCPRequest) -> MCPResponse:
        """处理工具列表请求"""
        mcp_tools = []
        for tool in self.tools:
            mcp_tools.append(
                {
                    "name": tool.__name__,
                    "description": tool.__doc__,
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            param.name: {
                                "type": "string",
                                "description": param.annotation.__doc__,
                            }
                            for param in inspect.signature(tool).parameters.values()
                        },
                    },
                }
            )
        return MCPResponse(id=request.id, result={"tools": mcp_tools})

    def _handle_tools_call(self, request: MCPRequest) -> MCPResponse:
        """处理工具调用请求"""
        tool_name = request.params.get("name")
        arguments = request.params.get("arguments", {})
        final_result = {
            "type": "text",
        }
        try:
            for tool in self.tools:
                if tool.__name__ == tool_name:
                    tool_result = tool(**arguments)
                    final_result["text"] = str(tool_result)
                    return MCPResponse(
                        id=request.id, result={"content": [final_result]}
                    )
        except Exception as e:
            final_result["text"] = str(f"Error executing tool {tool_name}: {str(e)}")
            return MCPResponse(
                id=request.id, result={"content": [final_result], "isError": True}
            )

    def _handle_resources_list(self, request: MCPRequest) -> MCPResponse:
        """处理资源列表请求"""
        return MCPResponse(id=request.id, result={"resources": []})

    def _handle_prompts_list(self, request: MCPRequest) -> MCPResponse:
        """处理提示列表请求"""
        return MCPResponse(id=request.id, result={"prompts": []})


@app.get("/sse")
async def sse():
    """SSE连接端点"""
    mcp_server = MCPServer(tools=[get_current_weather])
    await mcp_server.event_queue.put(
        {"event": "endpoint", "data": f"/message?client_id={mcp_server.client_id}"}
    )
    return EventSourceResponse(
        mcp_server.event_message_reader(), ping=60  # 增加ping参数保持连接活跃
    )


@app.post("/message")
async def message(request: Request, mcpRequest: MCPRequest):
    """MCP消息处理端点"""
    print(f"Received request: {request} mcpRequest: {mcpRequest.model_dump_json()}")
    client_id = request.query_params.get("client_id")
    if client_id is None or client_id not in mcp_server_list:
        return MCPResponse(
            id=mcpRequest.id,
            jsonrpc="2.0",
            error={"code": -32600, "message": "Client ID not found or invalid"},
        ).model_dump_json(exclude_none=True)

    try:
        await mcp_server_list[client_id].handle_message(mcpRequest)
        return Response(status_code=202)
    except Exception as e:
        print(f"Error handling message: {e}")
        return MCPResponse(
            id=mcpRequest.id,
            jsonrpc="2.0",
            error={"code": -32600, "message": f"Internal error: {str(e)}"},
        ).model_dump_json(exclude_none=True)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8009)

```