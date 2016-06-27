let lastTime = 0

;['ms', 'moz', 'webkit', 'o'].forEach((v) => {
	window.requestAnimationFrame = window[v + 'RequestAnimationFrame']
	window.cancelAnimationFrame = window[v + 'CancelRequestAnimationFrame']
})

if (!window.requestAnimationFrame)
	window.requestAnimationFrame = function(callback) {
		let currTime = new Date().getTime()
		let timeToCall = Math.max(0, 16 - (currTime - lastTime))
		let id = window.setTimeout(function() {
			callback(currTime + timeToCall)
		}, timeToCall)
		lastTime = currTime + timeToCall
		return id
	}
if (!window.cancelAnimationFrame)
	window.cancelAnimationFrame = function(id) {
		clearTimeout(id)
	}
