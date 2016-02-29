var Explosion = function(cx, cy, setList) {
	var ExplosionSprite = new Sprite(SYS.Resource.image.obj.explosion, setList);
	ExplosionSprite.move(cx, cy);
	ExplosionSprite.name("ExplosionSprite");
	return ExplosionSprite;
};