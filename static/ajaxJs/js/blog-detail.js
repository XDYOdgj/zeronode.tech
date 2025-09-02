// 导入必要的模块
import httpRequest from '../common/http.js';
import fit from '../common/fit.js';

$(document).ready(function () {
    // 获取URL参数中的文章ID
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        $('#blog-detail').html(
            `<div style="font-size:30px;text-align: center;width: 100%;color: #495057;">The article ID parameter is missing</div>`
        );
        return;
    }

    getBlogDetail(articleId);
});

// 获取文章详情
const getBlogDetail = (id) => {
    $('#blog-detail').html(
        `<div class="loading-placeholder" style="text-align: center; padding: 50px 0; color: #666; font-size: 18px;">
            <i class="la la-spinner la-spin" style="font-size: 24px; margin-right: 10px;"></i>
            Loading blog content...
        </div>`
    );

    // 调用API获取文章详情
    httpRequest('/blog_posts/detail', 'GET', { id: id })
        .then(response => {
            if (response.code === 1) {
                const article = response.data;

                // 构建上一篇和下一篇导航HTML
                let navigationHtml = '<div class="post-navigation" style="display: flex; justify-content: space-between; margin: 40px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">';

                // 上一篇文章
                if (article.prev_article) {
                    navigationHtml += `
                        <div class="prev-post" style="flex: 1; text-align: left;">
                            <a href="blog-detail?id=${article.prev_article.id}" class="nav-link" style="text-decoration: none; color: #333; display: block; padding: 10px;">
                                <i class="la la-angle-left" style="font-size: 18px; margin-right: 8px;"></i>
                                <span style="font-size: 14px; color: #666;">Previous Post</span>
                                <h4 style="margin: 5px 0 0 0; font-size: 16px; color: #333;">${article.prev_article.title}</h4>
                            </a>
                        </div>
                    `;
                } else {
                    navigationHtml += `
                        <div class="prev-post disabled" style="flex: 1; text-align: left; opacity: 0.5;">
                            <span class="nav-link" style="display: block; padding: 10px;">
                                <i class="la la-angle-left" style="font-size: 18px; margin-right: 8px;"></i>
                                <span style="font-size: 14px; color: #666;">Previous Post</span>
                                <h4 style="margin: 5px 0 0 0; font-size: 16px; color: #666;">No Previous Post</h4>
                            </span>
                        </div>
                    `;
                }

                // 下一篇文章
                if (article.next_article) {
                    navigationHtml += `
                        <div class="next-post" style="flex: 1; text-align: right;">
                            <a href="blog-detail?id=${article.next_article.id}" class="nav-link" style="text-decoration: none; color: #333; display: block; padding: 10px;">
                                <span style="font-size: 14px; color: #666;">Next Post</span>
                                <i class="la la-angle-right" style="font-size: 18px; margin-left: 8px;"></i>
                                <h4 style="margin: 5px 0 0 0; font-size: 16px; color: #333;">${article.next_article.title}</h4>
                            </a>
                        </div>
                    `;
                } else {
                    navigationHtml += `
                        <div class="next-post disabled" style="flex: 1; text-align: right; opacity: 0.5;">
                            <span class="nav-link" style="display: block; padding: 10px;">
                                <span style="font-size: 14px; color: #666;">Next Post</span>
                                <i class="la la-angle-right" style="font-size: 18px; margin-left: 8px;"></i>
                                <h4 style="margin: 5px 0 0 0; font-size: 16px; color: #666;">No Next Post</h4>
                            </span>
                        </div>
                    `;
                }

                navigationHtml += '</div>';

                const html = `
                    <article class="blog-detail-wrapper">
                        <div class="blog-detail-item">
                            <div class="blog-content">
                                <div class="blog-meta mb-20">
                                    <span class="blog-date"><i class="la la-calendar"></i> ${article.date}</span>
                                    <span class="blog-author ml-20"><i class="la la-user"></i> By: ${article.author}</span>
                                </div>
                                <h2 class="blog-title mb-20">${article.title}</h2>
                                <div class="blog-description" style="white-space: pre-wrap; line-height: 1.8;">
                                    ${article.content.replace(/\n/g, '<br>')}
                                </div>
                            </div>
                        </div>
                        
                        ${navigationHtml}
                        
                        <footer class="post-footer" style="text-align: center; margin-top: 30px;">
                            <div class="post-actions">
                                <a href="blog" class="btn btn-primary" style="background: linear-gradient(135deg, #495057, #6c757d); border: none; padding: 12px 30px; border-radius: 25px; color: white; text-decoration: none; display: inline-block;">Back to Blog</a>
                            </div>
                        </footer>
                    </article>
                `;

                $('#blog-detail').html(html);

                // 更新页面标题
                document.title = article.title + ' - Blog Detail';

            } else {
                $('#blog-detail').html(
                    `<div style="font-size:30px;text-align: center;width: 100%;color: #495057;">fail to load: ${response.msg || 'unknown error'}</div>`
                );
            }
        })
        .catch(error => {
            console.error('获取文章详情失败:', error);
            $('#blog-detail').html(
                `<div style="font-size:30px;text-align: center;width: 100%;color: #495057;">Network error. Please try again later</div>`
            );
        });
};
