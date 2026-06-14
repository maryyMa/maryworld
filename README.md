# Mary's Blog 使用指南

## 项目结构

```
maryworld/
├── blog/                  # Hexo 博客
│   ├── source/_posts/     # 博客文章目录
│   ├── themes/            # 主题
│   └── ...
├── writing-tool/          # 写作工具
│   ├── skills/            # 写作 Skill
│   ├── templates/         # 文章模板
│   └── drafts/            # 生成的草稿
├── .opencode/skills/      # opencode Skill 配置
├── .github/workflows/     # GitHub Actions
├── sync.js                # 同步脚本
├── fetch-wechat.js        # 公众号文章抓取
├── publish-wechat.js      # 公众号文章发布
└── publish.js             # 统一发布脚本
```

## 快速开始

### 1. 本地预览博客

```bash
cd blog
npm install
npx hexo server
```

访问 http://localhost:4000/maryworld 预览

### 2. 生成技术文章

使用 opencode Skill 生成文章：

```bash
# 在 opencode 中使用
@tech-writer 生成一篇关于 Jetpack Compose 状态管理的文章
```

或手动创建文章：

```bash
# 创建新文章
npx hexo new "我的技术文章"
```

### 3. 同步文章到博客

```bash
# 同步 drafts 到 _posts
node sync.js
```

### 4. 发布到 GitHub

```bash
cd blog
npx hexo generate
git add .
git commit -m "Add new posts"
git push
```

GitHub Actions 会自动部署到 GitHub Pages。

### 5. 发布到公众号

```bash
# 发布单篇文章
node publish.js writing-tool/drafts/my-article.md

# 发布所有草稿
node publish.js --all

# 仅发布到公众号
node publish.js --wechat-only writing-tool/drafts/my-article.md
```

## 配置公众号

### 1. 获取公众号配置

1. 登录微信公众平台
2. 进入 开发 -> 基本配置
3. 获取 AppID 和 AppSecret

### 2. 配置文件

编辑 `wechat-config.json`：

```json
{
  "appId": "your-app-id",
  "appSecret": "your-app-secret",
  "author": "Mary"
}
```

### 3. 抓取已有文章

```bash
node fetch-wechat.js
```

## 使用 Skill 生成文章

### Android 技术文章

```bash
@tech-writer 生成一篇关于 Kotlin 协程的文章
要点：
1. 协程的基本概念
2. 协程的启动方式
3. 协程的作用域
4. 协程的异常处理
```

### AI 技术文章

```bash
@tech-writer 生成一篇关于 RAG 的文章
技术栈：Python, LangChain, ChromaDB
要点：
1. RAG 的基本原理
2. 文档向量化
3. 检索增强生成
4. 实际应用案例
```

## 自定义主题

### 修改主题配置

编辑 `blog/_config.next.yml`：

```yaml
# 修改配色
scheme: Gemini

# 修改菜单
menu:
  home: / || fa fa-home
  archives: /archives/ || fa fa-archive
  categories: /categories/ || fa fa-th
  tags: /tags/ || fa fa-tags
  about: /about/ || fa fa-user

# 修改社交链接
social:
  GitHub: https://github.com/your-name || fab fa-github
```

### 重新生成

```bash
cd blog
npx hexo clean
npx hexo generate
```

## 常见问题

### Q: 如何修改博客标题？

编辑 `blog/_config.yml`：

```yaml
title: Mary's Blog
subtitle: 'Android & AI 技术博客'
```

### Q: 如何添加新分类？

在文章的 front-matter 中添加：

```yaml
categories:
  - Android
  - Kotlin
```

### Q: 如何修改部署地址？

编辑 `blog/_config.yml`：

```yaml
url: https://your-username.github.io/maryworld
```

### Q: 公众号发布失败怎么办？

1. 检查 AppID 和 AppSecret 是否正确
2. 确认公众号已认证
3. 检查文章内容是否符合规范

## 工作流程

### 日常写作流程

1. **生成文章**
   ```bash
   @tech-writer 生成文章
   ```

2. **预览文章**
   ```bash
   cd blog
   npx hexo server
   ```

3. **同步到博客**
   ```bash
   node sync.js
   ```

4. **发布到 GitHub**
   ```bash
   cd blog
   npx hexo generate
   git add .
   git commit -m "Add new post"
   git push
   ```

5. **发布到公众号**
   ```bash
   node publish.js writing-tool/drafts/my-article.md
   ```

### 批量发布流程

```bash
# 同步所有草稿
node sync.js

# 发布到公众号
node publish.js --all

# 推送到 GitHub
cd blog
npx hexo generate
git add .
git commit -m "Add posts"
git push
```

## 高级功能

### 自定义模板

编辑 `writing-tool/templates/` 下的模板文件。

### 修改同步逻辑

编辑 `sync.js` 文件。

### 修改发布逻辑

编辑 `publish-wechat.js` 文件。

## 技术支持

- Hexo 文档: https://hexo.io/zh-cn/docs/
- NexT 主题: https://theme-next.js.org/
- 微信公众号 API: https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html
