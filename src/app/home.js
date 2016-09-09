import 'css/home.css'
import addCarousel from 'app/utils/Carousel.js'

{
	{
		let ctrl = document.getElementById('tab-ctrl')
		let sliderContainer = document.getElementById('tab-slider-container')

		let ctrlItems = ctrl.children
		let sliderItemWidth = sliderContainer.children[0].clientWidth


		Array.prototype.forEach.call(ctrlItems, (v, i) => {
			v.onmouseover = function() {
				ctrl.querySelector('.tab-selected').className = ''
				this.className += 'tab-selected'
				sliderContainer.style.marginLeft = -sliderItemWidth * i + 'px'
			}
		})
	}

	addCarousel({
		selector: {
			carouselId: 'carousel-fade',
			containerId: 'carousel-fade-container'
		},
		type: 'wrap',
		timeout: '50000'
	})

	// addCarousel({
	// 	selector: {
	// 		carouselId: 'carousel-wrap',
	// 		containerId: 'carousel-wrap-container'
	// 	},
	// 	type: 'fade',
	// 	timeout: 5000
	// })
}
