/*******/
!(function() {
	function addCarousel(custom) {
		var temp = new Carousel(custom)
		temp.start()
		return temp
	}
	function Carousel(customOpts) {
		if (!customOpts) return alert('请填写目标元素id和按钮容器id')

		this.initData(customOpts)
		this.initElement()
		this.initEvent()
	}

	const Util = {
		extend(opts, custom){
			Object.keys(custom).forEach(v => {
				opts[v] = custom[v]
			})
		},
		hasClass(el, className) {
			return el.className.match(new RegExp('\\b' + className + '\\b'))
		},
		addClass(el, className) {
			if (!this.hasClass(el, className)) {
				el.className = el.className.split(' ').concat(className).join(' ')
			}
		},
		removeClass(el, className) {
			el.className = el.className.replace(new RegExp('\\b' + className + '\\b'), '')
		},
		getStyleValue(el, props) {
			return window.getComputedStyle(el, null).getPropertyValue(props)
		}
	}

	const DOM = {
		//创建slider类按钮，并设置css
		createBtn(opts) {
			const a = document.createElement('a')
			a.href = 'javascript:;'
			a.style.position = 'absolute'
			a.style.top = '50%'
			a.style.padding = '20px 10px'
			a.style.color = 'white'
			a.style.backgroundColor = opts.backgroundColor
			a.style.display = 'block'
			a.style.zIndex = '10'
			return a
		},
		//创建Marker类按钮
		createMarker(opts) {
			var a = document.createElement('a')
			a.href = 'javascript:;'
			a.style.width = '20px'
			a.style.height = '20px'
			a.style.color = '#fff'
			a.style.borderRadius = '50%'
			a.style.backgroundColor = opts.backgroundColor
			a.style.display = 'inline-block'
			return a
		},
		//创建nav按钮容器
		createNav() {
			var div = document.createElement('div')
			div.className = 'carousel-ctrl-nav'
			div.style.position = 'absolute'
			div.style.bottom = '2%'
			div.style.width = '100%'
			div.style.textAlign = 'center'
			div.style.zIndex = '10'
			return div
		}
	}

	Carousel.prototype = {
		initData(customOpts) {
			const defaultOpts = {
				selector: {
					carouselId : 'carousel',		//组件id
					containerId : 'carousel-container'		//组件-图片容器id
				},
				type : 'wrap',
				timeout : 3000,
				direction: 'left',
				btnColor: '#cf1132',
				markerActiveColor: '#cf1132',
				markerNormalColor: '#333'
			}
			Util.extend(defaultOpts, customOpts)
			this.options = defaultOpts

			this.timer = null

			this.prevIndex = this.currIndex = 0
		},
		initElement() {
			const {
				options: {
					selector: {
						carouselId,
						containerId
					},
					type,
					btnColor,
					markerNormalColor
				}
			} = this
			const { createBtn, createMarker, createNav } = DOM

			//获取组件元素、图片容器元素、图片元素
			const carousel = document.getElementById(carouselId)
			const container = document.getElementById(containerId)

			Util.addClass(carousel, 'carousel')
			Util.addClass(container, 'carousel-container')

			// 获取容器下的各个面板，并转化为数组
			const panels = Array.prototype.slice.call(container.children)
			const len = panels.length
panels.forEach((v, i) => {
	v.style.backgroundColor = '#' + parseInt(Math.random() * 4096).toString(16)
	v.innerHTML = i
})
			// 根据类型做出不同操作
			switch (type) {
				case 'fade':
					// 初始化子元素
					panels.forEach(v => {
						v.style.opacity = '0'
						v.style.transformDuration = '1s'
					})
					panels.shift().style.opacity = '1'
					break
				case 'wrap':
					// 克隆首位和末尾元素
					var first = panels[0].cloneNode(true)
					var last = panels[len - 1].cloneNode(true)

					// 将末尾元素插入到首位，首位元素插入到末尾
					container.insertBefore(last, panels[0])
					container.appendChild(first)
					panels.unshift(last)
					panels.push(first)

					// 元素初始化
					panels.forEach((v, i) => {
						v.style.left = container.offsetWidth * (i - 1) + 'px'
						// v.style.float = 'left'
						return v
					})
					container.style.transformDuration = '1s'
					break
			}

			/*————————————————————————————————*/

			let prev, next

			//设置各自实例的相关属性和函数
			prev = createBtn({backgroundColor: btnColor})
			next = createBtn({backgroundColor: btnColor})
			prev.style.left = '0'
			next.style.right = '0'
			prev.innerHTML = '<'
			next.innerHTML = '>'

			let marker, markers, nav

			nav = createNav()
			markers = []

			//设置各自的按钮编号，用以跳转该图片
			for (let i = 0; i < len; ++i) {
				marker = createMarker({backgroundColor: markerNormalColor})
				nav.appendChild(marker)
				markers.push(marker)
			}

			carousel.appendChild(prev)
			carousel.appendChild(next)
			carousel.appendChild(nav)

			this.els = {
				carousel,
				container,
				panels,
				prev,
				next,
				markers,
				nav
			}
		},
		initEvent() {
			const {
				els: {
					prev,
					next,
					markers,
					carousel
				}
			} = this

			prev.onclick = () => {
				this.start()
				this.prev()
			}
			next.onclick = () => {
				this.start()
				this.next()
			}

			markers.forEach((v, i) => {
				v.onclick = () => {
					this.start()
					this.skip(i)
				}
			})
		},
		start() {
			if (this.timer) {
				clearTimeout(this.timer)
			}
			this.timer = setTimeout(() => {
				this.next()
			}, this.options.timeout)
		},
		moveMark() {
			this.els.markers[this.prevIndex].style.backgroundColor = this.options.markerNormalColor
			this.els.markers[this.currIndex].style.backgroundColor = this.options.markerActiveColor
		},
		skip (index) {	//跳转函数
			this.prevIndex = this.currIndex
			this.currIndex = index
			this.loop()
		},
		prev() {			//上一个
			this.prevIndex = this.currIndex
			this.currIndex --
			this.loop()
		},
		next() {			//下一个
			this.prevIndex = this.currIndex
			this.currIndex ++
			this.loop()
		},
		isFirst() {
			return this.currIndex === -1
		},
		isLast() {
			return this.currIndex === this.els.panels.length - 2
		},
		loop() {		//判断是否到达队尾或队首，根据情况直接跳转（去掉动画过程做到无缝连接）
			const {
				els: {
					container,
					panels,
					markers
				},
				options: {
					type
				}
			} = this

			const containerStyle = container.style
			const len = markers.length
			const offsetWidth = container.offsetWidth

			switch (type) {
				case 'wrap':
					this.loop = () => {
						if (this.toFirst) {
							const matrix = Util.getStyleValue(container, 'transform').split(',')
							// const x = (Number(matrix[4]) + (len - 1) * offsetWidth).toFixed(2)
							const x = (Number(matrix[4]) + len * offsetWidth).toFixed(2)
							Object.assign(containerStyle, {
								transitionDuration: '0s',
								transform: 'translate3d(' + x + 'px, 0, 0)'
							})
						} else if (this.toLast) {
							const matrix = Util.getStyleValue(container, 'transform').split(',')
							// const x = (Number(matrix[4]) - (len - 1) * offsetWidth).toFixed(2)
							const x = (Number(matrix[4]) - len * offsetWidth).toFixed(2)

							Object.assign(containerStyle, {
								transitionDuration: '0s',
								transform: 'translate3d(' + x + 'px, 0, 0)'
							})
						}

						const currIndex = this.currIndex

						if (currIndex === -1) {
							this.toLast = true
							this.toFirst = false
						} else if (currIndex === len) {
							this.toFirst = true
							this.toLast = false
						} else {
							this.toFirst = false
							this.toLast = false
						}


						setTimeout(() => {
							Object.assign(containerStyle, {
								transitionDuration: '.5s',
								transform: 'translate3d(' + (-currIndex * offsetWidth) + 'px, 0, 0)'
							})
						}, 50)

						this.currIndex = currIndex < 0 ? len - 1 : currIndex % len

						this.moveMark()
					}
					break

				case 'fade':
					this.loop = () => {
						this.currIndex = this.currIndex < 0 ? len - 1 : this.currIndex % len

						panels[this.prevIndex].style.opacity = '0'
						panels[this.currIndex].style.opacity = '1'

						this.moveMark()
					}
					break

				default:
					throw new Error('type should be wrap or fade')
			}
		}
	}

	if (typeof module !== 'undefined') {
		module.exports = addCarousel
	}
	window.addCarousel = addCarousel
	return addCarousel
})()
var div = document.getElementById('carousel-fade-container')
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(v => {
		console.log(v.target.style.cssText)
	})
})

observer.observe(div, { attributes : true, attributeFilter : ['style'] })
