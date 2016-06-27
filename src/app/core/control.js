export default
class Control {
	startPos = {
		x: 0,
		y: 0
	}
	movePos = {
		x: 0,
		y: 0
	}
	eventTypeList = []
	callbackList = []
	addHandler(element, type, Func) {
		if (element.addEventListener)
			element.addEventListener(type, Func, false)
		else if (element.attachEvent)
			element.attachEvent('on' + type, Func)
		else
			element['on' + type] = Func
	}

	init(element) {
		element = element || document
		const start = 'ontouchstart' in document ? 'touchstart' : 'mousedown'
		const move = 'ontouchmove' in document ? 'touchmove' : 'mousemove'
		const end = 'ontouchend' in document ? 'touchend' : 'mouseup'
		const startFunc = (ev) => {
			ev = ev || window.event
			const pos = 'ontouchstart' in document ? ev.touches[0] : ev
			this.startPos = {
				'x': pos.pageX,
				'y': pos.pageY
			}
			this.movePos = this.startPos
		}
		const moveFunc = (ev) => {
			ev = ev || window.event
			const pos = 'ontouchstart' in document ? ev.touches[0] : ev
			this.movePos = {
				'x': pos.pageX,
				'y': pos.pageY
			}
			ev.preventDefault()
		}
		const endFunc = (ev) => {
			ev = ev || event
			this.eventTypeList.forEach((v, i) => {
				this.event[v](this.callbackList[i].cb, this, ev)
			})
		}
		this.addHandler(element, start, startFunc)
		this.addHandler(element, move, moveFunc)
		this.addHandler(element, end, endFunc)
	}

	on(event, callback) {
		this.eventTypeList.push(event)
		this.callbackList.push({
			cb: callback
		})
		return this
	}

	event = {
		tap(callback, _this, ev) {
			//if (_this.movePose)
			if (Math.abs(_this.movePos.x - _this.startPos.x) > 1 || Math.abs(_this.movePos.y - _this.startPos.y) > 1)
				return
			callback(ev)
		},
		swipe(callback, _this, ev) {
			//if (!_this.movePose) return
			callback(ev)
			return _this.movePos = {
				x: 0,
				y: 0
			}
		}
	}
}
