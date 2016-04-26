import Sprite from './Sprite';
import Emitter from './Emitter';
import setting from '../setting';

export default
class Player extends Sprite {
	constructor(img, cx, cy, config, explosion) {
		super(img, config, explosion);

		super.move(cx, cy);
		super.resize(0.8);


		const EmitterConfig = setting.Emitter[0]; //type[1]
		this.HP = config.HP;
		this.emitter = {
			speed: EmitterConfig.speed,
			num: EmitterConfig.number,
			limit: EmitterConfig.limit,
			timeout: EmitterConfig.timeout,
			type: EmitterConfig.type,
			spacing: 100,
			dist: 0
		};
	}
	fire(tree) {
		this.emitter.dist += this.emitter.speed;
		if (this.emitter.dist < this.spacing) { //当间距达到了限定值才允许射击
			return;
		} else {
			this.emitter.dist = 0;
		}

		let blt = new Emitter(this.cx, this.cy, setting.Emitter[0]);
		blt.owner = 'player';

		blt.set(1, -this.emitter.speed, this.emitter.type);

		tree.insert(blt);
	}
	hit() {
		this.HP--;
	}
	ceasefire() {
		this.fire = new Function();
	}
}