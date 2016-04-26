import BossSprite from './class/BossSprite';
import PlayerSprite from './class/BossSprite';
import QuadTree from './class/QuadTree';
import Rect from './class/Rect';

import resource from './resouce';
import setting from './setting';

{
	let lastTime = 0;
	let vendors = ['ms', 'moz', 'webkit', 'o'];
	for (let x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback) {
			let currTime = new Date().getTime();
			let timeToCall = Math.max(0, 16 - (currTime - lastTime));
			let id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}

let SYS = {
	Collision: null,
	Render: null,
	Loader: null,
	Control: null,
	Resource: null,
	Setting: null,
	Dom: null
};

SYS.Loader = {
	layer: null,
	loaded: true,
	loadedCount: 0,
	totalCount: 0,
	soundFileExtn: '.ogg',
	init(layer) {
		let mp3Support, oggSupport;
		let audio = document.createElement('audio');
		if (audio.canPlayType) {
			mp3Support = '' != audio.canPlayType('audio/mpeg');
			oggSupport = '' != audio.canPlayType('audio/ogg; codecs = "vorbis"');
		} else {
			mp3Support = false;
			oggSupport = false;
		}
		this.soundFileExtn = oggSupport ? '.ogg' : mp3Support ? '.mp3' : undefined;
		this.layer = layer;
	},
	itemLoaded() {
		this.loadedCount++;
		if (this.loadedCount === this.totalCount) {
			this.loaded = true;
			this.layer.style.display = 'none';
			if (this.onload) {
				this.onload();
				this.onload = undefined;
			}
		}
	},
	loadImages(url) {
		this.totalCount++;
		this.loaded = false;
		this.layer.style.display = 'block';

		let img = new Image();
		img.src = url;
		img.onload = () => this.itemLoaded();
		return img;
	},
	loadSound(url) {
		this.totalCount++;
		this.loaded = false;
		this.layer.style.display = 'block';
		let audio = new Audio();
		audio.src = url + this.soundFileExtn;
		audio.addEventListener('canplaythrough', this.itemLoaded, false);
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
	addHandler(element, type, Func) {
		if (element.addEventListener)
			element.addEventListener(type, Func, false);
		else if (element.attachEvent)
			element.attachEvent('on' + type, Func);
		else
			element['on' + type] = Func;
	},
	init(element) {
		element = element || document;
		const start = 'ontouchstart' in document ? 'touchstart' : 'mousedown';
		const move = 'ontouchmove' in document ? 'touchmove' : 'mousemove';
		const end = 'ontouchend' in document ? 'touchend' : 'mouseup';
		const startFunc = (ev) => {
			ev = ev || window.event;
			const pos = 'ontouchstart' in document ? ev.touches[0] : ev;
			this.startPos = {
				'x': pos.pageX,
				'y': pos.pageY
			};
			this.movePos = this.startPos;
		};
		const moveFunc = (ev) => {
			ev = ev || window.event;
			const pos = 'ontouchstart' in document ? ev.touches[0] : ev;
			this.movePos = {
				'x': pos.pageX,
				'y': pos.pageY
			};
			ev.preventDefault();
		};
		const endFunc = (ev) => {
			ev = ev || event;
			for (let i = 0, length = this.eventList.length; i < length; i++) {
				this.event[this.eventList[i]](this.callbackList[i].cb, this, ev);
			}
		};
		this.addHandler(element, start, startFunc);
		this.addHandler(element, move, moveFunc);
		this.addHandler(element, end, endFunc);
	},
	on(event, callback) {
		this.eventList.push(event);
		this.callbackList.push({
			cb: callback
		});
		return this;
	},
	event: {
		tap(callback, _this, ev) {
			//if (_this.movePose)
			if (Math.abs(_this.movePos.x - _this.startPos.x) > 1 || Math.abs(_this.movePos.y - _this.startPos.y) > 1)
				return;
			callback(ev);
		},
		swipe(callback, _this, ev) {
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
	init(tree) {
		this.Tree = tree;
	},
	check(collider, collidee) {
		let distX = Math.abs(collider.cx - collidee.cx);
		let distY = Math.abs(collider.cy - collidee.cy);
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
	init(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.renderWidth = canvas.width;
		this.renderHeight = canvas.height;
	},
	add(item) {
		this.Queue = this.Queue.concat(item);
	},
	empty() {
		this.Queue = [];
	},
	clear() {
		this.ctx.clearRect(0, 0, this.renderWidth, this.renderHeight);
	},
	render() {
		this.Queue.forEach(item => {
			item.go();
			item.draw(this.ctx);
		});
	}
};
SYS.Dom = {
	scorelayer: document.getElementById('score-layer'),
	menulayer: document.getElementById('menu-layer'),
	resetlayer: document.getElementById('reset-layer'),
	loadlayer: document.getElementById('load-layer'),
	bglayer: document.getElementById('bg-layer'),
	canvas: document.getElementById('draw-target'),
	bgcanvas: document.getElementById('bg-target'),
	score: document.getElementById('score')
};
SYS.Resource = {
	images: null,
	sounds: null
};
let Game = {
	RAF: null,
	start() {

		SYS.Dom.canvas.width = document.documentElement.clientWidth;
		SYS.Dom.canvas.height = document.documentElement.clientHeight;
		SYS.Dom.canvas.backgroundAlpha = 0;
		SYS.Dom.bgcanvas.width = document.documentElement.clientWidth;
		SYS.Dom.bgcanvas.height = document.documentElement.clientHeight;

		//创建一个四叉树,并将屏幕上的所有物体都插入到这个四叉树中
		let Tree = new QuadTree(new Rect(0, 0, SYS.Dom.canvas.width, SYS.Dom.canvas.height));

		SYS.Collision.init(Tree);
		SYS.Render.init(SYS.Dom.canvas);
		SYS.Control.init(document);
		SYS.Loader.init(SYS.Dom.loadlayer);


		SYS.Resource.images.all = SYS.Loader.loadImages(resource.images.all);
		SYS.Resource.images.player = SYS.Loader.loadImages(resource.images.player);
		SYS.Resource.images.explosion = SYS.Loader.loadImages(resource.images.explosion);
		SYS.Resource.images.bg = SYS.Loader.loadImages(resource.images.bg);

		SYS.Loader.onload = () => this.play();
	},
	play() {
		let resultArr = [];

		let boss = new BossSprite(SYS.Resource.images.all, SYS.Render.renderWidth / 2, SYS.Render.renderHeight / 5, SYS.Setting.Boss[0], SYS.Resource.images.explosion),
			player = new PlayerSprite(SYS.Resource.images.player, SYS.Render.renderWidth / 2, SYS.Render.renderHeight, SYS.Setting.Player[0], SYS.Resource.images.explosion);

		SYS.Dom.bgcanvas.getContext('2d').drawImage(SYS.Resource.images.obj.bg, 0, 0, SYS.Dom.bgcanvas.width, SYS.Dom.bgcanvas.height);

		SYS.Collision.Tree.insert(boss);

		FPS.init();
		let loop = () => {
			this.RAF = window.requestAnimationFrame(loop);
			boss.fire(SYS.Collision.Tree);
			player.fire(SYS.Collision.Tree);

			player.move(SYS.Control.movePos.x, SYS.Control.movePos.y);

			// 筛选物体集合并进行碰撞检测
			resultArr = SYS.Collision.Tree.retrieve(player);
			resultArr.forEach(result => {
				// norrow phase部分的碰撞检测...
				if (!result.removed && !result.undead) {
					if (result.owner !== 'player' && SYS.Collision.check(player, result)) {
						result.destroy();
						player.hit();
						if (player.HP <= 0) {
							player.destroy();
							player.ceasefire();
							setTimeout(() => {
								SYS.Dom.resetlayer.style.display = 'block';
								window.cancelAnimationFrame(this.RAF);
							}, 1000);
						}
					} else if (result.owner === 'player' && SYS.Collision.check(boss, result)) {
						result.destroy();
						boss.hit();
						SYS.Dom.score.innerHTML = parseInt(SYS.Dom.score.innerHTML) + 100;
						if (boss.HP <= 0) {
							boss.destroy();
							boss.ceasefire();
							setTimeout(() => {
								SYS.Dom.resetlayer.style.display = 'block';
								window.cancelAnimationFrame(this.RAF);
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
		this.RAF = window.requestAnimationFrame(loop);

		SYS.Control.on('tap', (ev) => {
			ev = ev || window.event;
			let elem = ev.srcElement || ev.target;
			if (elem.id == 'reset')
				this.reset();
		});
	},
	reset() {
		window.cancelAnimationFrame(this.RAF);
		SYS.Render.clear();
		SYS.Render.empty();
		SYS.Dom.score.innerHTML = '0';
		SYS.Dom.resetlayer.style.display = 'none';
		SYS.Collision.Tree.clear();
		this.play();
	},
	end() {

	}
};
let FPS = {
	layer: null,
	startTime: null,
	endTime: null,
	frame: 0,
	init() {
		this.startTime = +new Date;
		this.layer = document.getElementById('fps');
	},
	show() {
		this.endTime = +new Date;
		this.frame = Math.round(1000 / (this.endTime - this.startTime));
		this.startTime = this.endTime;
		this.layer.innerHTML = this.frame;
	}
};

