let lastTime = 0

const vendors = ['ms', 'moz', 'webkit', 'o']
for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
	window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
								window[vendors[x] + 'CancelRequestAnimationFrame']
}

if (!window.requestAnimationFrame) {
	alert('由于您的浏览器不支持requestAnimationFrame方法，可能会出现画面渲染不稳定的情况')
	window.requestAnimationFrame = function(callback) {
		let currTime = new Date().getTime()
		let timeToCall = Math.max(0, 16 - (currTime - lastTime))
		let id = window.setTimeout(function() {
			callback(currTime + timeToCall)
		}, timeToCall)
		lastTime = currTime + timeToCall
		return id
	}
}

if (!window.cancelAnimationFrame)
	window.cancelAnimationFrame = function(id) {
		clearTimeout(id)
	}
