export default
class Emitter {
	constructor(cx, cy) {
		this.cx = cx;
		this.cy = cy;
	}
	circle(EmitterConfig, tree) {
		let cx, cy, number, speed, propulsiontype, angle, blt;

		cx = this.cx;
		cy = this.cy;
		number = EmitterConfig.number;	//9
		speed = EmitterConfig.speed;	//15
		propulsiontype = EmitterConfig.propulsiontype;

		for (let i = 1; i < number + 1; i++) {
			angle = Math.PI * 2 * i / number;

			blt = new Emitter(cx, cy, EmitterConfig);
			blt.owner = 'boss';
			blt.set(angle, speed, propulsiontype);
			tree.insert(blt);
		}
	}
}