import 'css/home.css'
import addCarousel from 'app/utils/Carousel'

{
	{
		let ctrl = document.getElementById('tab-ctrl')
		let sliderContainer = document.getElementById('tab-slider-container')

		let ctrlItems = ctrl.children
		let sliderItemWidth = sliderContainer.children[0].clientWidth


		Array.prototype.forEach.call(ctrlItems, (v, i) => {
			v.onmouseover = function () {
				ctrl.querySelector('.tab-selected').className = ''
				this.className += 'tab-selected'
				sliderContainer.style.marginLeft = -sliderItemWidth * i + 'px'
			}
		})
	}
	Array.prototype.forEach.call(document.getElementById('carousel-fade-main').children, (el) => {
		el.style.backgroundColor = `#${parseInt(4095 * Math.random()).toString(16)}`
	})
	//
	// addCarousel({
	// 	carouselId: 'carousel-wrap',
	// 	mainId: 'carousel-wrap-main',
	// 	type: 'wrap'
	// })

	addCarousel({
		carouselId: 'carousel-fade',
		mainId: 'carousel-fade-main',
		type: 'wrap',
		timeout: 1000
	})
}
