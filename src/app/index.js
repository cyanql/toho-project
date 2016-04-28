import '../css/index.css';
import './lib/Carousel.js';

{
	{
		let ctrl = document.getElementById('tab-ctrl');
		let sliderContainer = document.getElementById('tab-slider-container');

		let ctrlItems = ctrl.children;
		let sliderItemWidth = sliderContainer.children[0].clientWidth;

		for (let i = 0, len = ctrlItems.length; i < len; i++) {
			ctrlItems[i]['data-index'] = i;
			ctrlItems[i].onmouseover = function () {
				ctrl.querySelector('.tab-selected').className = '';
				this.className += 'tab-selected';
				sliderContainer.style.marginLeft = -sliderItemWidth * this['data-index'] + 'px';
			};
		}
	}

	addCarousel({
		carouselId: 'carousel-wrap',
		mainId: 'carousel-wrap-main',
		type: 'wrap'
	});
	addCarousel({
		carouselId: 'carousel-fade',
		mainId: 'carousel-fade-main',
		type: 'fade',
		timeout: 5000
	});
}