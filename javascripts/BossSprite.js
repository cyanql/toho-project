var Boss = function (cx, cy, setList) {
		var BossSprite = new Sprite(SYS.Resource.image.obj.all, setList);

		var BulletType = SYS.Setting.Bullet[2]	//type[0]
		,	speed = BulletType[4]	//15
		,	num = BulletType[5]	//9
		,	limit = BulletType[6]	//5
		,	spacing = BulletType[7]
		,	timeout = BulletType[8]//2000 ms
		,	emittertype = BulletType[9]
		,	dist = 0
		,	FireTimes = 0
		,	FireSwitch = true;

		BossSprite.HP = setList[4];
		BossSprite.remap(2.5);
		BossSprite.resize(2);
		BossSprite.move(cx, cy);
		BossSprite.name("BossSprite");
		BossSprite.emitter = new Emitter(BossSprite.cx, BossSprite.cy);
		console.log(BossSprite.emitter);
		BossSprite.fire = function () {
			if (!FireSwitch)
				return;
			dist += speed;

			if (dist < spacing) {			//当间距达到了限定值才允许射击
				return;
			} else {
				dist = 0;
			}
			if (FireTimes > limit) {		//当开火次数到一轮攻击的上限，关闭开火阀门，两秒后打开
				BulletType = SYS.Setting.Bullet[rand(1, SYS.Setting.Bullet.length)];	//type[0]
				speed = BulletType[4];	//15
				num = BulletType[5];	//9
				limit = BulletType[6];	//5
				spacing = BulletType[7];
				timeout = BulletType[8];//2000 ms
				emittertype = BulletType[10];
				FireTimes = 0;
				FireSwitch = false;
				setTimeout(function () {
					FireSwitch = true;
				},timeout);
				return;
			} else {
				FireTimes++;
			}
			console.log(emittertype, BulletType);
			this.emitter[emittertype](BulletType);
			//var cx = this.cx
			//,	cy = this.cy;
			// var blt
			// ,	angle;
			// for (var i = 1; i < num + 1; i++) {
			// 	angle = Math.PI * 2 * i / num;
			// 	blt = Bullet(cx, cy, BulletType);
			// 	blt.owner = "boss";

			// 	blt.set(angle, speed, emittertype);

			// 	SYS.Collision.Tree.insert(blt);
			// }
		};
		BossSprite.ceasefire = function () {
			this.fire = new Function();
		}
		BossSprite.hit = function () {
			this.HP--;
		}
		return BossSprite;
	};