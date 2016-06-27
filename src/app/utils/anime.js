export default function Anime(sprite, index, total, timeout, tree) {
	let timer;
	(function motion() {
		if (index >= total) {
			sprite.removed = true;
			sprite.undead = false;
			clearTimeout(timer);
			return;
		}
		sprite.change(++index);
		tree.insert(sprite);
		timer = setTimeout(motion, timeout);
	})();
}