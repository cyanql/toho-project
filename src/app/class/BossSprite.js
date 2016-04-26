import Sprite from './Sprite';
import Emitter from './Emitter';
import setting from '../setting';

function rand(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

class Boss extends Sprite {
	constructor(img, cx, cy, config, explosion) {
		super(img, config, explosion);

		const EmitterConfig = setting.Emitter[2];
		
		super.remap(2.5);
		super.resize(2);
		super.move(cx, cy);
		super.name('BossSprite');

		this.HP = config[4];
		this.dist = 0;
		this.fireTimes = 0;
		this.fireSwitch = true;
		this.emitter = {
			main: new Emitter(super.cx, super.cy),
			speed: EmitterConfig.speed,
			num: EmitterConfig.number,
			limit: EmitterConfig.limit,
			spacing: EmitterConfig.spacing,
			timeout: EmitterConfig.timeout,
			type: EmitterConfig.type
		};
	}
	setEmitter(Emitter) {
		this.emitter.main = Emitter;
	}
	fire(tree) {
		if (!this.fireSwitch)
			return;
		this.emitter.dist += this.emitter.speed;

		if (this.emitter.dist < this.emitter.spacing) {			//当间距达到了限定值才允许射击
			return;
		} else {
			this.emitter.dist = 0;
		}

		const EmitterConfig = setting.Emitter[rand(1, setting.Emitter.length)];	//type[0]
		if (this.fireTimes > this.emitter.limit) {		//当开火次数到一轮攻击的上限，关闭开火阀门，两秒后打开
			this.setEmitter(EmitterConfig);
			setTimeout(function () {
				this.fireSwitch = true;
			},this.timeout);
			return;
		} else {
			this.fireTimes++;
		}
		this.emitter[this.type](EmitterConfig, tree);
	}
	ceasefire() {
		this.fire = new Function();
	}
	hit() {
		this.HP--;
	}
}

