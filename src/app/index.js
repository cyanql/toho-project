import Collision from 'app/core/collision'
import Control from 'app/core/control'
import Loader from 'app/core/loader'
import Render from 'app/core/render'
import Enemy from 'app/class/EnemySprite'
import Player from 'app/class/PlayerSprite'
import Magic from 'app/class/MagicSprite'
import QuadTree from 'app/class/QuadTree'
import Rect from 'app/class/Rect'
import 'app/utils/polyfill'
import 'css/index.less'

import resource from './resouce'
import setting from './setting'


const SYS = {
	Collision: new Collision(),
	Render: new Render(),
	Loader: new Loader(),
	Control: new Control(),
	Resource: {
		images: {},
		sounds: {}
	},
	Setting: null,
	Dom: {
		viewLayer: document.getElementById('view-layer'),
		drawCanvas: document.getElementById('draw-canvas'),
		bgCanvas: document.getElementById('bg-canvas'),
		playerHP: document.getElementById('player-hp'),
		enemyHP: document.getElementById('enemy-hp'),
		scoreText: document.getElementById('score-text'),
		fpsText: document.getElementById('fps-text'),
		progressText: document.getElementById('progress-text'),
		progress: document.getElementById('progress'),
		startButton: document.getElementById('start-button'),
		resetButton: document.getElementById('reset-button')
	}
}

const Game = {
	RAF: null,
	init() {
		const { Render, Control, Resource, Dom, Loader } = SYS

		Dom.drawCanvas.width = document.documentElement.clientWidth
		Dom.drawCanvas.height = document.documentElement.clientHeight
		Dom.drawCanvas.backgroundAlpha = 0
		Dom.bgCanvas.width = document.documentElement.clientWidth
		Dom.bgCanvas.height = document.documentElement.clientHeight

		Render.init(Dom.drawCanvas)
		Control.init(document)
		Loader.init(Dom.progressText)
		FPS.init(Dom.fpsText)

		Resource.images.all = Loader.loadImage(resource.images.ALL)
		Resource.images.explosion = Loader.loadImage(resource.images.EXPLOSION)
		Resource.images.bgs = []
		for (let i = 0, len = resource.images.BGs.length; i < len; i++) {
			Resource.images.bgs[i] = Loader.loadImage(resource.images.BGs[i])
		}

		Loader.onLoadAll = () => {
			Dom.progress.style.display = 'none'
			Dom.startButton.style.display = 'block'
		}


		Control.on('tap', (ev) => {
			ev = ev || window.event
			let elem = ev.srcElement || ev.target
			switch (elem.id) {
				case 'start-button':
					elem.style.display = 'none'
					Dom.viewLayer.style.display = 'block'
					this.start()
					break
				case 'reset-button':
					elem.style.display = 'none'
					this.reset()
					break
				default:
					break
			}
		})

	},
	start() {
		const { Collision, Render, Control, Resource, Dom } = SYS

		let level = 0

		const bgCtx = Dom.bgCanvas.getContext('2d')
		bgCtx.drawImage(Resource.images.bgs[level], 0, 0, Dom.bgCanvas.width, Dom.bgCanvas.height)

		let enemy = new Enemy(Resource.images.all, Render.renderWidth / 2, Render.renderHeight / 5, setting.Enemy[level])
		let player = new Player(Resource.images.all, Render.renderWidth / 2, Render.renderHeight, setting.Player[0])
		let magic = new Magic(Resource.images.all, enemy.cx, enemy.cy, setting.Magic[0])

		enemy.setMagic(magic)

		//创建一个四叉树,定义其最上层范围
		const scope = new Rect(0, 0, Dom.drawCanvas.width, Dom.drawCanvas.height)
		const playerTree = new QuadTree(scope)
		const enemyTree = new QuadTree(scope)


		enemyTree.insert(enemy.magic)

		//停火区间
		let step = 1
		function onCeasefireInterval() {
			this.move(this.cx + step, this.cy)
			if (this.cx  < 10) {
				step = 1
			} else if (this.cx > Dom.drawCanvas.width - 10) {
				step = -1
			}
		}


		enemy.onCeasefireInterval = onCeasefireInterval

		const img_explosion = Resource.images.explosion

		let enemyArr = []
		let playerArr = []

		const enemyHPwidth = Dom.enemyHP.offsetWidth
		const playerHPwidth = Dom.playerHP.offsetWidth


		const loop = () => {
			this.RAF = window.requestAnimationFrame(loop)
			enemy.fire(enemyTree)
			enemy.magic.move(enemy.cx, enemy.cy)
			player.fire(playerTree, 'player')

			player.move(Control.movePos.x, Control.movePos.y)

			// 筛选物体集合并进行碰撞检测
			enemyTree.retrieve(player).forEach(result => {
				if (!result.removed && !result.undead && Collision.check.circle(player, result)) {
					result.destroy(img_explosion, enemyTree)
					player.HP--
					Dom.playerHP.style.width = player.HP / setting.Player[0].HP * playerHPwidth + 'px'
					if (player.HP <= 0) {
						player.destroy(img_explosion, enemyTree)
						player.ceasefire()
						setTimeout(() => {
							Dom.resetButton.style.display = 'block'
							window.cancelAnimationFrame(this.RAF)
						}, 1000)
					}
				}
			})

			// 筛选物体集合并进行碰撞检测
			playerTree.retrieve(enemy).forEach(result => {
				if (!result.removed && !result.undead && Collision.check.circle(enemy, result)) {
					result.destroy(img_explosion, enemyTree)
					enemy.HP--
					Dom.scoreText.innerHTML = parseInt(Dom.scoreText.innerHTML) + 100
					Dom.enemyHP.style.width = enemy.HP / setting.Enemy[level].HP * enemyHPwidth + 'px'
					if (enemy.HP <= 0) {
						enemy.destroy(img_explosion, enemyTree)
						enemy.ceasefire()
						if (++level > 2) {
							setTimeout(() => {
								Dom.resetButton.style.display = 'block'
								window.cancelAnimationFrame(this.RAF)
							}, 1000)
						}
						enemyTree.clear()
						enemy = new Enemy(Resource.images.all, Render.renderWidth / 2, Render.renderHeight / 5, setting.Enemy[level])
						enemy.onCeasefireInterval = onCeasefireInterval
						enemy.setMagic(magic)
						enemyTree.insert(magic)
						SYS.Dom.enemyHP.style.width = '80%'
						bgCtx.drawImage(Resource.images.bgs[level], 0, 0, Dom.bgCanvas.width, Dom.bgCanvas.height)
					}
				}
			})

			enemyArr = enemyTree.refresh()
			playerArr = playerTree.refresh()
			window.playerArr = playerArr
			Render.add(enemyArr)
			Render.add(playerArr)
			Render.add(enemy)
			Render.add(player)
			Render.clear()
			Render.render()
			Render.empty()

			FPS.show()
		}
		this.RAF = window.requestAnimationFrame(loop)
	},
	reset() {
		window.cancelAnimationFrame(this.RAF)
		SYS.Render.clear()
		SYS.Render.empty()
		SYS.Dom.scoreText.innerHTML = '0'
		SYS.Dom.resetButton.style.display = 'none'
		SYS.Dom.playerHP.style.width = '80%'
		SYS.Dom.enemyHP.style.width = '80%'
		this.start()
	},
	end() {

	}
}
let FPS = {
	layer: null,
	startTime: null,
	endTime: null,
	frame: 0,
	init(layer) {
		this.layer = layer
		this.startTime = +new Date
	},
	show() {
		this.endTime = +new Date
		this.frame = Math.round(1000 / (this.endTime - this.startTime))
		this.startTime = this.endTime
		this.layer.innerHTML = this.frame
	}
}

Game.init()
