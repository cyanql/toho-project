import Sprite from './Sprite'
import Bullet from './BulletSprite'
import setting from '../setting'

export default
class Player extends Sprite {
	constructor(img, cx, cy, config) {
		super(img, config)

		super.move(cx, cy)
		super.resize(0.1)

		const EmitterConfig = setting.Emitter[0] //type[1]
		this.HP = config.HP
		this.emitter = {
			img: img,
			speed: EmitterConfig.speed,
			num: EmitterConfig.number,
			limit: EmitterConfig.limit,
			timeout: EmitterConfig.timeout,
			propulsiontype: EmitterConfig.propulsiontype,
			type: EmitterConfig.type,
			spacing: 100,
			dist: 0
		}
	}
	fire(tree) {
		this.emitter.dist += this.emitter.speed
		if (this.emitter.dist < this.emitter.spacing) { //当间距达到了限定值才允许射击
			return
		} else {
			this.emitter.dist = 0
		}

		let blt = new Bullet(this.img, this.cx, this.cy, setting.Emitter[0])
		blt.owner = 'player'

		blt.set(1, -this.emitter.speed, this.emitter.propulsiontype)

		tree.insert(blt)
	}
	hit() {
		this.HP--
	}
	ceasefire() {
		this.fire = new Function()
	}
}
