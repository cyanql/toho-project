import Rect from './Rect';
import Explosion from './ExplosionSprite';
import Anime from '../lib/anime';

export default
class Sprite extends Rect {
	constructor(img, config, explosion) { //初始化映射目标，映射坐标，映射宽高	orignX, orignY, width, height
		super(0, 0, config.orignWidth, config.orignHeight);

		Object.assign(this, {
			img: img,
			orignX: config.orignX,
			orignY: config.orignY,
			orignWidth: config.orignWidth,
			orignHeight: config.orignHeight,
			mapX: config.orignX,
			mapY: config.orignY,
			mapWidth: config.orignWidth,
			mapHeight: config.orignHeight,
			removed: false,
			undead: false,
			explosion
		});
	}

	draw(ctx) {
		ctx.drawImage(this.img, this.orignX, this.orignY, this.orignWidth, this.orignHeight, this.cx - this.mapWidth / 2, this.cy - this.mapHeight / 2, this.mapWidth, this.mapHeight);
	}
	change(index) {
		this.orignX = Math.round(index * this.orignWidth);
	}
	remap(per) {
		this.mapWidth *= per;
		this.mapHeight *= per;
	}
	name(name) { //测试
		this.name = name;
	}
	go() {

	}
	destroy() {
		let exp = new Explosion(this.img, this.cx, this.cy, this.explosion);
		exp.undead = true;
		Anime(exp, 0, 15, 75);
		this.removed = true;
	}
}
