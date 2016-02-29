function inheritance(Parent, Child) {
	function F() {}
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
}
var Sprite = function(img, setList) { //初始化映射目标，映射坐标，映射宽高	orignX, orignY, width, height
	Rect.call(this, 0, 0, setList[2], setList[3]);
	this.img = img;
	this.orignX = setList[0];
	this.orignY = setList[1];
	this.orignWidth = setList[2];
	this.orignHeight = setList[3];
	this.mapX = setList[0];
	this.mapY = setList[1];
	this.mapWidth = setList[2];
	this.mapHeight = setList[3];
	this.removed = false;
	this.undead = false;
};

inheritance(Rect, Sprite);

Sprite.prototype.draw = function(ctx) {
	ctx.drawImage(this.img, this.orignX, this.orignY, this.orignWidth, this.orignHeight, this.cx - this.mapWidth / 2, this.cy - this.mapHeight / 2, this.mapWidth, this.mapHeight);
};
Sprite.prototype.change = function(index) {
	this.orignX = Math.round(index * this.orignWidth);
};
Sprite.prototype.remap = function(per) {
	this.mapWidth *= per;
	this.mapHeight *= per;
};
Sprite.prototype.name = function(name) { //测试
	this.name = name;
};
Sprite.prototype.go = function() {

};
Sprite.prototype.destroy = function() {
	var exp = Explosion(this.cx, this.cy, SYS.Setting.Explosion["0"]);
	exp.undead = true;
	Effect(exp, 0, 15, 75);
	this.removed = true;
};

var Effect = function (sprite, index, total, timeout) {
	var timer;
	var motion = function () {
		if (index >= total) {
			sprite.removed = true;
			sprite.undead = false;
			clearTimeout(timer);
			return;
		}
		sprite.change(++index);
		SYS.Collision.Tree.insert(sprite);
		timer = setTimeout(motion, timeout);
	}
	motion(); 
};

function rand (min, max) {
	return Math.floor(Math.random() * (max - min) + min);
};