import 'css/index.css'
import 'app/utils/Carousel.js'

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

	addCarousel({
		carouselId: 'carousel-wrap',
		mainId: 'carousel-wrap-main',
		type: 'wrap'
	})

	addCarousel({
		carouselId: 'carousel-fade',
		mainId: 'carousel-fade-main',
		type: 'fade',
		timeout: 5000
	})
}
