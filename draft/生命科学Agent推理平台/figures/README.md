# 图表清单

三篇文章正文内嵌 Mermaid 源码（GitHub / 掘金 / 知乎等可直接渲染）。本目录是同名 **SVG + PNG** 导出，供不支持 Mermaid 的渠道（如公众号、Word、部分 CMS）使用。

PNG 为 2 倍分辨率（Retina），可直接贴图；SVG 为矢量，可无损缩放或改色。

| 文件 | 所属文章 | 内容 |
|---|---|---|
| `p1-01-reject-chain` | 01 背景与架构 | 五个负载特征 → 各自否决的通用方案（否决链） |
| `p1-02-quadrant` | 01 | 调度范式定位图：任务时长 vs 时延敏感度 |
| `p1-03-architecture` | 01 | 五层主链路架构（受理 / 缓冲 / 弹性 / 资源 / 回传） |
| `p1-04-lifecycle` | 01 | 一次请求的生命周期时序（含冷启动高亮区） |
| `p2-01-gpu-split-decision` | 02 选型与取舍 | GPU 切分方式选择决策树 |
| `p2-02-isolation-compare` | 02 | 时间片共享 vs 配额共享的故障影响对比 |
| `p2-03-cost-crossover` | 02 | 缩到零 vs 常驻的日消耗交叉曲线（约 86 次/天） |
| `p2-04-scalein-protection` | 02 | 长任务四重防护（逐层拦截缩容） |
| `p3-01-result-channels` | 03 Agent 协同 | 轮询 / 回调 / 流式进度三种回传通道 |
| `p3-02-agent-decision-loop` | 03 | Agent 拿到算力状态后的四选一决策环路 |
| `p3-03-backpressure-state` | 03 | 背压与熔断的状态机 |
| `p3-04-observability-stack` | 03 | 可观测性四层指标栈 |

## 重新生成

正文 Mermaid 改动后，可把代码块贴到 https://mermaid.live 导出 SVG/PNG；如需批量重导出，本目录的 `.svg` 文件可直接作为源（用 Inkscape / Chrome 打开另存即可）。

## 配色

主色 `#2f6f9f`（蓝）、强调 `#d2543f`（红）、文字 `#16222e`、辅助 `#64748b`。与正文中的表格配色一致，改动时建议沿用。
