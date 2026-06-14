#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// 配置文件路径
const CONFIG_FILE = path.join(__dirname, 'wechat-config.json');

// 加载配置
function loadConfig() {
    if (fs.existsSync(CONFIG_FILE)) {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }
    return null;
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

// 将 Markdown 转换为 HTML
function markdownToHtml(markdown) {
    let html = markdown;
    
    // 标题
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // 粗体和斜体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 链接和图片
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;height:auto;">');
    
    // 代码块
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
    });
    
    // 行内代码
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 引用
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // 列表
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // 段落
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // 清理空段落
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    
    return html;
}

// 上传图片
async function uploadImage(accessToken, imageUrl) {
    return new Promise((resolve, reject) => {
        // 这里需要实现图片上传逻辑
        // 由于需要处理 multipart/form-data，建议使用第三方库
        reject(new Error('图片上传功能需要额外实现'));
    });
}

// 创建草稿
async function createDraft(accessToken, articles) {
    return new Promise((resolve, reject) => {
        const url = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`;
        const postData = JSON.stringify({
            articles: articles
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
                    if (result.media_id) {
                        resolve(result.media_id);
                    } else {
                        reject(new Error(`创建草稿失败: ${result.errmsg || '未知错误'}`));
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

// 发布文章
async function publishArticle(accessToken, mediaId) {
    return new Promise((resolve, reject) => {
        const url = `https://api.weixin.qq.com/cgi-bin/freepublish/submit?access_token=${accessToken}`;
        const postData = JSON.stringify({
            media_id: mediaId
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
                    if (result.publish_id) {
                        resolve(result.publish_id);
                    } else {
                        reject(new Error(`发布失败: ${result.errmsg || '未知错误'}`));
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

// 解析 Markdown 文件
function parseMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 解析 front-matter
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontMatterMatch) {
        throw new Error('无效的 Markdown 文件格式');
    }
    
    const frontMatter = frontMatterMatch[1];
    const body = frontMatterMatch[2];
    
    // 提取标题
    const titleMatch = frontMatter.match(/title:\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.md');
    
    // 提取摘要（第一个段落）
    const summaryMatch = body.match(/\n\n([^#].*?)(\n\n|$)/);
    const summary = summaryMatch ? summaryMatch[1].trim().substring(0, 120) : '';
    
    return {
        title,
        content: body,
        summary
    };
}

// 主函数
async function main() {
    const config = loadConfig();
    
    if (!config || !config.appId || !config.appSecret) {
        console.log('⚠️  请先配置微信公众号信息');
        console.log('运行 node fetch-wechat.js 进行配置');
        return;
    }
    
    // 获取命令行参数
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('使用方法:');
        console.log('  node publish-wechat.js <markdown-file>  # 发布单篇文章');
        console.log('  node publish-wechat.js --all            # 发布所有草稿');
        console.log('\n示例:');
        console.log('  node publish-wechat.js writing-tool/drafts/my-article.md');
        return;
    }
    
    try {
        console.log('🔑 获取 access_token...');
        const accessToken = await getAccessToken(config.appId, config.appSecret);
        
        if (args[0] === '--all') {
            // 发布所有草稿
            const draftsDir = path.join(__dirname, 'writing-tool', 'drafts');
            const files = fs.readdirSync(draftsDir)
                .filter(f => f.endsWith('.md') && f !== '.gitkeep');
            
            console.log(`📄 找到 ${files.length} 篇文章`);
            
            for (const file of files) {
                const filePath = path.join(draftsDir, file);
                const { title, content, summary } = parseMarkdownFile(filePath);
                
                console.log(`\n📤 发布: ${title}`);
                
                // 转换为 HTML
                const html = markdownToHtml(content);
                
                // 创建草稿
                const mediaId = await createDraft(accessToken, [{
                    title: title,
                    author: config.author || 'Mary',
                    digest: summary,
                    content: html,
                    content_source_url: '',
                    thumb_media_id: '',
                    need_open_comment: 0,
                    only_fans_can_comment: 0
                }]);
                
                console.log(`✅ 草稿创建成功: ${mediaId}`);
                
                // 发布
                const publishId = await publishArticle(accessToken, mediaId);
                console.log(`✅ 发布成功: ${publishId}`);
                
                // 等待一下，避免频率限制
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
        } else {
            // 发布单篇文章
            const filePath = args[0];
            
            if (!fs.existsSync(filePath)) {
                console.error(`❌ 文件不存在: ${filePath}`);
                return;
            }
            
            const { title, content, summary } = parseMarkdownFile(filePath);
            
            console.log(`📤 发布: ${title}`);
            
            // 转换为 HTML
            const html = markdownToHtml(content);
            
            // 创建草稿
            const mediaId = await createDraft(accessToken, [{
                title: title,
                author: config.author || 'Mary',
                digest: summary,
                content: html,
                content_source_url: '',
                thumb_media_id: '',
                need_open_comment: 0,
                only_fans_can_comment: 0
            }]);
            
            console.log(`✅ 草稿创建成功: ${mediaId}`);
            
            // 发布
            const publishId = await publishArticle(accessToken, mediaId);
            console.log(`✅ 发布成功: ${publishId}`);
        }
        
        console.log('\n✨ 发布完成！');
        
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
    getAccessToken,
    markdownToHtml,
    createDraft,
    publishArticle,
    parseMarkdownFile
};
