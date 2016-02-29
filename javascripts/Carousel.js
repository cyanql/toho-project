function addCarousel(custom) {
	var temp = new Carousel(custom);
	temp.init();
	temp.create();
	temp.start();
	return temp;
}
function Carousel(custom) {
	if (!custom) return console.log('请填写目标元素id和按钮容器id');

	this.extend({
		carouselID : 'carousel',		//组件id
		mainID : 'carousel-main',		//组件-图片容器id
		type : 'warp',
		timeout : 3000
	}, custom);
}

Carousel.prototype = {
	extend: function (options, custom){
		for (var item in options) {
			if (custom.hasOwnProperty(item))
				options[item] = custom[item];
			this[item] = options[item];
		}
	},
	init: function () {
		var _this = this;
		//获取组件元素、图片容器元素、图片元素
		this.carousel = document.getElementById(this.carouselID);
		this.main = document.getElementById(this.mainID);
		this.main.img = this.main.getElementsByTagName('img');

		this.items = this.main.children;

		this.itemNumber = this.items.length;

		this.prevIndex = 0;
		this.itemIndex = 0;

		if (this.type == 'fade') {

			this.itemTemp = this.items[this.itemIndex];

		} else if (this.type = 'warp') {
			//克隆最后一个插入队首，克隆第一个插入队尾
			var first, last;
			first = this.items[this.itemNumber - 1].cloneNode(true);
			this.main.insertBefore(first,this.items[0]);
			last = this.items[1].cloneNode(true);
			this.main.appendChild(last);

			//当第一个图片加载好,获取其宽度，并将图片容器的宽度设置为所有图片宽度和，组件宽度设置为图片宽度
			this.main.img[0].onload = function () {
				_this.itemWidth = this.width;
				_this.carousel.style.width = this.width + 'px';
				_this.main.style.width = this.width * _this.itemNumber + 'px';
				_this.main.style.left = -this.width + 'px';
			}

			this.mainStyle = this.main.style;

			// //设置组件css
			// var carouselStyle = this.carousel.style;
			// carouselStyle.position = 'relative';
			// carouselStyle.overflow = 'hidden';

			// //设置图片容器css
			// var mainStyle = this.main.style;
			// mainStyle.position = 'relative';
			// mainStyle.left = '0';
			// mainStyle.top = '0';
			// mainStyle.width = this.itemNumber * 1920 + 'px';
			// mainStyle.transition = 'left .5s ease';
			// mainStyle.overflow = 'hidden';
			// mainStyle.backfaceVisibility = 'hidden';
			// this.mainStyle = mainStyle;

			// //获取图片容器内元素
			// var items = this.items;
			// for (var i = 0, len = items.length; i < len; i++) {		//设置元素css
			// 	items[i].style.float = 'left';
			// 	items[i].style.display = 'block';
			// }
			// for (var j = 0, len = this.main.img.length; j < len; j++)	//设置图片css
			// 	this.main.img[j].display = 'block';
		}
	},

	create: function () {
		var _this = this;

		//创建slider类按钮，并设置css
		function createBtn() {
			var a = document.createElement('a');
			a.href = 'javascript:;';
			a.style.position = 'absolute';
			a.style.top = '50%';
			a.style.padding = '20px 10px';
			a.style.color = 'white';
			a.style.backgroundColor = '#cf1132';
			a.style.display = 'block';
			a.style.zIndex = '2';
			return a;
		}

		var prev, next;

		//设置各自实例的相关属性和函数
		prev = createBtn();
		next = createBtn();
		prev.style.left = '0';
		next.style.right = '0';
		prev.innerHTML = '<';
		next.innerHTML = '>';
		prev.onclick = function () {
			_this.prev();
		};
		next.onclick = function () {
			_this.next();
		};
		
		this.carousel.appendChild(prev);
		this.carousel.appendChild(next);

		/*————————————————————————————————*/

		//创建Marker类按钮
		function createMarker() {
			var a = document.createElement('a');
			a.href = 'javascript:;'
			a.style.width = '20px';
			a.style.height = '20px';
			a.style.color = '#fff';
			a.style.borderRadius = '50%';
			a.style.backgroundColor = '#333';
			a.style.display = 'inline-block';
			return a;
		}

		var marker, i, len, nav;

		//创建nav按钮容器
		nav = document.createElement('div')
		nav.className = 'carousel-ctrl-nav';
		nav.style.position = 'absolute';
		nav.style.bottom = '2%';
		nav.style.width = '100%';
		nav.style.textAlign = 'center';
		nav.style.zIndex = '2';

		//设置各自的按钮编号，用以跳转该图片
		for (i = 0, len = this.itemNumber; i < len; i++) {
			marker = createMarker();
			marker['data-index'] = i;
			marker.onclick = function () {
				_this.skip(this['data-index']);
			};
			nav.appendChild(marker);
		}

		this.carousel.appendChild(nav);

		this.markerNumber = nav.children;
		this.mark();
	},
	start: function () {
		var _this = this;

		//根据轮播类型，循环调用相应函数
		switch (this.type) {
			case 'warp':
				setInterval(function () {
					_this.next();
				}, this.timeout);
				break;
			case 'fade':
				setInterval(function () {
					_this.next();
				}, this.timeout);
				break;
		}
	},
	mark: function () {
		this.markerNumber[this.prevIndex].style.backgroundColor = '#333';
		this.markerNumber[this.itemIndex].style.backgroundColor = '#cf1132';
		this.prevIndex = this.itemIndex;
	},
	skip: function (index) {	//跳转函数
		this.itemIndex = index;
		this.loop();
	},
	prev: function () {			//上一个
		this.itemIndex --;
		this.loop();
	},
	next: function() {			//下一个
		this.itemIndex ++;
		this.loop();
	},
	loop: function () {		//判断是否到达队尾或队首，根据情况直接跳转（去掉动画过程做到无缝连接）
		switch (this.type) {
			case 'warp':
				this.mainStyle.transition = 'left .5s ease';
				if (this.itemIndex > this.itemNumber - 1) {
					this.itemIndex = 0;
					this.mainStyle.transition = '0s';
				} else if (this.itemIndex < 0) {
					this.itemIndex = this.itemNumber - 1;
					this.mainStyle.transition = '0s';
				}
				this.mainStyle.left = -this.itemWidth * this.itemIndex + 'px';
				break;

			case 'fade':
				if (this.itemIndex < 0)
					this.itemIndex = this.itemNumber - 1;
				else if (this.itemIndex > this.itemNumber - 1)
					this.itemIndex = 0;

				this.itemTemp.style.opacity = '0';
				this.itemTemp.style.zIndex = '0';
				this.items[this.itemIndex].style.opacity = '1';
				this.items[this.itemIndex].style.zIndex = '2';
				this.itemTemp = this.items[this.itemIndex];
				break;
		}
		this.mark();
	}
};