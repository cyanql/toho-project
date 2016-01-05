/*
	四叉碰撞树
	1.内容来自CSDN & 百度文库，感谢分享
	2.CSDN内容略有错误，参照百度文库内容修改了部分
	3.自行修改了部分代码，添加了些许功能
*/


/*
	矩形对象
*/
var Rect = function(x, y, width, height) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.cx = x + width / 2;
	this.cy = y + height / 2;
};

Rect.prototype.carve = function(bounds) {
	var result = [],
		temp = [],
		cx = bounds.cx,
		cy = bounds.cy,
		dx = cx - this.x,
		dy = cy - this.y,
		carveX = dx > 0 && dx < this.width,
		carveY = dy > 0 && dy < this.height;

	if (carveX && carveY) { // 切割XY方向
		temp = this.carve(cx, this.y);
		while (temp.length) {
			result = result.concat(temp.shift().carve(this.x, cy));
		}
	} else if (carveX) { // 只切割X方向
		result.push(
			new Rect(this.x, this.y, dx, this.height),
			new Rect(cx, this.y, this.width - dx, this.height)
		);
	} else if (carveY) { // 只切割Y方向
		result.push(
			new Rect(this.x, this.y, this.width, dy),
			new Rect(this.x, cy, this.width, this.height - dy)
		);
	}

	return result;
}
/* 
	四叉树节点包含：
	- objects: 用于存储物体对象
	- nodes: 存储四个子节点
	- level: 该节点的深度，根节点的默认深度为0
	- bounds: 该节点对应的象限在屏幕上的范围，bounds是一个矩形
*/
var QuadTree = function QuadTree(bounds, level) {
	this.objects = [];
	this.nodes = [];
	this.level = typeof level === 'undefined' ? 0 : level;
	this.bounds = bounds;
};

/*
	常量：
	- MAX_OBJECTS: 每个节点（象限）所能包含物体的最大数量
	- MAX_LEVELS: 四叉树的最大深度
*/
QuadTree.prototype.MAX_OBJECTS = 10;
QuadTree.prototype.MAX_LEVELS = 5;

/* 
	获取物体对应的象限序号，以屏幕中心为界限，切割屏幕:
	- 右上：象限一
	- 左上：象限二
	- 左下：象限三
	- 右下：象限四
*/
// 清空子节点
QuadTree.prototype.clear = function() {
	var nodes = this.nodes,
		subnode;
	this.objects.splice(0, this.objects.length);
	while (nodes.length) {
		subnode = nodes.shift();
		subnode.clear();
	}
};
QuadTree.prototype.getIndex = function(rect) {
	var bounds = this.bounds,
		onTop = rect.y + rect.height <= bounds.cy,
		onBottom = rect.y >= bounds.cy,
		onLeft = rect.x + rect.width <= bounds.cx,
		onRight = rect.x >= bounds.cx;

	if (!isInner) return -1;

	if (onTop) {
		if (onRight) {
			return 0;
		} else if (onLeft) {
			return 1;
		}
	} else if (onBottom) {
		if (onLeft) {
			return 2;
		} else if (onRight) {
			return 3;
		}
	}

	// 如果物体跨越多个象限，则放回-1
	return -1;
};
// 划分
QuadTree.prototype.split = function() {
	var level = this.level,
		bounds = this.bounds,
		x = bounds.x, //0
		y = bounds.y, //0
		cx = bounds.cx,
		cy = bounds.cy,
		sWidth = bounds.width / 2, //360/2=180
		sHeight = bounds.height / 2; //640/2=320
	this.nodes.push(
		new QuadTree(new Rect(cx, y, sWidth, sHeight), level + 1),
		new QuadTree(new Rect(x, y, sWidth, sHeight), level + 1),
		new QuadTree(new Rect(x, cy, sWidth, sHeight), level + 1),
		new QuadTree(new Rect(cx, cy, sWidth, sHeight), level + 1)
	);
};
/*
	插入功能：
		- 如果当前节点[ 存在 ]子节点，则检查物体到底属于哪个子节点，如果能匹配到子节点，则将该物体插入到该子节点中
		- 如果当前节点[ 不存在 ]子节点，将该物体存储在当前节点。随后，检查当前节点的存储数量，如果超过了最大存储数量，则对当前节点进行划分，划分完成后，将当前节点存储的物体重新分配到四个子节点中。
*/
QuadTree.prototype.insert = function(rect) {
	var objs = this.objects,
		i, index;

	// 如果该节点下存在子节点
	if (this.nodes.length) {
		index = this.getIndex(rect);
		if (index !== -1) {
			this.nodes[index].insert(rect);
			return;
		}
	}

	// 否则存储在当前节点下
	objs.push(rect);

	// 如果当前节点存储的数量超过了MAX_OBJECTS
	if (!this.nodes.length &&
		this.objects.length > this.MAX_OBJECTS &&
		this.level < this.MAX_LEVELS) {

		this.split();

		for (i = objs.length - 1; i >= 0; i--) {
			index = this.getIndex(objs[i]);
			if (index !== -1) {
				this.nodes[index].insert(objs.splice(i, 1)[0]);
			}
		}
	}
};
/*
	检索功能：
		给出一个物体对象，该函数负责将该物体可能发生碰撞的所有物体选取出来。该函数先查找物体所属的象限，该象限下的物体都是有可能发生碰撞的，然后再递归地查找子象限...
*/
QuadTree.prototype.retrieve = function(rect) {
	var result = [],
		arr, i, index;

	if (this.nodes.length) {
		index = this.getIndex(rect); //获得区域编号
		if (index !== -1) { //如果在边界线上
			result = result.concat(this.nodes[index].retrieve(rect)); //查找子节点并将结果合并到result
		} else {
			// 切割矩形
			arr = rect.carve(this.bounds);
			for (i = arr.length - 1; i >= 0; i--) {
				index = this.getIndex(arr[i]);
				if (index === -1) break;
				result = result.concat(this.nodes[index].retrieve(rect));

			}
		}
	}

	result = result.concat(this.objects);

	return result;
};

/*
	动态更新：
		从根节点深入四叉树，检查四叉树各个节点存储的物体是否依旧属于该节点（象限）的范围之内，如果不属于，则重新插入该物体。
*/
QuadTree.prototype.refresh = function(root) {
	var objs = this.objects,
		result = [],
		rect, index, i, len;

	root = root || this;

	for (i = objs.length - 1; i >= 0; i--) {
		rect = objs[i];

		if (rect.removed) {					//当sprite标记为已删除
			this.objects.splice(i, 1);
			continue;
		}

		index = this.getIndex(rect);

		// 如果矩形不属于该象限，则将该矩形重新插入
		if (!isInner(rect, this.bounds)) {
			if (this !== root) {
				root.insert(objs.splice(i, 1)[0]);
			}

			// 如果矩形属于该象限 且 该象限具有子象限，则
			// 将该矩形安插到子象限中
		} else if (this.nodes.length) {
			this.nodes[index].insert(objs.splice(i, 1)[0]);
		}
	}

	// 递归刷新子象限
	for (i = 0, len = this.nodes.length; i < len; i++) {
		result = result.concat(this.nodes[i].refresh(root));
	}
	result = result.concat(objs);
	return result;
};

// 判断矩形是否在象限范围内
function isInner(rect, bounds) {
	return rect.x >= bounds.x 
	&&	rect.x + rect.width <= bounds.cx 
	&&	rect.y >= bounds.y 
	&&	rect.y + rect.height <= bounds.cy;
}