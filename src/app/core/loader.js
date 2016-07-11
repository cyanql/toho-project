export default
class Loader {
	el = null
	loaded = true
	loadedCount = 0
	totalCount = 0
	soundFileExtn = '.ogg'
	progress = 0

	init(el) {
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
		this.el = el
	}

	onLoadAll() {}

	itemLoaded() {
		this.loadedCount++
		this.el.innerHTML = `(${this.loadedCount}/${this.totalCount})`
		if (this.loadedCount === this.totalCount) {
			this.loaded = true
			this.onLoadAll()
		}
	}

	loadImage(url) {
		this.totalCount++
		this.loaded = false

		const img = new Image()
		img.src = url
		img.onload = () => this.itemLoaded()
		return img
	}

	loadSound(url) {
		this.totalCount++
		this.loaded = false
		this.el.style.display = 'block'
		const audio = new Audio()
		audio.src = url + this.soundFileExtn
		audio.addEventListener('canplaythrough', this.itemLoaded, false)
		return audio
	}
}
