/*******/
!(function() {
	function addCarousel(custom) {
		var temp = new Carousel(custom);
		temp.init();
		temp.resize();
		temp.create();
		temp.start();
		return temp;
	}
	function Carousel(custom) {
		if (!custom) return alert('请填写目标元素id和按钮容器id');

		this.extend({
			carouselId : 'carousel',		//组件id
			mainId : 'carousel-main',		//组件-图片容器id
			type : 'wrap',
			width: '',
			cssImage: false,
			timeout : 3000,
			direction: 'left',
			btnColor: '#cf1132',
			markerActiveColor: '#cf1132',
			markerNormalColor: '#333'
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
		hasClass: function(elem, className) {
			return elem.className.match(new RegExp('\\b' + className + '\\b'));
		},
		addClass: function(elem, className) {
			if (!this.hasClass(elem, className)) {
				elem.className = elem.className.split(' ').concat(className).join(' ');
			}
		},
		removeClass: function(elem, className) {
			elem.className = elem.className.replace(new RegExp('\\b' + className + '\\b'), '');
		},
		init: function () {
			var _this = this;
			//获取组件元素、图片容器元素、图片元素
			this.carousel = document.getElementById(this.carouselId);
			this.main = document.getElementById(this.mainId);
			this.main.img = this.main.getElementsByTagName('img');

			this.carouselStyle = this.carousel.style;
			this.mainStyle = this.main.style;

			this.items = this.main.children;
			this.total = this.main.children.length;

			this.prevIndex = 0;
			this.currIndex = 0;

			this.interval = null;

			this.addClass(this.carousel, 'carousel');
			this.addClass(this.main, 'carousel-main');

		},
		loaded: function() {

		},
		resize: function() {
			var _this = this;
			var firstImg = this.main.img[0];

			if (this.width) {
				Array.prototype.forEach.call(this.main.img, function(v) {
					v.width = _this.width;
					v.onload = function() {
						this.width = _this.width;
					};
				});

				this.carouselStyle.width = this.width + 'px';
			} else {
				this.carouselStyle.width = firstImg.width + 'px';
			}

			this.mainStyle.height = this.carouselStyle.height = firstImg.height + 'px';
			firstImg.onload = function() {
				_this.mainStyle.height = _this.carouselStyle.height = this.height + 'px';
			};
		},
		create: function() {
			var _this = this;

			switch (this.type) {
				case 'fade':
					Array.prototype.forEach.call(this.main.children, function(v) {
						v.style.opacity = '0';
						v.style.transformDuration = '1s';
					});
					this.main.children[0].style.opacity = '1';
					break;
				case 'wrap':
					var first = this.items[0].cloneNode(true);
					var last = this.items[this.total - 1].cloneNode(true);

					this.main.insertBefore(last, this.items[0]);
					this.main.appendChild(first);

					Array.prototype.map.call(_this.main.children, function(v, i) {
						v.style.left = _this.main.offsetWidth * (i - 1) + 'px';
						return v;
					});
					this.main.style.transformDuration = '1s';
					break;
			}

			//创建slider类按钮，并设置css
			function createBtn() {
				var a = document.createElement('a');
				a.href = 'javascript:;';
				a.style.position = 'absolute';
				a.style.top = '50%';
				a.style.padding = '20px 10px';
				a.style.color = 'white';
				a.style.backgroundColor = _this.btnColor;
				a.style.display = 'block';
				a.style.zIndex = '10';
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
				clearInterval(_this.interval);
				_this.start();
				_this.prev();
			};
			next.onclick = function () {
				clearInterval(_this.interval);
				_this.start();
				_this.next();
			};
			
			this.carousel.appendChild(prev);
			this.carousel.appendChild(next);

			/*————————————————————————————————*/

			//创建Marker类按钮
			function createMarker() {
				var a = document.createElement('a');
				a.href = 'javascript:;';
				a.style.width = '20px';
				a.style.height = '20px';
				a.style.color = '#fff';
				a.style.borderRadius = '50%';
				a.style.backgroundColor = _this.markerNormalColor;
				a.style.display = 'inline-block';
				return a;
			}

			var marker, i, len, nav;

			//创建nav按钮容器
			nav = document.createElement('div');
			nav.className = 'carousel-ctrl-nav';
			nav.style.position = 'absolute';
			nav.style.bottom = '2%';
			nav.style.width = '100%';
			nav.style.textAlign = 'center';
			nav.style.zIndex = '10';

			//设置各自的按钮编号，用以跳转该图片
			for (i = 0, len = this.total; i < len; ++i) {
				marker = createMarker();
				marker.onclick = function (idx) {
					return function() {
						clearInterval(_this.interval);
						_this.start();
						_this.skip(idx);
					};
				}(i);
				nav.appendChild(marker);
			}

			this.carousel.appendChild(nav);

			this.markerNumber = nav.children;
			this.mark();
		},
		start: function () {
			var _this = this;
			this.interval = setInterval(function () {
				_this.next();
			}, this.timeout);
		},
		mark: function () {
			this.markerNumber[this.prevIndex].style.backgroundColor = this.markerNormalColor;
			this.markerNumber[this.currIndex].style.backgroundColor = this.markerActiveColor;
		},
		skip: function (index) {	//跳转函数
			this.currIndex = index;
			this.loop();
		},
		prev: function () {			//上一个
			this.currIndex --;
			this.loop();
		},
		next: function() {			//下一个
			this.currIndex ++;
			this.loop();
		},
		loop: function () {		//判断是否到达队尾或队首，根据情况直接跳转（去掉动画过程做到无缝连接）
			switch (this.type) {
				case 'wrap':
					this.mainStyle.transform = 'translate3d(' + (- this.currIndex * this.main.offsetWidth) + 'px, 0, 0)';
					this.mainStyle.transitionDuration = '1s';

					if (this.currIndex === this.total) {
						this.mainStyle.transform = 'translate3d(' + this.main.offsetWidth + 'px, 0, 0)';
						this.mainStyle.transitionDuration = '0s';
						this.mainStyle.transform = 'translate3d(' + this.main.offsetWidth * 0 + 'px, 0, 0)';
						this.mainStyle.transitionDuration = '1s';
					} else if (this.currIndex === -1) {
						this.mainStyle.transform = 'translate3d(' + (- this.total) * this.main.offsetWidth + 'px, 0, 0)';
						this.mainStyle.transitionDuration = '0s';
						this.mainStyle.transform = 'translate3d(' + (- this.total + 1) * this.main.offsetWidth + 'px, 0, 0)';
						this.mainStyle.transitionDuration = '1s';
					}

					this.currIndex = this.currIndex < 0 ? this.total - 1 : this.currIndex % this.total;
					this.mark();
					this.prevIndex = this.currIndex;
					break;

				case 'fade':
					this.currIndex = this.currIndex < 0 ? this.total - 1 : this.currIndex % this.total;

					this.items[this.prevIndex].style.opacity = '0';
					this.items[this.currIndex].style.opacity = '1';

					this.mark();
					this.prevIndex = this.currIndex;
					break;
			}
			this.mark();
		}
	};

	window.addCarousel = addCarousel;
	return addCarousel;
})();