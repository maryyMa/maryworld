# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

基于 Hexo 的静态技术博客，主题为 Android 和 AI 技术，部署到 GitHub Pages：https://maryyMa.github.io/maryworld。内容语言为中文。

## 常用命令

```bash
# 在 blog/ 目录下执行
cd blog
npm install              # 安装依赖
npx hexo server          # 本地预览，访问 http://localhost:4000/maryworld
npx hexo generate        # 构建静态站点到 blog/public/
npx hexo clean           # 清理生成的文件
npx hexo new "文章标题"   # 创建新文章
```

## 项目结构

- `blog/` - Hexo 博客站点
  - `source/_posts/` - 博客文章（带 front-matter 的 Markdown）
  - `themes/` - Hexo 主题（配置为 NexT 主题）
  - `_config.yml` - Hexo 主配置
  - `_config.next.yml` - NexT 主题配置（scheme: Gemini）

## 关键配置文件

- `blog/_config.yml` - 站点标题、URL、永久链接格式、语法高亮
- `blog/_config.next.yml` - NexT 主题：菜单、社交链接、字体、代码高亮主题
- `blog/package.json` - Hexo 8.x + NexT 8.x

## 部署方式

推送到 `main` 分支且 `blog/` 目录有变更时，GitHub Actions 自动构建并部署到 GitHub Pages。

## 文章格式

```yaml
---
title: 文章标题
date: YYYY-MM-DD HH:mm:ss
categories:
  - 分类
tags:
  - 标签1
---
```
