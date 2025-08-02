/**
 * @Description: 博客列表页面
 * @author: Howe
 * @param 博客列表
 * @return
 * @createTime: 2024-11-05 10:00:58
 * @Copyright by 红逸
 */

import httpRequest from '../common/http.js';
import fit from '../common/fit.js';

let from = {
    page: 1,
    limit: 8
}
let totalCount = 0;

$(document).ready(function() {
    from.page = 1;
    getBlogList();
    initPaginationEvents();
});

// 博客列表
const getBlogList = () => {
    $("#blog-list").html(
        `<div style="font-size: 30px; text-align: center; width: 100%; color: #495057; margin: 20px 0; padding: 10px 0; background: linear-gradient(90deg, #f8f9fa, #e9ecef); border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            loading...
        </div>`
    );

    // 构建请求参数
    const params = {
        page: from.page,
        limit: from.limit
    };

    // 调用API获取博客数据
    httpRequest('/blog_posts/index', 'GET', params)
        .then(response => {
            if (response.code === 1) {
                const data = response.data;
                let html = "";

                if (data.list && data.list.length > 0) {
                    data.list.forEach(item => {
                        // 截取内容摘要
                        let excerpt = item.excerpt || item.content || '';
                        if (excerpt.length > 150) {
                            excerpt = excerpt.substring(0, 150) + '...';
                        }

                        // 格式化日期
                        let formattedDate = item.createtime ? new Date(item.createtime * 1000).toLocaleDateString() : '';

                        html += `
                        <div class="col-lg-4 col-md-6" style="padding: 10px">
                            <div class="blog-wrap mb-30">
                                <div class="blog-content">
                                    <h2><a href="blog-detail?id=${item.id}">${item.title}</a></h2>
                                    <div class="blog-meta">
                                        <a href="#"><i class="la la-user"></i> ${item.author || 'Admin'}</a>
                                        <a href="#"><i class="la la-clock-o"></i> ${formattedDate}</a>
                                    </div>
                                    <p>${excerpt}</p>
                                    <div class="blog-btn">
                                        <a href="blog-detail?id=${item.id}">read more</a>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    });

                    $("#blog-list").html(html);

                    // 更新分页
                    totalCount = data.total;
                    if (totalCount && Math.ceil(totalCount / from.limit) > 1) {
                        $("#pagination").html(createPagination(from.page, Math.ceil(totalCount / from.limit)));
                    } else {
                        $("#pagination").html("");
                    }
                } else {
                    $("#blog-list").html(
                        `<div style="font-size:30px;text-align: center;width: 100%;color: #495057;">There is no blog data for the time being</div>`
                    );
                    $("#pagination").html("");
                }
            } else {
                $("#blog-list").html(
                `<div style="font-size:30px;text-align: center;width: 100%;color: #495057;">fail to load: ${response.msg || '未知错误'}</div>`
            );
            }
        })
        .catch(error => {
            console.error('获取博客列表失败:', error);
            $("#blog-list").html(
                `<div style="font-size:30px;text-align: center;width: 100%;color: #495057;">Network error. Please try again later</div>`
            );
        });
}

/**
 * 创建分页HTML结构
 * @param {number} currentPage 当前页码
 * @param {number} totalPages 总页数
 * @returns {string} 分页HTML字符串
 */
const createPagination = (currentPage, totalPages) => {
    if (totalPages <= 1) return '';
    
    let paginationHtml = '';
    
    // 上一页按钮
    if (currentPage > 1) {
        paginationHtml += `<li><a class="prev" href="#" data-page="${currentPage - 1}"><i class="la la-angle-left"></i></a></li>`;
    }
    
    // 页码逻辑
    const pageNumbers = generatePageNumbers(currentPage, totalPages);
    
    pageNumbers.forEach(page => {
        if (page === '...') {
            paginationHtml += '<li><span class="dots">...</span></li>';
        } else {
            const isActive = page === currentPage ? 'active' : '';
            paginationHtml += `<li><a class="${isActive}" href="#" data-page="${page}">${page}</a></li>`;
        }
    });
    
    // 下一页按钮
    if (currentPage < totalPages) {
        paginationHtml += `<li><a class="next" href="#" data-page="${currentPage + 1}"><i class="la la-angle-right"></i></a></li>`;
    }
    
    return paginationHtml;
};

/**
 * 生成页码数组（包含省略号逻辑）
 * @param {number} current 当前页
 * @param {number} total 总页数
 * @returns {Array} 页码数组
 */
const generatePageNumbers = (current, total) => {
    const pages = [];
    const delta = 2; // 当前页前后显示的页数
    
    // 总是显示第一页
    pages.push(1);
    
    if (total <= 7) {
        // 页数较少时，显示所有页码
        for (let i = 2; i <= total; i++) {
            pages.push(i);
        }
    } else {
        // 页数较多时，使用省略号
        const start = Math.max(2, current - delta);
        const end = Math.min(total - 1, current + delta);
        
        // 左侧省略号
        if (start > 2) {
            pages.push('...');
        }
        
        // 中间页码
        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== total) {
                pages.push(i);
            }
        }
        
        // 右侧省略号
        if (end < total - 1) {
            pages.push('...');
        }
        
        // 总是显示最后一页
        if (total > 1) {
            pages.push(total);
        }
    }
    
    return pages;
};

/**
 * 跳转到指定页码
 * @param {number} pageNumber 目标页码
 */
const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > Math.ceil(totalCount / from.limit)) {
        return;
    }
    
    from.page = pageNumber;
    getBlogList();
    
    // 平滑滚动到顶部
    $('html, body').animate({
        scrollTop: $('.blog-area').offset().top - 100
    }, 500);
};

/**
 * 初始化分页事件监听
 */
const initPaginationEvents = () => {
    // 使用事件委托处理分页点击
    $(document).off('click', '#pagination a').on('click', '#pagination a', function(e) {
        e.preventDefault();
        
        const $this = $(this);
        const targetPage = parseInt($this.data('page'));
        
        if (targetPage && !isNaN(targetPage)) {
            goToPage(targetPage);
        }
    });
};
