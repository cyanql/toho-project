import Sprite from './Sprite';

export default
class Explosion extends Sprite {
	constructor(img, cx, cy, config, explosion) {
		super(img, config, explosion);
		super.move(cx, cy);
	}
}