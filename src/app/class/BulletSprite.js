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

		/*const dxy = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
		const dy = Math.sin(this.angle) * dxy
		const dx = dy / Math.tan((Math.PI / 2 - this.angle) / 2)*/
}
