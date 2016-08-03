/*******/
!(function() {

	function hasClass(elem, className) {
		return elem.className.indexOf(className) > -1;
	}

	function addClass(elem, className) {
		if (!hasClass(elem, className)) {
			elem.className = elem.className.split(' ').concat(className).join(' ');
		}
	}

	function removeClass(elem, className) {
		elem.className = elem.className.replace(new RegExp('\\b' + className + '\\b'), '');
	}

	function addCarousel(custom) {
		var temp = new Carousel(custom);
		temp.init();
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
		init: function () {
			//获取组件元素、图片容器元素、图片元素
			this.carousel = document.getElementById(this.carouselId);
			this.main = document.getElementById(this.mainId);

			this.prevIndex = 0;
			this.currIndex = 0;

			this.interval = null;

			addClass(this.carousel, 'carousel');
			addClass(this.main, 'carousel-main');

		},
		create: function() {
			var _this = this;
			var items = this.main.children
			var total = items.length;

			switch (this.type) {
				case 'fade':
					Array.prototype.forEach.call(this.main.children, function(v) {
						v.style.opacity = '0';
						v.style.transformDuration = '1s';
					});
					this.main.children[0].style.opacity = '1';
					break;
				case 'wrap':
					var first = items[0].cloneNode(true);
					var last = items[total - 1].cloneNode(true);

					this.main.insertBefore(last, items[0]);
					this.main.appendChild(first);

					Array.prototype.map.call(this.main.children, function(v, i) {
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
			for (i = 0, len = total; i < len; ++i) {
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

			this.markerElement = nav.children;
			this.mark();
		},
		start: function () {
			var _this = this;
			this.interval = setInterval(function () {
				_this.next();
			}, this.timeout);
		},
		mark: function () {
			this.markerElement[this.prevIndex].style.backgroundColor = this.markerNormalColor;
			this.markerElement[this.currIndex].style.backgroundColor = this.markerActiveColor;
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
			var items = this.main.children;
			var total = items.length - 2;
			var main = this.main;
			var mainStyle = main.style;

			this.loop = function() {
				switch (this.type) {
					case 'wrap':
						mainStyle.transform = 'translate3d(' + (- this.currIndex * main.offsetWidth) + 'px, 0, 0)';
						mainStyle.transitionDuration = '1s';

						if (this.currIndex === total) {
							mainStyle.transform = 'translate3d(' + main.offsetWidth + 'px, 0, 0)';
							mainStyle.transitionDuration = '0s';
							mainStyle.transform = 'translate3d(' + main.offsetWidth * 0 + 'px, 0, 0)';
							mainStyle.transitionDuration = '1s';
						} else if (this.currIndex === -1) {
							mainStyle.transform = 'translate3d(' + (- total) * main.offsetWidth + 'px, 0, 0)';
							mainStyle.transitionDuration = '0s';
							mainStyle.transform = 'translate3d(' + (- total + 1) * main.offsetWidth + 'px, 0, 0)';
							mainStyle.transitionDuration = '1s';
						}

						this.currIndex = this.currIndex < 0 ? total - 1 : this.currIndex % total;
						this.mark();
						this.prevIndex = this.currIndex;
						break;

					case 'fade':
						this.currIndex = this.currIndex < 0 ? total - 1 : this.currIndex % total;

						items[this.prevIndex].style.opacity = '0';
						items[this.currIndex].style.opacity = '1';

						this.mark();
						this.prevIndex = this.currIndex;
						break;
				}
				this.mark();
			}
		}
	};

	window.addCarousel = addCarousel;
	try {
		module.exports = addCarousel
	} catch(err) {
		console.error(err)
	}
	return addCarousel;
})();
