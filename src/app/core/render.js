export default
class Render {
	canvas = null
	ctx = null
	renderWidth = 0
	renderHeight = 0
	queue = []

	init(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')
		this.renderWidth = canvas.width
		this.renderHeight = canvas.height
	}
	add(item) {
		this.queue = this.queue.concat(item)
	}
	empty() {
		this.queue = []
	}
	clear() {
		this.ctx.clearRect(0, 0, this.renderWidth, this.renderHeight)
	}
	render() {
		this.queue.forEach(item => {
			item.go()
			item.draw(this.ctx)
		})
	}
}
