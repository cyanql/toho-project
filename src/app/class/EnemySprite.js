import MagicSprite from './MagicSprite'
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

		super.remap(0.5)
		super.resize(0.25)

		this.magic = null

		this.HP = opts.HP
		this.init(setting.Emitter[1])
		this.onCeasefire = () => {
			this.init(setting.Emitter[rand(1, setting.Emitter.length)])
			this.magic && this.magic.init(setting.Magic[rand(0, setting.Magic.length)])
		}
	}

	setEmitter(emitter) {
		if (emitter.constructor == EmitterSprite)  {
			this.emitter = emitter
		} else {
			throw new Error('入餐必须为EmitterSprite实例')
		}
	}

	setMagic(magic) {
		if (magic.constructor == MagicSprite)  {
			this.magic = magic
		} else {
			throw new Error('入餐必须为MagicSprite实例')
		}
	}
}
