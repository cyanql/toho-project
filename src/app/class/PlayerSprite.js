import EmitterSprite from './EmitterSprite'
import setting from '../setting'

export default
class PlayerSprite extends EmitterSprite {
	constructor(img, cx, cy, opts) {
		super(img, cx, cy, opts)
		super.resize(0.1)

		this.HP = opts.HP

		this.init(setting.Emitter[0])
	}
}
