import Bullet from './BulletSprite'

export default
class Emitter {
	constructor(img, cx, cy) {
		this.img = img
		this.cx = cx
		this.cy = cy
	}
	circle(emitterConfig, tree) {
		let number, speed, propulsiontype, angle, blt

		number = emitterConfig.number	//9
		speed = emitterConfig.speed	//15
		propulsiontype = emitterConfig.propulsiontype

		for (let i = 1; i < number + 1; ++i) {
			angle = Math.PI * 2 * i / number

			blt = new Bullet(this.img, this.cx, this.cy, emitterConfig)
			blt.owner = 'enemy'
			blt.set(angle, speed, propulsiontype)
			tree.insert(blt)
		}
	}
}
