import Sprite from './Sprite';

export default
class Bullet extends Sprite {
	constructor(img, cx, cy, config, explosion) {
		super(img, config, explosion);

		super.move(cx, cy);
		super.name('BulletSprite');

		Object.assign(this, {
			angle: 0,
			dist: 0,
			propulsiontype: null
		});
	}
	set(angle, dist, propulsiontype) {
		this.angle = angle;
		this.dist = dist;
		this.propulsiontype = propulsiontype;
	}
	go() {
		this.propulsion[this.propulsiontype](this.angle, this.dist);
	}
}

Bullet.prototype.propulsion = {
	motion: function(distX, distY) {
		this.cx += distX;
		this.cy += distY;
		this.x += distX;
		this.y += distY;
	},
	gravity: function() {
		this.cy += 5;
		this.y += 5;
	},
	line: function (distX, distY) {
		this.motion(distX, distY);
	},
	circle: function(angle, dist) {
		let distX = Math.round(Math.sin(angle) * dist);
		let distY = Math.round(Math.cos(angle) * dist);
		//this.gravity();
		this.motion(distX, distY);
	},
	test: function(angle, dist) {
		let distX = Math.round(Math.sin(angle) * dist);
		let distY = Math.round(Math.sqrt(dist));
		//let distY = -Math.round(Math.log(distX));
		this.motion(distX, distY);
	}
};