import Sprite from './Sprite'

export default
class MagicSprite extends Sprite {
	constructor(img, cx, cy, opts) {
		super(img, cx, cy, opts)
	}

	init(opts) {
		Object.assign(this, opts)
	}

	go() {
		this.angle += Math.PI / 72
	}
}
