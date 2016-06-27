import Sprite from './Sprite'

export default
class Bullet extends Sprite {
	constructor(img, cx, cy, config) {
		super(img, config)

		super.move(cx, cy)

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
	motion(distX, distY) {
		this.cx += distX
		this.cy += distY
		this.x += distX
		this.y += distY
	}
	gravity() {
		this.cy += 5
		this.y += 5
	}
	line (distX, distY) {
		this.motion(distX, distY)
	}
	circle(angle, dist) {
		let distX = Math.round(Math.sin(angle) * dist)
		let distY = Math.round(Math.cos(angle) * dist)
		//this.gravity()
		this.motion(distX, distY)
	}
	test(angle, dist) {
		let distX = Math.round(Math.sin(angle) * dist)
		let distY = Math.round(Math.sqrt(dist))
		//let distY = -Math.round(Math.log(distX))
		this.motion(distX, distY)
	}
}
