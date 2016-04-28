import Sprite from './Sprite';
import Emitter from './Emitter';
import setting from '../setting';

function rand(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

export default
class Boss extends Sprite {
	constructor(img, cx, cy, config) {
		super(img, config);

		const emitterConfig = setting.Emitter[2];

		this.emitterConfig = emitterConfig;
		
		super.remap(2.5);
		super.resize(2);
		super.move(cx, cy);

		this.HP = config.HP;
		this.emitter = {
			main: new Emitter(img, cx, cy),
			speed: emitterConfig.speed,
			num: emitterConfig.number,
			limit: emitterConfig.limit,
			spacing: emitterConfig.spacing,
			timeout: emitterConfig.timeout,
			type: emitterConfig.type,
			dist: 0
		};
		this.fireTimes = 0;
		this.fireSwitch = true;
	}
	setEmitter(emitterConfig) {
		Object.assign(this.emitter, emitterConfig);
	}
	fire(tree) {
		if (!this.fireSwitch)
			return;

		if (this.emitter.dist < this.emitter.spacing) {			//当间距达到了限定值才允许射击
			return this.emitter.dist += this.emitter.speed;
		} else {
			this.emitter.dist = 0;
		}

		if (this.fireTimes > this.emitter.limit) {		//当开火次数到一轮攻击的上限，关闭开火阀门，两秒后打开
			this.emitterConfig = setting.Emitter[rand(1, setting.Emitter.length)];	//type[0]
			this.setEmitter(this.emitterConfig);
			this.fireTimes = 0;
			this.fireSwitch = false;
			return setTimeout(() => {
				this.fireSwitch = true;
			},this.emitter.timeout);
		} else {
			this.fireTimes++;
		}
		this.emitter.main[this.emitter.type](this.emitterConfig, tree);
	}
	ceasefire() {
		this.fire = new Function();
	}
	hit() {
		this.HP--;
	}
}

