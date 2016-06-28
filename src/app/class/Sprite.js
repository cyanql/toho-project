import Rect from './Rect'
import anime from 'app/utils/anime'
import setting from 'app/setting'

export default
class Sprite extends Rect {
	constructor(img, cx, cy, opts) { //初始化映射目标，映射坐标，映射宽高	orignX, orignY, width, height
		super(cx - opts.orignWidth / 2, cy - opts.orignHeight / 2, opts.orignWidth, opts.orignHeight)

		Object.assign(this, {
			img: img,
			orignX: opts.orignX,
			orignY: opts.orignY,
			orignWidth: opts.orignWidth,
			orignHeight: opts.orignHeight,
			mapX: opts.orignX,
			mapY: opts.orignY,
			mapWidth: opts.orignWidth,
			mapHeight: opts.orignHeight,
			angle: 0,
			removed: false,
			undead: false
		})
	}

	draw(ctx) {
		const angleAlpha = Math.atan(this.y / this.x)
		const dist = this.y / Math.sin(angleAlpha)
		const y2 = dist * Math.sin(this.angle + angleAlpha)
		const dy = y2 - this.y
		const dx = y2 / Math.tan(this.angle + angleAlpha) - this.x

		ctx.save()
		ctx.rotate(-this.angle)
		ctx.translate(dx, dy)
		ctx.drawImage(this.img, this.orignX, this.orignY, this.orignWidth, this.orignHeight, this.cx - this.mapWidth / 2, this.cy - this.mapHeight / 2, this.mapWidth, this.mapHeight)
		ctx.restore()
	}
	change(index) {
		this.orignX = Math.round(index * this.orignWidth)
	}
	rotate(angle) {
		this.angle = angle
	}
	remap(per) {
		this.mapWidth *= per
		this.mapHeight *= per
	}
	name(name) { //测试
		this.name = name
	}
	go() {

	}
	destroy(img, tree) {
		const exp = new Sprite(img, this.cx, this.cy, setting.Explosion[0])
		exp.undead = true
		anime(exp, 0, 15, 75, tree)
		this.removed = true
	}
}
