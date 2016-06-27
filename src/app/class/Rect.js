/*
	矩形对象||碰撞对象
*/
export default
class Rect {
	constructor(x, y, width, height) {
		Object.assign(this, {
			x: x,
			y: y,
			cx: x + width / 2,
			cy: y + height / 2,
			width: width,
			height: height,
			halfWidth: width / 2,
			halfHeight: height / 2
		})
	}
	move(cx, cy) {
		this.x = cx - this.halfWidth
		this.y = cy - this.halfHeight
		this.cx = cx
		this.cy = cy
	}
	resize(per) {
		this.width *= per
		this.height *= per
		this.halfWidth *= per
		this.halfHeight *= per
	}
	carve(bounds) {
		let result = [],
			temp = [],
			cx = bounds.cx,
			cy = bounds.cy,
			dx = cx - this.x,
			dy = cy - this.y,
			carveX = dx > 0 && dx < this.width,
			carveY = dy > 0 && dy < this.height

		if (carveX && carveY) { // 切割XY方向
			temp = this.carve(cx, this.y)
			while (temp.length) {
				result = result.concat(temp.shift().carve(this.x, cy))
			}
		} else if (carveX) { // 只切割X方向
			result.push(
				new Rect(this.x, this.y, dx, this.height),
				new Rect(cx, this.y, this.width - dx, this.height)
			)
		} else if (carveY) { // 只切割Y方向
			result.push(
				new Rect(this.x, this.y, this.width, dy),
				new Rect(this.x, cy, this.width, this.height - dy)
			)
		}

		return result
	}
}
