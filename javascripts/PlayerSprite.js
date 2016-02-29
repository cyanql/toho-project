var Player = function(cx, cy, setList) {
	var PlayerSprite = new Sprite(SYS.Resource.image.obj.player, setList);

	var BulletType = SYS.Setting.Bullet[0] //type[1]
		,
		speed = BulletType[4] //15
		,
		num = BulletType[5] //9
		,
		limit = BulletType[6] //5
		,
		timeout = BulletType[8] //2000 ms
		,
		emittertype = BulletType[9],
		spacing = 100,
		dist = 0;

	PlayerSprite.HP = setList[4];
	PlayerSprite.move(cx, cy);
	PlayerSprite.resize(0.8);
	PlayerSprite.name("PlayerSprite");
	PlayerSprite.fire = function() {
		dist += speed;
		if (dist < spacing) { //当间距达到了限定值才允许射击
			return;
		} else {
			dist = 0;
		}
		var cx = this.cx,
			cy = this.cy;
		var blt;
		blt = Bullet(cx, cy, BulletType);
		blt.owner = "player";

		blt.set(1, -speed, emittertype);

		SYS.Collision.Tree.insert(blt);
	}
	PlayerSprite.hit = function() {
		this.HP--;
	}
	PlayerSprite.ceasefire = function() {
		this.fire = new Function();
	}
	return PlayerSprite;
};