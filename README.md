# Xunberg's Tech Blog

一个专注于 MCP (Model Context Protocol) 和 AI Agent 技术分享的 Jekyll 博客网站。

## 功能特点

- 🎨 现代化响应式设计
- 📱 移动端优化
- 🚀 快速加载
- 🔍 SEO 优化
- 📖 代码高亮
- 🏷️ 标签系统
- 📄 文章分类
- 🔗 社交链接

## 技术栈

- **Jekyll** - 静态网站生成器
- **GitHub Pages** - 托管平台
- **SCSS** - 样式预处理器
- **Font Awesome** - 图标库
- **Google Fonts** - 字体服务

## 本地开发

### 环境要求

- Ruby 2.7+
- Jekyll 4.3+
- Bundler
~
### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/xunberg/xunberg.github.io.git
cd xunberg.github.io
```

2. 安装依赖
```bash
bundle install
```

3. 启动开发服务器
```bash
bundle exec jekyll serve
```

4. 在浏览器中访问 `http://localhost:4000`

### 开发命令

```bash
# 启动开发服务器
bundle exec jekyll serve

# 启动开发服务器（带自动重载）
bundle exec jekyll serve --livereload

# 构建静态文件
bundle exec jekyll build

# 清理生成的文件
bundle exec jekyll clean
```

## 文件结构

```
├── _config.yml          # Jekyll 配置文件
├── _layouts/            # 页面布局模板
│   ├── default.html     # 默认布局
│   └── post.html        # 文章布局
├── _sass/              # SCSS 部分文件
├── assets/             # 静态资源
│   ├── css/            # 样式文件
│   ├── js/             # JavaScript 文件
│   └── images/         # 图片文件
├── mcp/                # MCP 相关文章
├── index.md            # 首页
├── about.md            # 关于页面
└── Gemfile            # Ruby 依赖管理
```

## 添加新文章

1. 在 `mcp/` 目录下创建新的 Markdown 文件
2. 添加 Front Matter：

```yaml
---
layout: post
title: "文章标题"
date: 2024-12-30
category: "分类"
tags: ["标签1", "标签2"]
excerpt: "文章摘要"
---
```

3. 编写文章内容

## 自定义配置

主要配置在 `_config.yml` 文件中：

- 网站基本信息（标题、描述等）
- 导航菜单
- 社交链接
- SEO 设置

## 部署

本项目配置为自动部署到 GitHub Pages。每次推送到 `main` 分支时，GitHub Actions 会自动构建并部署网站。

## 许可证

MIT License

## 作者

Xunberg - [@xunberg](https://github.com/xunberg)

## 贡献

欢迎提交 Issues 和 Pull Requests！
