export default
class Loader {
	layer = null
	loaded = true
	loadedCount = 0
	totalCount = 0
	soundFileExtn = '.ogg'

	init(layer) {
		let mp3Support, oggSupport
		const audio = document.createElement('audio')
		if (audio.canPlayType) {
			mp3Support = '' != audio.canPlayType('audio/mpeg')
			oggSupport = '' != audio.canPlayType('audio/ogg; codecs = "vorbis"')
		} else {
			mp3Support = false
			oggSupport = false
		}
		this.soundFileExtn = oggSupport ? '.ogg' : mp3Support ? '.mp3' : undefined
		this.layer = layer
	}

	onload() {}

	itemLoaded() {
		this.loadedCount++
		if (this.loadedCount === this.totalCount) {
			this.loaded = true
			this.layer.style.display = 'none'
			if (this.onload) {
				this.onload()
				this.onload = undefined
			}
		}
	}

	loadImage(url) {
		this.totalCount++
		this.loaded = false
		this.layer.style.display = 'block'

		const img = new Image()
		img.src = url
		img.onload = () => this.itemLoaded()
		return img
	}

	loadSound(url) {
		this.totalCount++
		this.loaded = false
		this.layer.style.display = 'block'
		const audio = new Audio()
		audio.src = url + this.soundFileExtn
		audio.addEventListener('canplaythrough', this.itemLoaded, false)
		return audio
	}
}
