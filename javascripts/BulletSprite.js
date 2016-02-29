var Bullet = function(cx, cy, setList) {
	var BulletSprite = new Sprite(SYS.Resource.image.obj.all, setList); // 10, 3435, 60, 60);
	BulletSprite.move(cx, cy);
	BulletSprite.name("BulletSprite");

	BulletSprite.angle = 0;
	BulletSprite.dist = 0;
	BulletSprite.propulsiontype = null;

	BulletSprite.set = function(angle, dist, propulsiontype) {
		BulletSprite.angle = angle;
		BulletSprite.dist = dist;
		BulletSprite.propulsiontype = propulsiontype;
	};

	BulletSprite.go = function() {
		this.propulsion[this.propulsiontype](this.angle, this.dist);
	};

	BulletSprite.propulsion = {			//推进方式
		motion: function(distX, distY) {
			BulletSprite.cx += distX;
			BulletSprite.cy += distY;
			BulletSprite.x += distX;
			BulletSprite.y += distY;
		},
		gravity: function() {
			BulletSprite.cy += 5;
			BulletSprite.y += 5;
		},
		line: function (distX, distY) {
			this.motion(distX, distY);
		},
		circle: function(angle, dist) {
			var distX = Math.round(Math.sin(angle) * dist);
			var distY = Math.round(Math.cos(angle) * dist);
			//this.gravity();
			this.motion(distX, distY);
		},
		test: function(angle, dist) {
			var distX = Math.round(Math.sin(angle) * dist);
			var distY = Math.round(Math.sqrt(dist));
			//var distY = -Math.round(Math.log(distX));
			this.motion(distX, distY);
		}
	};
	return BulletSprite;
};
