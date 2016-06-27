import Collision from 'app/core/collision'
import Control from 'app/core/control'
import Loader from 'app/core/loader'
import Render from 'app/core/render'
import Enemy from 'app/class/EnemySprite'
import Player from 'app/class/PlayerSprite'
import QuadTree from 'app/class/QuadTree'
import Rect from 'app/class/Rect'
import 'app/utils/polyfill'
import 'css/game.css'

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
		scorelayer: document.getElementById('score-layer'),
		menulayer: document.getElementById('menu-layer'),
		resetlayer: document.getElementById('reset-layer'),
		loadlayer: document.getElementById('load-layer'),
		bglayer: document.getElementById('bg-layer'),
		canvas: document.getElementById('draw-target'),
		bgcanvas: document.getElementById('bg-target'),
		score: document.getElementById('score')
	}
}

const Game = {
	RAF: null,
	start() {

		SYS.Dom.canvas.width = document.documentElement.clientWidth
		SYS.Dom.canvas.height = document.documentElement.clientHeight
		SYS.Dom.canvas.backgroundAlpha = 0
		SYS.Dom.bgcanvas.width = document.documentElement.clientWidth
		SYS.Dom.bgcanvas.height = document.documentElement.clientHeight

		SYS.Render.init(SYS.Dom.canvas)
		SYS.Control.init(document)
		SYS.Loader.init(SYS.Dom.loadlayer)

		SYS.Resource.images.all = SYS.Loader.loadImage(resource.images.ALL)
		SYS.Resource.images.player = SYS.Loader.loadImage(resource.images.PLAYER)
		SYS.Resource.images.explosion = SYS.Loader.loadImage(resource.images.EXPLOSION)
		SYS.Resource.images.bg = SYS.Loader.loadImage(resource.images.BG)

		SYS.Loader.onload = () => this.play()

	},
	play() {
		const { Collision, Render, Control, Resource, Dom } = SYS
		
		Dom.bgcanvas.getContext('2d').drawImage(Resource.images.bg, 0, 0, Dom.bgcanvas.width, Dom.bgcanvas.height)

		const enemy = new Enemy(Resource.images.all, Render.renderWidth / 2, Render.renderHeight / 5, setting.Enemy[0])
		const player = new Player(Resource.images.player, Render.renderWidth / 2, Render.renderHeight, setting.Player[0])

		//创建一个四叉树,定义其最上层范围
		const scope = new Rect(0, 0, Dom.canvas.width, Dom.canvas.height)
		const playerTree = new QuadTree(scope)
		const enemyTree = new QuadTree(scope)

		const img_all = Resource.images.explosion

		let enemyArr = []
		let playerArr = []

		FPS.init()
		const loop = () => {
			this.RAF = window.requestAnimationFrame(loop)
			enemy.fire(enemyTree)
			player.fire(playerTree)

			player.move(Control.movePos.x, Control.movePos.y)

			// 筛选物体集合并进行碰撞检测
			enemyTree.retrieve(player).forEach(result => {
				if (!result.removed && !result.undead && Collision.check.circle(player, result)) {
					result.destroy(img_all, enemyTree)
					player.hit()
					if (player.HP <= 0) {
						player.destroy(img_all, enemyTree)
						player.ceasefire()
						setTimeout(() => {
							Dom.resetlayer.style.display = 'block'
							window.cancelAnimationFrame(this.RAF)
						}, 1000)
					}
				}
			})

			// 筛选物体集合并进行碰撞检测
			playerTree.retrieve(enemy).forEach(result => {
				if (!result.removed && !result.undead && Collision.check.circle(enemy, result)) {
					result.destroy(img_all, enemyTree)
					enemy.hit()
					Dom.score.innerHTML = parseInt(Dom.score.innerHTML) + 100
					if (enemy.HP <= 0) {
						enemy.destroy(img_all, enemyTree)
						enemy.ceasefire()
						setTimeout(() => {
							Dom.resetlayer.style.display = 'block'
							window.cancelAnimationFrame(this.RAF)
						}, 1000)
					}
				}
			})

			enemyArr = enemyTree.refresh()
			playerArr = playerTree.refresh()
			Render.add(player)
			Render.add(enemy)
			Render.add(enemyArr)
			Render.add(playerArr)
			Render.clear()
			Render.render()
			Render.empty()

			FPS.show()
		}
		this.RAF = window.requestAnimationFrame(loop)

		Control.on('tap', (ev) => {
			ev = ev || window.event
			let elem = ev.srcElement || ev.target
			if (elem.id == 'reset')
				this.reset()
		})
	},
	reset() {
		window.cancelAnimationFrame(this.RAF)
		SYS.Render.clear()
		SYS.Render.empty()
		SYS.Dom.score.innerHTML = '0'
		SYS.Dom.resetlayer.style.display = 'none'
		this.play()
	},
	end() {

	}
}
let FPS = {
	layer: null,
	startTime: null,
	endTime: null,
	frame: 0,
	init() {
		this.startTime = +new Date
		this.layer = document.getElementById('fps')
	},
	show() {
		this.endTime = +new Date
		this.frame = Math.round(1000 / (this.endTime - this.startTime))
		this.startTime = this.endTime
		this.layer.innerHTML = this.frame
	}
}

Game.start()
