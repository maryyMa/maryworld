# Mary's Blog 项目说明

## 项目概述

这是一个 **Hexo 博客项目**，用于同步显示微信公众号内容，部署在 GitHub Pages 上。

- **仓库地址**: https://github.com/maryyMa/maryworld
- **博客地址**: https://maryyMa.github.io/maryworld
- **技术栈**: Hexo + NexT 主题 + GitHub Pages
- **用途**: 记录 Android 全栈开发和 AI 技术的学习笔记

## 项目结构

```
maryworld/
├── blog/                  # Hexo 博客主目录
│   ├── source/_posts/     # 博客文章目录
│   ├── themes/            # NexT 主题
│   └── public/            # 生成的静态文件
├── writing-tool/          # 写作工具目录
│   ├── skills/            # 写作 Skill（Android/AI）
│   ├── templates/         # 文章模板
│   └── drafts/            # 生成的草稿
├── .opencode/skills/      # opencode Skill 配置
├── .github/workflows/     # GitHub Actions 自动部署
├── sync.js                # 同步脚本（drafts → _posts）
├── fetch-wechat.js        # 公众号文章抓取脚本
├── publish-wechat.js      # 公众号文章发布脚本
└── publish.js             # 统一发布脚本
```

## 核心功能

1. **博客展示**: 使用 Hexo + NexT 主题，简洁技术风格
2. **技术文档生成**: 通过 opencode Skill 生成 Android/AI 技术文章
3. **双平台同步**: 文章可同时发布到 GitHub Pages 和微信公众号
4. **自动部署**: 推送到 GitHub 后自动部署到 GitHub Pages

## 常用命令

```bash
# 本地预览博客
cd blog && npx hexo server

# 生成静态文件
cd blog && npx hexo generate

# 同步草稿到博客
node sync.js

# 发布到公众号
node publish-wechat.js writing-tool/drafts/article.md

# 统一发布（博客 + 公众号）
node publish.js writing-tool/drafts/article.md
```

## 用户信息

- **GitHub 用户名**: maryyMa
- **公众号**: 已有 AppID 和 AppSecret（配置在 wechat-config.json）
- **写作风格**: 技术文章，Android 全栈和 AI 相关
