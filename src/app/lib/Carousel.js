/*******/
~(function() {
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
			carouselID : 'carousel',		//组件id
			mainID : 'carousel-main',		//组件-图片容器id
			type : 'wrap',
			timeout : 3000,
			direction: 'left',
			btnColor: '#cf1132',
			markerActiveColor: '#cf1132',
			markerNormalColor: '#333'
		}, custom);
	}
	var cn = 'main';

	'main'.match(new RegExp('^ ?' + cn + ' ?$'));

	Carousel.prototype = {
		hasClass: function(elem, className) {
			return elem.className.match(new RegExp('\\b' + className + '\\b'));
		},
		addClass: function(elem, className) {
			if (!this.hasClass(elem, className)) {
				elem.className = elem.className.split(' ').concat(className).join(' ');
			}
		},
		removeClass: function(elem, className) {
			if (this.hasClass(elem, className)) {
				elem.className = elem.className.replace(new RegExp('\\b' + className + '\\b'), '');
			}
		},
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

			//获取第一张图的高度并初始化carousel的高度，回调防止图片未加载
			var mainStyle = this.main.style;
			var firstImg = this.main.img[0];
			mainStyle.height = firstImg.height + 'px';
			mainStyle.width = firstImg.width + 'px';
			firstImg.onload = function() {
				mainStyle.height = this.height + 'px';
				mainStyle.width = this.width + 'px';
			};
			this.mainStyle = mainStyle;

			this.items = Array.prototype.map.call(this.main.children, function(v) {
				return v;
			});

			this.total = this.items.length;

			this.prevIndex = 0;
			this.currIndex = 0;

			this.interval = null;

			this.addClass(this.carousel, 'carousel');
			this.addClass(this.main, 'carousel-main');

			switch (this.type) {
				case 'fade':
					Array.prototype.forEach.call(this.main.children, function(v) {
						v.style.opacity = '0';
					});
					this.main.children[0].style.opacity = '1';
					break;
				case 'wrap':
					this.items[this.currIndex].style.transform = 'translate3d(0, 0 ,0)';
					this.items[this.currIndex + 1].style.transitionDuration = '0s';
					this.items[this.currIndex + 2].style.transitionDuration = '0s';
					this.items[this.currIndex + 1].style.transform = 'translate3d(' + this.main.offsetWidth + 'px, 0 ,0)';
					this.items[this.currIndex + 2].style.transform = 'translate3d(' + (-this.main.offsetWidth) + 'px, 0 ,0)';
					break;
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
					var nextIndex;
					if (this.currIndex > this.prevIndex) {
						this.currIndex %= this.total;
						nextIndex = (this.currIndex + 1) % this.total;
					} else {
						this.currIndex = this.currIndex < 0 ? this.total - 1: this.currIndex;
						nextIndex = this.currIndex - 1 < 0 ? this.total - 1 : this.currIndex - 1;
					}


					this.items[this.prevIndex].style.transform = 'translate3d(-100%, 0 ,0)';
					this.items[this.prevIndex].style.transitionDuration = '1s';
					this.items[this.currIndex].style.transform = 'translate3d(0, 0 ,0)';
					this.items[this.currIndex].style.transitionDuration = '1s';
					this.items[nextIndex].style.transform = 'translate3d(100%, 0 ,0)';
					this.items[nextIndex].style.transitionDuration = '0s';

					this.currIndex %= this.total;
					this.mark();
					this.prevIndex = this.currIndex;
					break;

				case 'fade':
					this.currIndex = this.currIndex < 0 ? this.total - 1: this.currIndex % this.total;

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