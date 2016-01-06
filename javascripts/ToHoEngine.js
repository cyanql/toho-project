window.onload = function () {
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function (id) {
				clearTimeout(id);
				console.log(this);
			};
	}());
	var SYS = {
		Collision: null,
		Render: null,
		Loader: null,
		Control: null,
		Resource: null
	}
	SYS.Loader = {
		layer: null,
		loaded : true,
		loadedCount : 0,
		totalCount : 0,
		soundFileExtn : ".ogg",
		init : function (layer) {
			var mp3Support, oggSupport;
			var audio = document.createElement('audio');
			if (audio.canPlayType) {
				mp3Support = "" != audio.canPlayType('audio/mpeg');
				oggSupport = "" != audio.canPlayType('audio/ogg; codecs = "vorbis"');
			} else {
				mp3Support = false;
				oggSupport = false;
			}
			this.soundFileExtn = oggSupport? ".ogg" : mp3Support ? ".mp3" : undefined;
			this.layer = layer;
		},
		itemLoaded : function () {
			this.loadedCount++;
			if (this.loadedCount === this.totalCount) {
				this.loaded = true;
				this.layer.style.display = "none";
				if (this.onload) {
					this.onload();
					this.onload = undefined;
				}
			}
		},
		loadImages : function (url) {
			var _this = this;
			this.totalCount++;
			this.loaded = false;
			this.layer.style.display = "block";

			var img = new Image();
			img.src = url;
			img.onload = function () {
				_this.itemLoaded();
			}
			return img;
		},
		loadSound : function (url) {
			this.totalCount++;
			this.loaded = false;
			this.layer.style.display = "block";
			var audio = new Audio();
			audio.src = url + this.soundFileExtn;
			audio.addEventListener("canplaythrough", this.itemLoaded, false);
			return audio;
		}
	};
	
	SYS.Control = {
		startPos: {x:0,y:0},
		movePos: {x:0,y:0},
		addHandler: function (element, type, Func) {
	        if (element.addEventListener){
	            element.addEventListener(type, Func, false);
	        } else if (element.attachEvent){
	            element.attachEvent("on" + type, Func);
	        } else {
	            element["on" + type] = Func;
	        }
	    },
	    init: function (element) {
	    	var _this = this;
			element = element || document;
		    var start = 'ontouchstart' in document ? 'touchstart' : 'mousedown';
		    var move = 'ontouchmove' in document ? 'touchmove' : 'mousemove';
		    var end = 'ontouchend' in document ? 'touchend' : 'mouseup';
			var startFunc = function (ev) {
		        ev = ev || window.event;
		        var pos = 'ontouchstart' in document ? ev.touches[0] : ev;
		        _this.startPos = {
		        	'x': pos.pageX,
		        	'y': pos.pageY
		        };
		    };
		    var moveFunc = function (ev) {
		        ev = ev || window.event;
		        var pos = 'ontouchstart' in document ? ev.touches[0] : ev;
		        _this.movePos = {
		        	'x': pos.pageX,
		        	'y': pos.pageY
		        };
		        ev.preventDefault();
		    };
		    var endFunc = function (ev) {

		    };
		    this.addHandler(element, start, startFunc);
		    this.addHandler(element, move, moveFunc);
		    this.addHandler(element, end, endFunc);
		}
	};
	SYS.Collision = {
		Tree: null,
		init: function (tree) {
			this.Tree = tree;
		},
		check: function (collider, collidee) {
			var distX = Math.abs(collider.cx - collidee.cx);
			var distY = Math.abs(collider.cy - collidee.cy);
			if (distX < (collider.width + collidee.width) / 2 && distY < (collider.height + collidee.height) / 2) {
				// console.log(
				// 		'x:' + collider.x
				// +'\n'+	'y:' + collider.y
				// +'\n'+	'width:' + collider.width
				// +'\n'+	'height:' + collider.height
				// +'\n'+	'x:' + collidee.x
				// +'\n'+	'y:' + collidee.y
				// +'\n'+	'width:' + collidee.width
				// +'\n'+	'height:' + collidee.height
				// );
				return true;
			}
			else {
				return false;
			}
		}
	};
	function inheritance(Parent, Child) {
		function F() {}
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
	}
	var Sprite = function (img, setting) {	//初始化映射目标，映射坐标，映射宽高	mapX, mapY, width, height
		Rect.call(this, 0, 0, setting[2], setting[3]);
		this.img = img;
		this.mapX = setting[0];
		this.mapY = setting[1];
		this.mapWidth = setting[2];
		this.mapHeight = setting[3];
		this.halfWidth = setting[2] / 2;
		this.halfHeight = setting[3] / 2;
		this.removed = false;
		this.undead = false;
	};
	inheritance(Rect, Sprite);
	Sprite.prototype.draw = function (ctx) {
		ctx.drawImage(this.img, this.mapX, this.mapY, this.mapWidth, this.mapHeight, this.x, this.y, this.width, this.height);
	};
	Sprite.prototype.move = function (cx, cy) {
		this.x = cx - this.halfWidth;
		this.y = cy - this.halfHeight;
		this.cx = cx;
		this.cy = cy;
	};
	Sprite.prototype.motion = function (distX, distY) {
		var _this = this;
		setTimeout(function () {
			_this.cx += distX;
			_this.cy += distY;
			_this.x += distX;
			_this.y += distY;
			_this.motion(distX, distY);
		},50);
	};
	Sprite.prototype.change = function (index) {
		this.mapX = Math.round(index * this.mapWidth);
	};
	Sprite.prototype.resize = function (width, height) {
		this.width = width;
		this.height = height;
		this.halfWidth = width / 2;
		this.halfHeight = height / 2;
	};
	Sprite.prototype.destroy = function () {
		var exp = new Explosion(this.cx, this.cy, SYS.Setting.Explosion["default"]);
		exp.undead = true;
		Effect(exp, 0, 15, 75);
		this.removed = true;
		//console.log("removed");
	};
	Sprite.prototype.name = function (name) {		//测试
		this.aname = name;
	};
	var Effect = function (sprite, index, total, timeout) {
		setTimeout(function () {
			if (index === total) {
				sprite.removed = true;
				sprite.undead = false;
				return ;
			}
			sprite.change(++index);
			SYS.Collision.Tree.insert(sprite);
			Effect(sprite, index, total, timeout);
		}, timeout);
	};
	var Boss = function (cx, cy, setting) {
		var BossSprite = new Sprite(SYS.Resource.image.obj.all, setting);

		var dist = 0;
		var FireTimes = 0;
		var FireSwitch = true;
		BossSprite.resize(150,150);
		BossSprite.move(cx, cy);
		BossSprite.name("BossSprite");
		BossSprite.fire = function (id) {
			if (!FireSwitch)
				return;
			var BulletType = SYS.Setting.Bullet[id];	//type[1]
			var speed = BulletType[4];	//15
			var num = BulletType[5];	//9
			var limit = BulletType[6];	//5
			var spacing = BulletType[7];
			var timeout = BulletType[8];//2000 ms
			dist += speed;
			if (dist < spacing) {			//当间距达到了限定值才允许射击
				return;
			} else {
				dist = 0;
			}
			if (FireTimes > limit) {		//当开火次数到一轮攻击的上限，关闭开火阀门，两秒后打开
				FireTimes = 0;
				FireSwitch = false;
				setTimeout(function () {
					FireSwitch = true;
				},timeout);
				return;
			} else {
				FireTimes++;
			}
			var cx = BossSprite.cx
			,	cy = BossSprite.cy;
			var blt
			,	angle;
			for (var i = 1; i < num + 1; i++) {
				angle = Math.PI * 2 * i / num;
				blt = new Bullet(cx, cy, BulletType);
				blt.circle(angle, speed / 2);
				SYS.Collision.Tree.insert(blt);
			}
		};
		return BossSprite;
	};
	var Explosion = function (cx, cy, setting) {
		var ExplosionSprite = new Sprite(SYS.Resource.image.obj.explosion, setting);
		ExplosionSprite.move(cx, cy);
		ExplosionSprite.name("ExplosionSprite");
		return ExplosionSprite;
	};
	var Bullet = function (cx, cy, setting) {
		var BulletSprite = new Sprite(SYS.Resource.image.obj.all, setting);// 10, 3435, 60, 60);
		BulletSprite.move(cx, cy);
		BulletSprite.name("BulletSprite");
		BulletSprite.circle = function (angle, dist) {
			var distX = Math.round(Math.sin(angle) * dist);
			var distY = Math.round(Math.cos(angle) * dist);
			this.motion(distX, distY);
		}
		return BulletSprite;
	};
	var Player = function (cx, cy, setting) {
		var PlayerSprite = new Sprite(SYS.Resource.image.obj.player, setting);
		PlayerSprite.move(cx, cy);
		PlayerSprite.name("PlayerSprite");
		return PlayerSprite;
	};
	SYS.Render = {
		canvas:null,
		ctx:null,
		renderWidth: 0,
		renderHeight: 0,
		Queue: [],
		init: function (canvas) {
			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			this.renderWidth = canvas.width;
			this.renderHeight = canvas.height;
		},
		add: function (item) {
			this.Queue = this.Queue.concat(item);
		},
		empty: function () {
			this.Queue = [];
		},
		clear: function () {
			this.ctx.clearRect(0, 0, this.renderWidth, this.renderHeight);
		},
		render: function () {
			var _this = this;
			this.Queue.forEach(function (item) {
				item.draw(_this.ctx);
			});
		}
	};
	SYS.Setting = {
		Bullet: {
			"default":[10, 3435, 60, 60, 15, 9, 5, 200, 2000],	//[mapX, mapY, mapWidth, mapHeight, speed, number——(PI*2), limit, timeout]
			"taiji":[20, 2838, 30, 30, 15, 9, 5, 200, 2000]
		},
		Explosion: {
			"default": [0, 0, 62, 63]
		},
		Boss: {
			"default": [0, 750, 250, 250]
		},
		Player: {
			"default": [0, 294, 90, 90]
		}
	}
	SYS.Resource = {
		dom: {},
		image: {
			obj: {},
			src: [
				"./images/all.png",
				"./images/player.png",
				"./images/explosion.png"
			]
		},
		music: {
			obj: {},
			src: [

			]
		}
	};

	var Game = {
		init : function () {
			SYS.Resource.dom.scorelayer = document.getElementById("score-layer");
			SYS.Resource.dom.menulayer = document.getElementById("menu-layer");
			SYS.Resource.dom.loadlayer = document.getElementById("load-layer");

			var Canvas = document.getElementById("draw-target");
			Canvas.width = document.documentElement.clientWidth;
			Canvas.height = document.documentElement.clientHeight;

			//创建一个四叉树,并将屏幕上的所有物体都插入到这个四叉树中
			var Tree = new QuadTree(new Rect(0, 0, Canvas.width, Canvas.height));
			
			SYS.Collision.init(Tree);
			SYS.Render.init(Canvas);
			SYS.Control.init(Canvas);
			SYS.Loader.init(SYS.Resource.dom.loadlayer);


			SYS.Resource.image.obj.all = SYS.Loader.loadImages(SYS.Resource.image.src[0]);
			SYS.Resource.image.obj.player = SYS.Loader.loadImages(SYS.Resource.image.src[1]);
			SYS.Resource.image.obj.explosion = SYS.Loader.loadImages(SYS.Resource.image.src[2]);

		},
		play: function () {
			var	resultArr = [];

			SYS.Loader.onload = function () {
				var boss = new Boss(SYS.Render.renderWidth / 2, SYS.Render.renderHeight / 3, SYS.Setting.Boss["default"])
				,	player = new Player(SYS.Render.renderWidth / 2, SYS.Render.renderHeight, SYS.Setting.Player["default"]);

				SYS.Collision.Tree.insert(boss);

				FPS.init();
				var loop = function () {
				    // 重新向四叉树中插入所有物体，重新初始化四叉树
				    // ...
				    // 筛选物体集合并进行碰撞检测
				    // ...
					if(!boss.removed)
						boss.fire("default");
				    player.move(SYS.Control.movePos.x, SYS.Control.movePos.y);
					resultArr = SYS.Collision.Tree.retrieve(player);
				    resultArr.forEach(function(result, index) {
				        // norrow phase部分的碰撞检测...
				        if (!result.removed && !result.undead && SYS.Collision.check(player, result)) {
				        	result.destroy();
				        	//player.remove();
				        } else {
				        	//resultArr[0].remove();
				        }
				    });
					resultArr = SYS.Collision.Tree.refresh();
				    SYS.Render.add(resultArr);
				    SYS.Render.add(player);
					SYS.Render.clear();
					SYS.Render.render();
					SYS.Render.empty();

					FPS.show();
					requestAnimationFrame(loop);
				};
				requestAnimationFrame(loop);
			};
		}
	};
	var FPS = {
		layer: null,
		startTime: null,
		endTime: null,
		frame: 0,
		init: function () {
			this.startTime = +new Date;
			this.layer = document.getElementById("fps");
		},
		show: function () {
			this.endTime = +new Date;
			this.frame = Math.round(1000 / (this.endTime - this.startTime));
			this.startTime = this.endTime;
			this.layer.innerHTML = this.frame;
		}
	}
	Game.init();
	Game.play();
};