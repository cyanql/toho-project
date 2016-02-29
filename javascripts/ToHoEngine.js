(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());
var SYS = {
	Collision: null,
	Render: null,
	Loader: null,
	Control: null,
	Resource: null,
	Setting: null,
	Dom: null
}
SYS.Loader = {
	layer: null,
	loaded: true,
	loadedCount: 0,
	totalCount: 0,
	soundFileExtn: ".ogg",
	init: function(layer) {
		var mp3Support, oggSupport;
		var audio = document.createElement('audio');
		if (audio.canPlayType) {
			mp3Support = "" != audio.canPlayType('audio/mpeg');
			oggSupport = "" != audio.canPlayType('audio/ogg; codecs = "vorbis"');
		} else {
			mp3Support = false;
			oggSupport = false;
		}
		this.soundFileExtn = oggSupport ? ".ogg" : mp3Support ? ".mp3" : undefined;
		this.layer = layer;
	},
	itemLoaded: function() {
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
	loadImages: function(url) {
		var _this = this;
		this.totalCount++;
		this.loaded = false;
		this.layer.style.display = "block";

		var img = new Image();
		img.src = url;
		img.onload = function() {
			_this.itemLoaded();
		};
		return img;
	},
	loadSound: function(url) {
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
	startPos: {
		x: 0,
		y: 0
	},
	movePos: {
		x: 0,
		y: 0
	},
	eventList: [],
	callbackList: [],
	addHandler: function(element, type, Func) {
		if (element.addEventListener)
			element.addEventListener(type, Func, false);
		else if (element.attachEvent)
			element.attachEvent("on" + type, Func);
		else
			element["on" + type] = Func;
	},
	init: function(element) {
		var _this = this;
		element = element || document;
		var start = 'ontouchstart' in document ? 'touchstart' : 'mousedown';
		var move = 'ontouchmove' in document ? 'touchmove' : 'mousemove';
		var end = 'ontouchend' in document ? 'touchend' : 'mouseup';
		var startFunc = function(ev) {
			ev = ev || window.event;
			var pos = 'ontouchstart' in document ? ev.touches[0] : ev;
			_this.startPos = {
				'x': pos.pageX,
				'y': pos.pageY
			};
			_this.movePos = _this.startPos;
		};
		var moveFunc = function(ev) {
			ev = ev || window.event;
			var pos = 'ontouchstart' in document ? ev.touches[0] : ev;
			_this.movePos = {
				'x': pos.pageX,
				'y': pos.pageY
			};
			ev.preventDefault();
		};
		var endFunc = function(ev) {
			ev = ev || event;
			var length = _this.eventList.length;
			for (var i = 0; i < length; i++) {
				_this.event[_this.eventList[i]](_this.callbackList[i].cb, _this, ev);
			}
		};
		this.addHandler(element, start, startFunc);
		this.addHandler(element, move, moveFunc);
		this.addHandler(element, end, endFunc);
	},
	on: function(event, callback) {
		this.eventList.push(event);
		this.callbackList.push({
			cb: callback
		});
		return this;
	},
	event: {
		tap: function(callback, _this, ev) {
			//if (_this.movePose)
			if (Math.abs(_this.movePos.x - _this.startPos.x) > 1 || Math.abs(_this.movePos.y - _this.startPos.y) > 1)
				return;
			callback(ev);
		},
		swipe: function(callback, _this, ev) {
			//if (!_this.movePose) return;
			callback(ev);
			return _this.movePos = {
				x: 0,
				y: 0
			};
		}
	}
};
SYS.Collision = {
	Tree: null,
	init: function(tree) {
		this.Tree = tree;
	},
	check: function(collider, collidee) {
		var distX = Math.abs(collider.cx - collidee.cx);
		var distY = Math.abs(collider.cy - collidee.cy);
		if (distX < (collider.width + collidee.width) / 2 && distY < (collider.height + collidee.height) / 2)
			return true;
		else
			return false;
	}
};


SYS.Render = {
	canvas: null,
	ctx: null,
	renderWidth: 0,
	renderHeight: 0,
	Queue: [],
	init: function(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.renderWidth = canvas.width;
		this.renderHeight = canvas.height;
	},
	add: function(item) {
		this.Queue = this.Queue.concat(item);
	},
	empty: function() {
		this.Queue = [];
	},
	clear: function() {
		this.ctx.clearRect(0, 0, this.renderWidth, this.renderHeight);
	},
	render: function() {
		var _this = this;
		this.Queue.forEach(function(item) {
			item.go();
			item.draw(_this.ctx);
		});
	}
};
SYS.Setting = {
	Bullet: [
		//[orignX, orignY, orignWidth, orignHeight, speed, number——(PI*2), limit, spacing, timeout, propulsiontype, emittertype]
		[36, 64, 6, 14, 20, 15, 5, 100, 500, "line", "circle"],
		[64, 448, 64, 64, 2, 15, 5, 50, 500, "circle", "circle"],
		[32, 32, 16, 16, 5, 15, 5, 50, 1500, "circle", "circle"],
		[128, 208, 32, 32, 10, 25, 5, 50, 1500, "test", "circle"],
		[192, 256, 32, 32, 10, 9, 5, 50, 1500, "test", "circle"],
		[64, 448, 64, 64, 10, 6, 5, 50, 1500, "test", "circle"],
		[32, 32, 16, 16, 10, 15, 5, 50, 1500, "test", "circle"],
		[32, 32, 16, 16, 10, 15, 5, 50, 1500, "test", "circle"]
	],
	Explosion: [
		[0, 0, 62, 63]
	],
	Boss: [
		[0, 1712, 48, 48, 10] //前四项同上, HP
	],
	Player: [
		[0, 294, 90, 90, 5] //前四项同上, HP
	]
}
SYS.Resource = {
	image: {
		obj: {},
		src: [
			"./images/all.png",
			"./images/player.png",
			"./images/explosion.png",
			"./images/bg.png"
		]
	},
	sound: {
		obj: {},
		src: [

		]
	}
};
SYS.Dom = {
	scorelayer: document.getElementById("score-layer"),
	menulayer: document.getElementById("menu-layer"),
	resetlayer: document.getElementById("reset-layer"),
	loadlayer: document.getElementById("load-layer"),
	bglayer: document.getElementById("bg-layer"),
	canvas: document.getElementById("draw-target"),
	bgcanvas: document.getElementById("bg-target"),
	score: document.getElementById("score")
};
var Game = {
	RAF: null,
	start: function() {

		SYS.Dom.canvas.width = document.documentElement.clientWidth;
		SYS.Dom.canvas.height = document.documentElement.clientHeight;
		SYS.Dom.canvas.backgroundAlpha = 0;
		SYS.Dom.bgcanvas.width = document.documentElement.clientWidth;
		SYS.Dom.bgcanvas.height = document.documentElement.clientHeight;

		//创建一个四叉树,并将屏幕上的所有物体都插入到这个四叉树中
		var Tree = new QuadTree(new Rect(0, 0, SYS.Dom.canvas.width, SYS.Dom.canvas.height));

		SYS.Collision.init(Tree);
		SYS.Render.init(SYS.Dom.canvas);
		SYS.Control.init(document);
		SYS.Loader.init(SYS.Dom.loadlayer);


		SYS.Resource.image.obj.all = SYS.Loader.loadImages(SYS.Resource.image.src[0]);
		SYS.Resource.image.obj.player = SYS.Loader.loadImages(SYS.Resource.image.src[1]);
		SYS.Resource.image.obj.explosion = SYS.Loader.loadImages(SYS.Resource.image.src[2]);
		SYS.Resource.image.obj.bg = SYS.Loader.loadImages(SYS.Resource.image.src[3]);

		_this = this;
		SYS.Loader.onload = function() {
			_this.play();
		};
	},
	play: function() {
		var resultArr = [];
		_this = this;

		var boss = Boss(SYS.Render.renderWidth / 2, SYS.Render.renderHeight / 5, SYS.Setting.Boss["0"]),
			player = Player(SYS.Render.renderWidth / 2, SYS.Render.renderHeight, SYS.Setting.Player["0"]);

		SYS.Dom.bgcanvas.getContext('2d').drawImage(SYS.Resource.image.obj.bg, 0, 0, SYS.Dom.bgcanvas.width, SYS.Dom.bgcanvas.height);

		SYS.Collision.Tree.insert(boss);

		FPS.init();
		var loop = function() {
			_this.RAF = window.requestAnimationFrame(loop);
			boss.fire(1);
			player.fire(0);

			player.move(SYS.Control.movePos.x, SYS.Control.movePos.y);

			// 筛选物体集合并进行碰撞检测
			resultArr = SYS.Collision.Tree.retrieve(player);
			resultArr.forEach(function(result, index) {
				// norrow phase部分的碰撞检测...
				if (!result.removed && !result.undead) {
					if (result.owner !== "player" && SYS.Collision.check(player, result)) {
						result.destroy();
						player.hit();
						if (player.HP <= 0) {
							player.destroy();
							player.ceasefire();
							setTimeout(function() {
								SYS.Dom.resetlayer.style.display = "block";
								window.cancelAnimationFrame(_this.RAF);
							}, 1000);
						}
					} else if (result.owner === "player" && SYS.Collision.check(boss, result)) {
						result.destroy();
						boss.hit();
						SYS.Dom.score.innerHTML = parseInt(SYS.Dom.score.innerHTML) + 100;
						if (boss.HP <= 0) {
							boss.destroy();
							boss.ceasefire();
							setTimeout(function() {
								SYS.Dom.resetlayer.style.display = "block";
								window.cancelAnimationFrame(_this.RAF);
							}, 1000);
						}
					}
				}
			});
			resultArr = SYS.Collision.Tree.refresh();
			SYS.Render.add(player);
			SYS.Render.add(resultArr);
			SYS.Render.clear();
			SYS.Render.render();
			SYS.Render.empty();

			FPS.show();
		};
		_this.RAF = window.requestAnimationFrame(loop);

		SYS.Control.on("tap", function(ev) {
			ev = ev || window.event;
			var elem = ev.srcElement || ev.target;
			if (elem.id == "reset")
				_this.reset();
		});
	},
	reset: function() {
		window.cancelAnimationFrame(this.RAF);
		SYS.Render.clear();
		SYS.Render.empty();
		SYS.Dom.score.innerHTML = "0";
		SYS.Dom.resetlayer.style.display = "none";
		SYS.Collision.Tree.clear();
		this.play();
	},
	end: function() {

	}
};
var FPS = {
	layer: null,
	startTime: null,
	endTime: null,
	frame: 0,
	init: function() {
		this.startTime = +new Date;
		this.layer = document.getElementById("fps");
	},
	show: function() {
		this.endTime = +new Date;
		this.frame = Math.round(1000 / (this.endTime - this.startTime));
		this.startTime = this.endTime;
		this.layer.innerHTML = this.frame;
	}
}