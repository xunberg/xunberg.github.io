---
layout: post
title: "Node-RED MCP 插件实践指南：从安装到常见问题解析"
date: 2024-12-28
category: "实战指南"
tags: ["Node-RED", "MCP", "插件", "实践"]
excerpt: "详细介绍 Node-RED MCP 插件的安装、配置和使用，包含常见问题的解决方案。"
permalink: /mcp/node-red-mcp-guide/
---

# Node-RED MCP 插件实践指南：从安装到常见问题解析

## 引言

在物联网（IoT）和大型语言模型（LLM）的融合浪潮中，模型上下文协议（Model Context Protocol, MCP）作为连接 AI 模型与外部工具（Tools）的桥梁，正变得越来越重要。Node-RED 以其强大的可视化流程编排能力，在 IoT 领域备受欢迎。将两者结合，可以极大地简化和加速 AI Agent 应用的开发。

本文将详细介绍一个增强版的 `node-red-contrib-mcp-server` 插件。该插件基于 [DanEdens/node-red-contrib-mcp-server](https://github.com/DanEdens/node-red-contrib-mcp-server) 进行二次开发，修复了原版的一些问题，并**完整实现了 MCP 核心协议**，特别解决了与 Dify、Claude 等平台集成时的关键痛点。

*   **项目地址**: [https://github.com/xunberg/node-red-contrib-mcp-server](https://github.com/xunberg/node-red-contrib-mcp-server)
*   **NPM 官方页面**: [https://flows.nodered.org/node/node-red-contrib-mcp-server](https://flows.nodered.org/node/node-red-contrib-mcp-server)

## 插件安装

你可以通过本地安装 `.tgz` 包的方式来使用最新版本。

> **注意**：最新的插件包 `.tgz` 文件可以在项目发布页或通过其他指定渠道获取。以下命令假设你已下载了 `node-red-contrib-mcp-server-1.1.5.tgz` 文件。

```shell
# 1. 进入你的 Node-RED 用户目录
cd ~/.node-red

# 2. 安装插件包
#    请确保 tgz 文件的路径正确
npm install /path/to/your/node-red-contrib-mcp-server-1.1.5.tgz
```
安装完成后，重启 Node-RED 即可在节点面板中找到 MCP 相关的节点。

## 关键注意事项 (避坑指南)

在实践中，我们总结了三个最容易出错的关键点，提前了解它们可以帮你节省大量调试时间。

### 1. `function` 节点中 `msg` 对象的处理

一个核心要点是：在 `mcp-flow-server` 节点的 `router` 分支后的 `function` 节点中，**应避免直接修改或覆盖传入的 `msg` 对象**。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/ZWGl05mEJXgdZn34/img/aa6359bb-7348-4c3e-93b6-dc3c63efd8eb.png)

**原因分析**：
插件内部需要通过 `msg.payload.executionId` 来追踪和匹配工具的请求与响应。如果你在 `function` 节点中直接 `msg = { payload: 'new data' }`，会丢失原始的 `executionId` 等重要信息，导致后续的响应无法被正确识别，流程中断。

插件内部的响应处理逻辑如下，它强依赖于 `executionId` 的匹配：
```javascript
const responseHandler = (msg) => {
    // ...
    if (msg.topic === 'mcp-tool-response' &&
        msg.payload.executionId === executionMsg.payload.executionId) {
        // ... 只有 executionId 匹配，才会继续处理
        resolve(msg.payload.result);
    }
};
```

**正确做法**：
只修改 `msg.payload`，并保留其他 `msg` 上的属性，或者返回一个**包含原始 `executionId` 的新对象**。

```javascript
// 错误示例: 这会覆盖整个 msg 对象
// msg.payload = command + terminator;
// return msg;

// 正确示例: 返回一个新对象，同时传递 executionId
const command = "SI";
const terminator = "\r\n";
return {
    payload: command + terminator,
    executionId: msg.payload.executionId // 关键：手动传递 executionId
};
```

### 2. 严格遵循 MCP Tools Response 规范

另一个常见的陷阱是，在流程的最后构建返回给客户端的 `MCP Response` 时，未能严格遵守 MCP 的 `Tools response` 规范。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/ZWGl05mEJXgdZn34/img/a328273f-1822-437d-abb0-66f9ef4f1972.png)

**后果**：
即使你的 Node-RED 流程运行正常，但如果响应格式不正确，MCP 客户端（如 Dify、Claude Desktop）也无法解析，最终导致调用失败。

**正确格式**：
请务必参考 MCP 官方文档中关于 [Tool Result](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) 的定义。一个标准的响应 `msg` 应该类似这样：

```javascript
// 假设 data 是你要返回的业务数据对象
let data = {
    'success': true,
    'weight': 100.5,
    'unit': 'g'
};

// 1. 将业务数据转换为 MCP content 格式
let final_result = {
    type: "text",
    text: JSON.stringify(data) // text 字段必须是字符串
};

// 2. 构建完整的 mcp-tool-response
return {
    topic: 'mcp-tool-response',
    payload: {
        executionId: msg.executionId, // 确保 executionId 被正确传递
        result: {
            content: [final_result]  // content 是一个数组
        }
    }
};
```

### 3. 完整实现 `notifications/initialized` 事件

此插件的增强版特别实现了 `notifications/initialized` 事件处理。这是一个至关重要的步骤，尤其是在与正式的 MCP 客户端（如 Dify、Claude）集成时。

**问题描述**：
如果缺少对 `initialized` 通知事件的处理，你可能会发现工具在 MCP 官方的 **Inspector** 开发工具中可以调试成功，但一旦部署到 Dify 等生产平台，就会持续调用失败。

**原因分析**：
根据 [MCP 生命周期规范](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle)，在客户端完成工具列表的初始化后，会向服务端发送一个 `notifications/initialized` 通知。服务端收到此通知后，整个 MCP 会话才被认为是完全建立的。可以将其理解为一种**“握手”机制**，确认双方都已准备就绪。如果服务端不响应或不处理此事件，客户端可能会认为连接尚未成功建立，从而拒绝后续的工具调用。

![MCP Lifecycle Diagram](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/ZWGl05mEJXgdZn34/img/2175516a-4f2d-4a6f-b440-d277cf3af62e.png)

![Initialized Notification Detail](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/ZWGl05mEJXgdZn34/img/42cef1f4-61fe-411e-8a61-848321db127d.png)

此增强版插件已在内部处理了该逻辑，你无需额外配置，这确保了与主流平台的兼容性。

## 示例流程参考

以下提供一个完整的 Node-RED 流程示例，用于演示如何通过 MCP 调用一个模拟的电子天平设备来获取重量。你可以直接复制下方的 JSON 代码，并通过 Node-RED 的 **导入** 功能使用。

**流程概览**:
![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/ZWGl05mEJXgdZn34/img/09052c60-4eaf-43e2-a4ff-3d9519401e0f.png)

**流程 JSON**:
```json
[
    {
        "id": "80b5156c46267c5f",
        "type": "tab",
        "label": "balance_mcp_demo",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "7eb1cb484e18fc02",
        "type": "mcp-flow-server",
        "z": "80b5156c46267c5f",
        "name": "balance_mcp_server",
        "serverName": "node-red-mcp-server",
        "serverPort": "8098",
        "autoStart": true,
        "enableCors": true,
        "x": 140,
        "y": 260,
        "wires": [
            [
                "81c4a70952a36fad"
            ]
        ]
    },
    {
        "id": "81c4a70952a36fad",
        "type": "switch",
        "z": "80b5156c46267c5f",
        "name": "router",
        "property": "payload.toolName",
        "propertyType": "msg",
        "rules": [
            {
                "t": "eq",
                "v": "get_weight_tool",
                "vt": "str"
            }
        ],
        "checkall": "true",
        "repair": false,
        "outputs": 1,
        "x": 270,
        "y": 360,
        "wires": [
            [
                "b38089ccf7b3ddd5"
            ]
        ]
    },
    {
        "id": "b38089ccf7b3ddd5",
        "type": "function",
        "z": "80b5156c46267c5f",
        "name": "构建报文",
        "func": "// 在这里设置你要发送的指令\n// ！！！请根据你的设备手册修改此处的指令 ！！！\nconst command = \"SI\"; // 假设指令是 SIR\nconst terminator = \"\r\n\"; // 假设结束符是 回车+换行\n\n// 将指令设置到 msg.payload 中，同时传递 executionId\n// 这是关键点1的正确实践\nreturn {\n    payload: command + terminator,\n    executionId: msg.payload.executionId\n};",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 460,
        "y": 260,
        "wires": [
            [
                "151d7cd3604d126e",
                "e4b1c6c50b0cd82d"
            ]
        ]
    },
    {
        "id": "151d7cd3604d126e",
        "type": "serial request",
        "z": "80b5156c46267c5f",
        "d": true,
        "name": "天平设备(真实)",
        "serial": "bec6f76384cb6abf",
        "x": 720,
        "y": 260,
        "wires": [
            [
                "d2b4ee66cd8ae1a2"
            ]
        ]
    },
    {
        "id": "d2b4ee66cd8ae1a2",
        "type": "function",
        "z": "80b5156c46267c5f",
        "name": "通用解析函数 ",
        "func": "let rawData = msg.payload;\n\nif (typeof rawData !== 'string') {\n    rawData = String(rawData);\n}\n\nlet parts = rawData.trim().split(/\\s+/);\n\nlet data = {\n    'success': false,\n    'weight': 0,\n    'message': '',\n    \"rawData\": rawData\n}\n\n// 尝试从 "S S 100.00 g" 这样的格式中解析重量\nif (parts.length >= 2) {\n    let weight = parseFloat(parts[parts.length - 2]);\n    if (!isNaN(weight)) {\n        data.weight = weight;\n        data.success = true;\n        data.message = 'Data parsed successfully.';\n    }\n}\n\nif (!data.success) {\n    const errorMsg = \"无法解析数据: \" + rawData;\n    node.warn(errorMsg);\n    data.message = errorMsg;\n}\n\n// 将解析结果放到 payload 中，以便下一个节点处理\nmsg.payload = data;\nreturn msg;",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 920,
        "y": 320,
        "wires": [
            [
                "f17847e75b84da19"
            ]
        ]
    },
    {
        "id": "f17847e75b84da19",
        "type": "function",
        "z": "80b5156c46267c5f",
        "name": "构建 MCP Response",
        "func": "// 这是关键点2的正确实践\n\n// 1. 将解析后的数据对象，转换为 MCP content 格式\nconst final_result = {\n    type: \"text\",\n    text: JSON.stringify(msg.payload)\n};\n\n// 2. 构建符合 MCP 规范的完整响应\nreturn {\n    topic: 'mcp-tool-response',\n    payload: {\n        executionId: msg.executionId,\n        result: {\n            content: [final_result] \n        }\n    }\n};",
        "outputs": 1,
        "timeout": "",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 420,
        "y": 80,
        "wires": [
            [
                "7eb1cb484e18fc02"
            ]
        ]
    },
    {
        "id": "7c9566851a3ef722",
        "type": "mcp-tool-registry",
        "z": "80b5156c46267c5f",
        "name": "register_get_weight_tool",
        "toolName": "get_weight_tool",
        "toolDescription": "Obtain the weighing results of the balance equipment. (获取天平设备的称重结果)",
        "toolSchema": "{\n  \"type\": \"object\",\n  \"properties\": {\n    \"device_name\": {\n      \"type\": \"string\",\n      \"description\": \"the name of balance device\"\n    }\n  },\n  \"required\": []\n}",
        "autoRegister": true,
        "x": 210,
        "y": 560,
        "wires": [
            []
        ]
    },
    {
        "id": "e4b1c6c50b0cd82d",
        "type": "function",
        "z": "80b5156c46267c5f",
        "name": "模拟设备返回",
        "func": "// 这个节点用于测试，模拟串口设备返回的数据\nmsg.payload= \"S S 100.00 g\"\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 710,
        "y": 380,
        "wires": [
            [
                "d2b4ee66cd8ae1a2"
            ]
        ]
    },
    {
        "id": "bec6f76384cb6abf",
        "type": "serial-port",
        "name": "天平",
        "serialport": "/dev/tty.usbserial-14140",
        "serialbaud": "9600",
        "databits": 8,
        "parity": "none",
        "stopbits": 1,
        "waitfor": "",
        "dtr": "none",
        "rts": "none",
        "cts": "none",
        "dsr": "none",
        "newline": "1000",
        "bin": "false",
        "out": "time",
        "addchar": "",
        "responsetimeout": 10000
    }
]
```

## 总结

通过本文的介绍，相信您已经对如何使用这个增强版的 Node-RED MCP 插件有了清晰的认识。总结一下核心要点：
1.  **谨慎处理 `msg` 对象**，确保 `executionId` 在流程中正确传递。
2.  **严格遵循 MCP 响应规范**，保证客户端能正确解析结果。
3.  **理解 `initialized` 事件的重要性**，它是确保与生产级平台稳定连接的关键。

希望这份指南能帮助你顺利地在 Node-RED 上构建强大的 MCP 工具服务。如果你在使用过程中遇到任何问题，或有改进建议，欢迎在 [GitHub 项目](https://github.com/xunberg/node-red-contrib-mcp-server)中提交 Issue 或 Pull Request。