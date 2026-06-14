#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// 配置文件路径
const CONFIG_FILE = path.join(__dirname, 'wechat-config.json');

// 默认配置
const DEFAULT_CONFIG = {
    appId: '',
    appSecret: '',
    author: 'Mary'
};

// 加载配置
function loadConfig() {
    if (fs.existsSync(CONFIG_FILE)) {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }
    return { ...DEFAULT_CONFIG };
}

// 保存配置
function saveConfig(config) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// 获取 access_token
async function getAccessToken(appId, appSecret) {
    return new Promise((resolve, reject) => {
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.access_token) {
                        resolve(result.access_token);
                    } else {
                        reject(new Error(`获取 access_token 失败: ${result.errmsg || '未知错误'}`));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

// 获取文章列表
async function getArticleList(accessToken, offset = 0, count = 20) {
    return new Promise((resolve, reject) => {
        const url = `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${accessToken}`;
        const postData = JSON.stringify({
            type: 'news',
            offset: offset,
            count: count
        });
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = https.request(url, options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.item) {
                        resolve(result);
                    } else {
                        reject(new Error(`获取文章列表失败: ${result.errmsg || '未知错误'}`));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
        
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// 将 HTML 转换为 Markdown
function htmlToMarkdown(html) {
    // 简单的 HTML 到 Markdown 转换
    let md = html;
    
    // 移除 HTML 标签，保留内容
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<hr\s*\/?>/gi, '---\n\n');
    md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n\n');
    md = md.replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1\n');
    md = md.replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1\n');
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    
    // 移除其他 HTML 标签
    md = md.replace(/<[^>]+>/g, '');
    
    // 清理多余的空白
    md = md.replace(/\n{3,}/g, '\n\n');
    md = md.trim();
    
    return md;
}

// 生成 Hexo 文章
function generateHexoPost(title, content, date, categories = [], tags = []) {
    const frontMatter = `---
title: ${title}
date: ${date}
categories:
${categories.map(c => `  - ${c}`).join('\n')}
tags:
${tags.map(t => `  - ${t}`).join('\n')}
---

`;
    
    return frontMatter + content;
}

// 主函数
async function main() {
    const config = loadConfig();
    
    // 检查配置
    if (!config.appId || !config.appSecret) {
        console.log('⚠️  请先配置微信公众号信息');
        console.log('配置文件位置:', CONFIG_FILE);
        console.log('\n示例配置:');
        console.log(JSON.stringify({
            appId: 'your-app-id',
            appSecret: 'your-app-secret',
            author: 'Mary'
        }, null, 2));
        
        // 创建默认配置文件
        saveConfig(DEFAULT_CONFIG);
        return;
    }
    
    try {
        console.log('🔑 获取 access_token...');
        const accessToken = await getAccessToken(config.appId, config.appSecret);
        
        console.log('📚 获取文章列表...');
        const result = await getArticleList(accessToken);
        
        console.log(`📄 共找到 ${result.total_count} 篇文章`);
        
        // 创建输出目录
        const outputDir = path.join(__dirname, 'writing-tool', 'drafts', 'wechat');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // 处理每篇文章
        for (const item of result.item) {
            const article = item.content.news_item[0];
            const title = article.title;
            const content = article.content;
            const date = new Date(item.update_time * 1000).toISOString().split('T')[0];
            
            // 转换为 Markdown
            const markdownContent = htmlToMarkdown(content);
            
            // 生成 Hexo 文章
            const post = generateHexoPost(
                title,
                markdownContent,
                date,
                ['微信公众号'],
                ['转载']
            );
            
            // 保存文件
            const filename = `${date}-${title.replace(/[<>:"/\\|?*]/g, '-')}.md`;
            const filepath = path.join(outputDir, filename);
            
            fs.writeFileSync(filepath, post);
            console.log(`✅ 已保存: ${filename}`);
        }
        
        console.log('\n✨ 文章抓取完成！');
        console.log(`📁 文件保存在: ${outputDir}`);
        
    } catch (error) {
        console.error('❌ 错误:', error.message);
    }
}

// 如果直接运行
if (require.main === module) {
    main();
}

module.exports = {
    loadConfig,
    saveConfig,
    getAccessToken,
    getArticleList,
    htmlToMarkdown,
    generateHexoPost
};
