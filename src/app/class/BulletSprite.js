import Sprite from './Sprite'

export default
class Bullet extends Sprite {
	constructor(img, cx, cy, opts) {
		super(img, cx, cy, opts)

		Object.assign(this, {
			angle: 0,
			dist: 0,
			propulsiontype: null
		})
	}
	set(angle, dist, propulsiontype) {
		this.angle = angle
		this.dist = dist
		this.propulsiontype = propulsiontype
	}
	go() {
		this[this.propulsiontype](this.angle, this.dist)
	}
	_motion(distX, distY) {
		this.cx += distX
		this.cy += distY
		this.x += distX
		this.y += distY
	}
	_gravity() {
		this.cy += 5
		this.y += 5
	}
	line (distX, distY) {
		this._motion(distX, distY)
	}
	circle(angle, dist) {
		let dx = Math.round(Math.sin(angle) * dist)
		let dy = Math.round(Math.cos(angle) * dist)
		//this._gravity()
		this._motion(dx, dy)
	}
	crosspow(angle, dist) {
		let dx = Math.round(Math.sin(angle) * dist)
		let dy = Math.round(Math.pow(Math.sqrt(dist), 1.5))
		this._motion(dx, dy)
	}
	test(angle, dist) {
		let cx = this.cx + Math.round(Math.sin(angle) * dist)
		let cy = Math.round(Math.pow(this.cy + 1, 1.002))
		this.move(cx, cy)
	}

}
