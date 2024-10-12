// 高登自動留名器-舊版(適用於非起底)
// 功能：利用高登自帶嘅bookmark功能，自動bookmark留言過嘅post
// 使用限制：高登新網頁https://forum.hkgolden.com/
// 使用方式：
// 1) F12去console
// 2) 將個js嘅code貼上並執行


// 定義延遲時間
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 自動碌到網頁底部並留名
async function autoBookmark() {
    while (true) {
        // 碌到網頁底部
        window.scrollTo(0, document.body.scrollHeight);
        
        // 等待2秒，去fetch 新嘅post list
        await delay(2000);
        
        // 獲取所有 post 嘅page 1連結
        const postLinks = Array.from(document.querySelectorAll('a[href^="/thread/"]')).filter(link => !link.href.includes('/page/'));
        
        for (const link of postLinks) {
            const postUrl = link.getAttribute('href');
            const fullPostUrl = `https://forum.hkgolden.com${postUrl}/page/1`;
            
            // 檢查個post係咪已經留言過
            if (visitedPosts.has(fullPostUrl)) {
                console.log(`已經留名過嘅Post: ${fullPostUrl}`);
                continue; // 跳過已經留名過嘅POST
            }            
            
            
            // 開New TAB 去㩒留名button
            const newTab = window.open(fullPostUrl, '_blank');
            await delay(2000); // 等待2秒去load post
            
            // 定義正確嘅留名按鈕
            const bookmarkButton = newTab.document.querySelector('button[aria-label="留名"]');
            const cancelBookmarkButton = newTab.document.querySelector('button[aria-label="取消留名"]');
            
            // 檢查按鈕嘅狀態(未留名/已留名)
            if (bookmarkButton) {
                bookmarkButton.click();
                console.log(`已成功留名: ${fullPostUrl}`);
            } else if (cancelBookmarkButton) {
                console.log(`已經留名: ${fullPostUrl}`);
            } else {
                console.error(`未找到留名按鈕: ${fullPostUrl}`);
            }
            
            // 等待2秒去確保留名成功
            await delay(2000);
            // 關閉post TAB
            newTab.close();

            // 返去Post List等1秒
            await delay(1000);
        }
    }
}

//
autoBookmark();
