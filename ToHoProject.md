#ToHoProject
##程序员视角（代码执行流程）

###游戏玩法
* 当前：功能单一
+ 游戏模式：生存类
  躲避`boss`子弹，并攻击`boss`累计得分直到角色`player`死亡

* 预期：功能多样
+ 游戏模式：过关类
  躲避`boss`子弹，并攻击`boss`闯关直到最后一关转为生存类，累计得分直到角色`player`死亡

###游戏特色
* 当前：
  只有一种子弹攻击方式`BulletSprite.circle`圆形攻击
* 预期：
  添加弹幕算法，可实现弧形，射线等多种攻击方式
  玩家还可添加诸如必杀技等攻击方式

###整体架构

`Rect`矩形类（管理图像的坐标位置和有效宽高）（碰撞）
``Tree``四叉树类（存储已创建的对象管理对象的所在区域，返回检测对象所在区域的其他对象，彻底删除对象）
`Sprite`精灵类（管理图像从资源原始图到画板绘制的映射关系以及对象状态）

`SYS.Resource`资源管理（存储有游戏需要的资源路径，`Loader`加载路径的资源返回相关对象->存入）
`SYS.Loader`资源加载 （加载游戏所需求的所有资源，全部加载后调用回调函数->`onload`->开始游戏）
`SYS.Control`外设控制 （存储外设输入，当前为鼠标，后期将加入键盘功能）
`SYS.Collision`碰撞检测 （负责所有物体的碰撞检测，优化树->`Tree`，以及碰撞检测->`Sprite`->`Rect`）
`SYS.Render`画板渲染	（将渲染队列->`Queue`中的对象->`Sprite`根据其坐标和宽高绘制到画板->`canvas`上）
`SYS.Setting`对象设置（存储所有相关`Sprite`类的设置，例如子弹在资源图上的映射坐标，速度，间隔距离，射击周期等等）
`SYS.Dom`文档节点（负责管理需求的html文档节点，获取画板，获取分数显示等）

###执行流程
`Game.start`
初始化以上SYS管理器
在资源都已经加载好的情况下调用`Game.play`
`Game.play`
新建游戏需要的对象，如玩家，`boss`等
循环：
调用精灵对象如玩家和`boss`等的射击函数->创建各自的子弹到优化树中
将精灵对象传入优化树检索->返回精灵对象所在区域的其他对象
将返回的结果对象数组进行碰撞检测->符合条件的对象添加删除标记
调用优化树刷新->将有删除标记的对象从树中删除，并返回树中所有的对象
将返回的结果对象数组添加到渲染队列,并调用渲染器渲染
`Game.reset`
重置各项数据
并调用`Game.play`

###设计思路
Html结构定义6层结构，分别为背景层，绘画层，分数层，菜单层（暂时没完善相应功能），帧率层
背景层游戏开始时直接调用绘画函数`canvas.ctx.draw`画在背景层上，不必每秒重绘，从而优化性能
通过最优化帧率循环函数`reqAnimationFrame`调用渲染器，保持60fps为上限的帧率
动画效果`Effect`则是通过该对象的定时函数`setTimeout`更改本对象位置或图片源，从而使得渲染时得到不同效果

###代码解释
####四叉树
| 矩形对象`Rect` |                      |
| ---------- | -------------------- |
| 属性         |                      |
| 宽高         | width，height         |
| 半宽高        | halfWidth，halfHeight |
| 坐标         | x， y                 |
| 中心坐标       | cx，cy                |
| 函数         |                      |
| 移动         | move                 |
| 动画         | motion               |
| 重定义宽高      | resize               |
| 切割矩形       | carve                |

| 树`Tree` |          |
| ------- | -------- |
| 属性      |          |
| 存储的对象   | objects  |
| 子节点     | nodes    |
| 层级      | level    |
| 矩形区域    | bounds   |
| 函数      |          |
| 获取区域号   | getIndex |
| 划分      | split    |
| 插入      | insert   |
| 清空      | clear    |
| 检索      | retrieve |
| 更新      | refresh  |

| 精灵`Sprite`继承于Rect |                        |
| ----------------- | ---------------------- |
| 属性                |                        |
| 图像源               | img                    |
| 图像源坐标             | orignX，orignY          |
| 图像源宽高             | orignWidth，orignHeight |
| 绘制坐标              | mapX，mapY              |
| 绘制宽高              | mapWidth，mapHeight     |
| 删除标记              | removed                |
| 无敌标记              | undead                 |
| 函数                |                        |
| 绘制                | draw                   |
| 换图                | change                 |
| 重定义绘制宽高           | remap                  |
| 摧毁对象              | destory                |
| 命名                | name                   |

####系统变量`SYS`

| 碰撞系统`Collision` |       |
| --------------- | ----- |
| 属性              |       |
| 优化树             | Tree  |
| 函数              |       |
| 初始化             | init  |
| 碰撞检测            | check |

| 渲染系统`Render` |                          |
| ------------ | ------------------------ |
| 属性           |                          |
| 渲染画板         | canvas                   |
| 渲染画板内容       | ctx                      |
| 渲染宽高         | renderWidth，renderHeight |
| 渲染队列         | Queue                    |
| 函数           |                          |
| 初始化          | init                     |
| 添加入队列        | add                      |
| 清空队列         | empty                    |
| 清空画板内容       | clear                    |
| 渲染           | render                   |

| 控制系统`Control` |                   |
| ------------- | ----------------- |
| 属性            |                   |
| 开始坐标          | startPos          |
| 移动坐标          | movePos           |
| 事件列表          | eventList         |
| 回掉函数列表        | callbackList      |
| 函数            |                   |
| 初始化           | init              |
| 添加监听          | addHandler        |
| 添加事件类型和回调     | on                |
| 相关事件          | event->包含tap，swip |

| 加载系统`Loader` |                        |
| ------------ | ---------------------- |
| 属性           |                        |
| 文字显示层        | layer                  |
| 加载完成标志       | loaded                 |
| 当前已加载数       | loadedCount            |
| 总加载数         | totalCount             |
| 音频格式         | soundFileExtn          |
| 函数           |                        |
| 初始化          | init                   |
| 加载图片         | loadImage              |
| 加载音频         | loadSound              |
| 加载完成后的回调     | itemLoaded->this.onloa |

| 素材资源`Resouce` |            |
| ------------- | ---------- |
| 图像            | image      |
| 对象            | obj        |
| 路径            | src        |
| 音频            | sound      |
| Dom节点         | Dom        |
| 分数层           | scorelayer |
| 菜单层           | menulayer  |
| 加载层           | loadLayer  |
| 背景层           | bglayer    |
| 画板            | canvas     |
| 背景画板          | bgcanvas   |
| 分数值           | score      |

| 游戏过程`Game`  |       |
| ----------- | ----- |
| 最优循环器ID：RAF |       |
| 开始          | start |
| 试玩          | play  |
| 重置          | reset |




```seq
start->canvas: 重置canvas和bgcanvas的宽高为浏览器可视面积的宽高
start->SYS: 各个系统初始化并传入相关变量
start->Resource: 设置加载资源并将资源对象传入资源管理器
start->play: 加载完成后调用play
```

```flow

st=>start: 创建`boss`和`player`
op1=>operation: 绘制背景
op2=>operation: 将`boss`插入优化树
op3=>operation: 帧率初始化
op4=>operation: 调用循环函数
op5=>operation: `boss`开火
op6=>operation: `player`开火
op7=>operation: 移动`player`到控制器坐标（目前为鼠标控制，后期添加键盘）
op8=>operation: 优化树检索`player`周围的物体并返回对象数组
co1=>condition: 遍历对象数组并判断其是否与`boss`和`player`发生碰撞
co2=>condition: 如果对象没删除或不是无敌
co3=>condition: 若对象的拥有者不是`player`且与`player`发生碰撞
coop1=>operation: 调用销毁函数（将removed标记置1）
coop2=>operation: `player`血量-1
e=>end

st->op1->op2->op3->op4->op5->op6->op7->op8->co1
co1(no)->e
co1(yes)->co2(yes)->co3(yes)->coop1->coop2->op4

```