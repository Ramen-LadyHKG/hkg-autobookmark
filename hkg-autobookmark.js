// 高登自動留名器
// 功能：利用高登自帶嘅bookmark功能，自動bookmark留言過嘅post
// 使用限制：高登新網頁 https://forum.hkgolden.com/user/xxxxxxx/posthistory
// 使用方式：
// 1) 入去你嘅個人起底
// 2) F12去console
// 3) 將個js嘅code貼上
// 4) 修改“你的HKGAuth token”做你嘅token
// 5) Enter執行

// 定義延遲時間
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 設定自動留名功能
async function autoBookmark() {
    try {
        // 喺當前網址filter出會員 ID
        const currentUserId = window.location.pathname.split('/')[2];

        // fetch 高登嘅API，通過 maxPage 嘅值去做post list 嘅page loop
        const initialResponse = await fetch(`https://api.hkgolden.com/v1/profile/post/${currentUserId}/p/1`);
        const initialData = await initialResponse.json();
        const maxPage = initialData.data.maxPage;

        // 重覆直到最後一版
        for (let page = 1; page <= maxPage; page++) {
            const response = await fetch(`https://api.hkgolden.com/v1/profile/post/${currentUserId}/p/${page}`);
            const data = await response.json();

            // 分析 JSON 結構，攞到 post list
            const postList = data.data.list;

            for (const post of postList) {
                if (!post.isBookmarked) { // 如果未留名
                    const postId = post.id;

                    // 設定 request type 做FormData
                    const formData = new FormData();
                    formData.append('id', postId); // 加入 postId

                    // fetch request去API
                    const bookmarkResponse = await fetch('https://api.hkgolden.com/v1/topics/bookmark', {
                        method: 'POST',
                        headers: {
                            'HKGAuth': '你的HKGAuth token', // 請修改做你自己嘅 token
                        },
                        body: formData // 設定 Request FormData 嘅body
                    });

                    if (bookmarkResponse.ok) {
                        console.log(`已成功留名: https://forum.hkgolden.com/thread/${postId}`);
                    } else {
                        const errorData = await bookmarkResponse.json();
                        console.error(`留名失敗: ${errorData.error.id}`);
                    }

                    // 等2秒，避免request得太密
                    await delay(2000);
                } else {
                    console.log(`已經留名: https://forum.hkgolden.com/thread/${post.id}`);
                }
            }
        }
    } catch (error) {
        console.error(`自動留名過程中出錯: ${error}`);
    }
}

// 開始執行自動留名
autoBookmark();
