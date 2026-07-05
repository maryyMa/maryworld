# Mary's Blog

Android & AI 技术博客，基于 Hexo + NexT 主题，部署到 GitHub Pages。

## 快速开始

```bash
cd blog
npm install
npx hexo server
```

访问 http://localhost:4000/maryworld 预览。

## 常用命令

```bash
npx hexo new "文章标题"    # 创建新文章
npx hexo server           # 本地预览
npx hexo generate         # 构建静态站点
npx hexo clean            # 清理生成文件
```

## 项目结构

```
blog/
├── source/_posts/     # 博客文章
├── themes/            # NexT 主题
├── _config.yml        # Hexo 配置
└── _config.next.yml   # NexT 主题配置
```

## 部署

推送到 `main` 分支，GitHub Actions 自动构建并部署到 GitHub Pages。

## 文章格式

```yaml
---
title: 文章标题
date: 2026-07-04 12:00:00
categories:
  - Android
tags:
  - Kotlin
---
```
