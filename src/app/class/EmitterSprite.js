import Sprite from './Sprite'
import Bullet from './BulletSprite'

export default
class EmitterSprite extends Sprite {
	bulletOpts = {
		orignX: 36,					//子弹的原始坐标
		orignY: 64,
		orignWidth: 6,				//子弹的原始宽高
		orignHeight: 14
	}
	speed = 20					//子弹速度
	number = 15					//一次发射的子弹数量
	limit = 5					//一轮攻击发射的次数限制
	dist = 0					//当前发射的子弹推进的距离
	spacing = 100				//一轮攻击每次发射的间隔
	timeout = 500				//每轮攻击的间隔
	propulsiontype = 'line'		//子弹推进的类型
	type = 'circle'				//发射器的类型
	fireTimes = 0				//当前开火次数
	fireSwitch = true			//开火开关

	constructor(img, cx, cy, opts) {
		super(img, cx, cy, opts)
		this.init(opts)
	}

	init(opts) {
		Object.assign(this, opts)
	}

	circle(tree) {
		let angle, blt

		for (let i = 0; i < this.number; ++i) {
			angle = Math.PI * 2 * i / this.number

			blt = new Bullet(this.img, this.cx, this.cy, this.bulletOpts)
			blt.set(angle, this.speed, this.propulsiontype)
			tree.insert(blt)
		}
	}

	fire(tree, test) {
		if (!this.fireSwitch) {
			return this.onCeasefireInterval()
		}

		if (this.dist < this.spacing) {			//当间距达到了限定值才允许射击
			return this.dist += this.speed
		} else {
			this.dist = 0
		}
		if (this.fireTimes > this.limit) {		//当开火次数到一轮攻击的上限，关闭开火阀门，两秒后打开
			this.fireTimes = 0
			this.ceasefire()
			this.onCeasefire()
			return setTimeout(() => {
				this.fireSwitch = true
			}, this.timeout)
		} else {
			this.fireTimes++
		}
		this[this.type](tree)
	}

	ceasefire() {
		this.fireSwitch = false
	}

	//停火期间持续调用
	onCeasefireInterval() {}

	onCeasefire() {}
}
