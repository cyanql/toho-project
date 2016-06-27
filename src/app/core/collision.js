export default
class Collision {
	check = {
		cube(collider, collidee) {
			//根据中心点距离判断是否接触
			return Math.abs(collider.cx - collidee.cx) < (collider.width + collidee.width) / 2 && Math.abs(collider.cy - collidee.cy) < (collider.height + collidee.height) / 2
		},
		circle(collider, collidee) {
			//根据双方坐标计算当前距离
			const xyDist = Math.sqrt(Math.pow(Math.abs(collider.cx - collidee.cx), 2) + Math.pow(Math.abs(collider.cy - collidee.cy), 2))
			//根据双方宽高计算最短距离
			const shortDist = Math.sqrt(Math.pow((collider.width + collidee.width) / 2, 2) + Math.pow((collider.height + collidee.height) / 2, 2))

			return xyDist < shortDist
		}
	}
}
