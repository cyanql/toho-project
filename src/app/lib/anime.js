
let Anime = function(sprite, index, total, timeout, tree) {
	let timer;
	let motion = function() {
		if (index >= total) {
			sprite.removed = true;
			sprite.undead = false;
			clearTimeout(timer);
			return;
		}
		sprite.change(++index);
		tree.insert(sprite);
		timer = setTimeout(motion, timeout);
	};
	motion();
};
