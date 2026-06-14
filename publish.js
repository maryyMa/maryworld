#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置路径
const DRAFTS_DIR = path.join(__dirname, 'writing-tool', 'drafts');
const POSTS_DIR = path.join(__dirname, 'blog', 'source', '_posts');

// 同步到博客
function syncToBlog(filePath) {
    const filename = path.basename(filePath);
    const destPath = path.join(POSTS_DIR, filename);
    
    if (fs.existsSync(destPath)) {
        console.log(`⚠️  博客中已存在: ${filename}`);
        return false;
    }
    
    fs.copyFileSync(filePath, destPath);
    console.log(`✅ 同步到博客: ${filename}`);
    return true;
}

// 发布到公众号
async function publishToWechat(filePath) {
    try {
        console.log(`📤 发布到公众号: ${path.basename(filePath)}`);
        execSync(`node publish-wechat.js "${filePath}"`, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`❌ 发布到公众号失败: ${error.message}`);
        return false;
    }
}

// 主函数
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('使用方法:');
        console.log('  node publish.js <markdown-file>  # 发布单篇文章');
        console.log('  node publish.js --all            # 发布所有草稿');
        console.log('  node publish.js --blog-only      # 仅同步到博客');
        console.log('  node publish.js --wechat-only    # 仅发布到公众号');
        console.log('\n示例:');
        console.log('  node publish.js writing-tool/drafts/my-article.md');
        return;
    }
    
    const blogOnly = args.includes('--blog-only');
    const wechatOnly = args.includes('--wechat-only');
    const publishAll = args.includes('--all');
    
    let files = [];
    
    if (publishAll) {
        // 获取所有草稿
        files = fs.readdirSync(DRAFTS_DIR)
            .filter(f => f.endsWith('.md') && f !== '.gitkeep')
            .map(f => path.join(DRAFTS_DIR, f));
    } else {
        // 单个文件
        const filePath = args.find(a => !a.startsWith('--'));
        if (!filePath || !fs.existsSync(filePath)) {
            console.error('❌ 请指定有效的文件路径');
            return;
        }
        files = [filePath];
    }
    
    console.log(`📄 找到 ${files.length} 篇文章\n`);
    
    let blogCount = 0;
    let wechatCount = 0;
    
    for (const file of files) {
        console.log(`\n处理: ${path.basename(file)}`);
        console.log('─'.repeat(50));
        
        // 同步到博客
        if (!wechatOnly) {
            if (syncToBlog(file)) {
                blogCount++;
            }
        }
        
        // 发布到公众号
        if (!blogOnly) {
            if (await publishToWechat(file)) {
                wechatCount++;
            }
        }
    }
    
    console.log('\n' + '═'.repeat(50));
    console.log('📊 发布统计:');
    if (!wechatOnly) {
        console.log(`  博客: ${blogCount} 篇`);
    }
    if (!blogOnly) {
        console.log(`  公众号: ${wechatCount} 篇`);
    }
    console.log('═'.repeat(50));
    
    // 提示下一步
    if (blogCount > 0 && !wechatOnly) {
        console.log('\n💡 下一步:');
        console.log('  1. 运行 "cd blog && npx hexo generate" 生成静态文件');
        console.log('  2. 运行 "git add . && git commit -m "add posts" && git push" 推送到 GitHub');
        console.log('  3. GitHub Actions 会自动部署到 GitHub Pages');
    }
}

main();
