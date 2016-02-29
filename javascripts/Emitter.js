var Emitter = function(cx, cy) {
	this.cx = cx;
	this.cy = cy;
}

Emitter.prototype = {		
	circle: function(BulletType) {
		var cx, cy, emittertype, propulsiontype, angle, blt;

		cx = this.cx;
		cy = this.cy;
		num = BulletType[5];	//9
		speed = BulletType[4];	//15
		emittertype = BulletType[9];
		propulsiontype = BulletType[10];

		for (var i = 1; i < num + 1; i++) {
			angle = Math.PI * 2 * i / num;

			blt = Bullet(cx, cy, BulletType);
			blt.owner = "boss";
			blt.set(angle, speed, propulsiontype);
			SYS.Collision.Tree.insert(blt);
		}
	}
}