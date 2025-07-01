import httpRequest from '../common/http.js';
import storage from '../common/storage.js';
import fit from '../common/fit.js';

/**
 * @Description:首页
 * @author:Howe
 * @param 商品列表
 * @return
 * @createTime: 2024-11-05 10:00:58
 * @Copyright by 红逸
 */


$(document).ready(function () {
	httpRequest("/goods/recommendList", "GET", {
		limit: 12,
		type: 1
	}).then(res => {
		let html = "";
		res.data.forEach(item => {
			html = html + `	<div class="product-wrap product-border-1">
							<div class="product-wrap product-border-1 mb-30">
								<div class="product-img product-img2">
									<a href="details/${item.linkTitle}">
									<img class="product-img product-img2" style="object-fit:contain;background-color:#fff;" src="${item.image}" alt="${item.name}" >
									</a>
								</div>
								<div class="product-content product-content-padding text-center">
									<h4 class="ellipsis-multiline2" ><a href="details/${item.linkTitle}">${item.name}</a></h4>
									<div class="product-rating">
									<i class="la la-star" style="color: ${item.score>=1?'#ffa900':'#9f9f9f'}"></i>
									<i class="la la-star" style="color: ${item.score>=2?'#ffa900':'#9f9f9f'}"></i> 
									<i class="la la-star" style="color: ${item.score>=3?'#ffa900':'#9f9f9f'}"></i> 
									<i class="la la-star" style="color: ${item.score>=4?'#ffa900':'#9f9f9f'}"></i> 
									<i class="la la-star" style="color: ${item.score>=5?'#ffa900':'#9f9f9f'}"></i> 
									</div>
									<div class="product-price">
										<span>£${item.selling_price}</span>
										<span class="old">£${item.price}</span>
									</div>
								</div>
							</div>
						</div> `
		})

		$(`.product-slider-active`).html(html);
		setTimeout(() => {
			fit.adaptImgHeight(".product-img2", 1);
		}, 300)

		//图片请求回来后渲染轮播
		setTimeout(() => {
			/* Product slider active */
			$('.product-slider-active').owlCarousel({
				loop: true,
				nav: false,
				autoplay: false,
				autoplayTimeout: 5000,
				animateOut: 'fadeOut',
				animateIn: 'fadeIn',
				item: 4,
				margin: 30,
				responsive: {
					0: {
						items: 1
					},
					576: {
						items: 2
					},
					768: {
						items: 2
					},
					992: {
						items: 3
					},
					1200: {
						items: 4
					}
				}
			});

		}, 50)
	}).catch().finally()


	category()
});


/**
 * @Description:商品类型
 * @author:Howe
 * @param
 * @return
 * @createTime: 2024-11-27 16:33:44
 * @Copyright by 红逸
 */
const getRecommendList = (type, id) => {
	httpRequest("/goods/recommendList", "GET", {
		limit: 8,
		type: type,
		// categoryId: id
	}).then(res => {
		let html = "";
		res.data.forEach(item => {
			html = html + `<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
									<div class="product-wrap product-border-1 mb-30">
									<a href="details/${item.linkTitle}">
										<div class="product-img product-img1"> 
											<img  class="product-img product-img1"  style="object-fit:contain;background-color:#fff;" src="${item.image}" alt="${item.name}" >
										</div>
										</a>
										<div class="product-content product-content-padding text-center">
											<h4 class="ellipsis-multiline2" ><a href="details/${item.linkTitle}">${item.name}</a></h4>
											<div class="product-rating">
												<i class="la la-star" style="color: ${item.score>=1?'#ffa900':'#9f9f9f'}"></i> 
												<i class="la la-star" style="color: ${item.score>=2?'#ffa900':'#9f9f9f'}"></i> 
												<i class="la la-star" style="color: ${item.score>=3?'#ffa900':'#9f9f9f'}"></i> 
												<i class="la la-star" style="color: ${item.score>=4?'#ffa900':'#9f9f9f'}"></i> 
												<i class="la la-star" style="color: ${item.score>=5?'#ffa900':'#9f9f9f'}"></i> 
											</div>
											<div class="product-price">
												<span>£${item.selling_price}</span>
												<span class="old">£${item.price}</span>
											</div>
										</div>
									</div>
								</div>`
		})

		$(`#response-product_${type}`).html(html);
		window.adaptImgHeight()
	}).catch().finally()
}


// 商品分类 随机取
const category = async () => {
	var category_list = storage.getStorageData("category_list");

	if (!category_list.length) {
		await httpRequest("/goods_category/list", "GET").then(res => {
			category_list = res.data;
			storage.setStorageData("category_list", category_list);
		}).catch().finally()
	}
	var categorys = [];
	category_list.forEach(item => {
		if (item.children && item.children.length) {
			item.children.forEach(listitem => {
				categorys.push(listitem)
			})
		}
	});
	// 随机取categorys中的3个
	let randomCategorys = [];
	for (let i = 0; i < 3; i++) {
		let index = Math.floor(Math.random() * categorys.length);
		randomCategorys.push(categorys[index]);
		categorys.splice(index, 1);
	}

	getRecommendList(2, randomCategorys[0].id)
	getRecommendList(4, randomCategorys[0].id)
	getRecommendList(6, randomCategorys[0].id)

	randomCategorys.forEach((item, index) => {
		let name = item.name.replace(/ /g, "_");

		let html1 = `${item.name}`;
		let html2 = `<a href="shop-list?id=${item.id}&title=`+name+`">Shop Now</a>`

		$(`.random_classify1_${index+1}`).html(html1)
		$(`.random_classify2_${index+1}`).html(html2)
	})

}

window.adaptImgHeight = () => {
	setTimeout(() => {
		fit.adaptImgHeight(".product-img1", 1);
	}, 300)
}
