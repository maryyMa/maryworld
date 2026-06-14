#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 配置路径
const DRAFTS_DIR = path.join(__dirname, 'writing-tool', 'drafts');
const POSTS_DIR = path.join(__dirname, 'blog', 'source', '_posts');

// 确保目录存在
if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}

if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
}

// 同步函数
function syncDraftsToPosts() {
    const files = fs.readdirSync(DRAFTS_DIR);
    
    let syncedCount = 0;
    
    files.forEach(file => {
        // 跳过 .gitkeep 和非 md 文件
        if (file === '.gitkeep' || !file.endsWith('.md')) {
            return;
        }
        
        const sourcePath = path.join(DRAFTS_DIR, file);
        const destPath = path.join(POSTS_DIR, file);
        
        // 检查目标文件是否已存在
        if (fs.existsSync(destPath)) {
            console.log(`⚠️  文件已存在，跳过: ${file}`);
            return;
        }
        
        // 复制文件
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ 同步成功: ${file}`);
        syncedCount++;
    });
    
    if (syncedCount === 0) {
        console.log('ℹ️  没有新文章需要同步');
    } else {
        console.log(`\n🎉 成功同步 ${syncedCount} 篇文章到博客`);
    }
}

// 主函数
function main() {
    console.log('📝 开始同步文章...\n');
    syncDraftsToPosts();
    console.log('\n✨ 同步完成！');
}

main();
