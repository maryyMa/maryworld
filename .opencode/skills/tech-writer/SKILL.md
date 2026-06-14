---
name: tech-writer
description: 生成 Android 和 AI 技术文章。当用户提到"写技术文章"、"生成技术文档"、"Android 开发"、"AI 技术"、"机器学习"、"深度学习"时使用。
---

# 技术文档生成 Skill

## 功能描述
根据用户提供的主题和要点，生成高质量的技术文章，适用于 Android 全栈和 AI 相关技术。

## 使用场景
- 记录工作中学到的技术
- 整理项目实战经验
- 分享 Android 开发技巧
- 记录 AI/ML 学习笔记

## 输入格式
用户需要提供：
1. **主题**：文章的核心主题
2. **技术栈**：涉及的技术（可选）
3. **要点**：文章要覆盖的要点列表
4. **代码示例**：相关代码片段（可选）

## 输出格式
生成符合 Hexo 格式的 Markdown 文章，包含：
- 完整的 front-matter（标题、日期、分类、标签）
- 清晰的章节结构
- 代码示例（带语法高亮）
- 总结和参考

## 工作流程
1. 分析用户输入的主题和要点
2. 根据技术类型选择模板（Android/AI）
3. 生成文章内容
4. 保存到 `writing-tool/drafts/` 目录
5. 可选：自动同步到博客

## 模板位置
- Android 模板: `writing-tool/templates/android-article.md`
- AI 模板: `writing-tool/templates/ai-article.md`

## 输出目录
- 草稿目录: `writing-tool/drafts/`
- 博客目录: `blog/source/_posts/`

## 示例

### 输入
```
主题：Jetpack Compose 状态管理
技术栈：Kotlin, Jetpack Compose, MVVM
要点：
1. State 和 MutableState 的区别
2. remember 和 rememberSaveable 的使用
3. 状态提升模式
4. ViewModel 中的状态管理
```

### 输出
生成一篇完整的 Jetpack Compose 状态管理文章，包含代码示例和最佳实践。

## 注意事项
- 代码示例要完整可运行
- 使用中文撰写
- 遵循技术文档规范
- 保持简洁清晰的风格
