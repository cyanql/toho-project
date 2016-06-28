import Sprite from './Sprite'
import EmitterSprite from './EmitterSprite'
import setting from '../setting'

function rand(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

export default
class EnemySprite extends EmitterSprite {

	HP = 0

	constructor(img, cx, cy, opts) {
		super(img, cx, cy, opts)

		super.remap(2.5)
		super.resize(2)

		this.HP = opts.HP
		this.init(setting.Emitter[2])
		this.onCeasefire = () => {
			this.init(setting.Emitter[rand(1, setting.Emitter.length)])
		}
	}
}
