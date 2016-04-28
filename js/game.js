!function(e){function t(i){if(n[i])return n[i].exports;var o=n[i]={exports:{},id:i,loaded:!1};return e[i].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="./",t(0)}([function(e,t,n){e.exports=n(9)},function(e,t){e.exports={Emitter:[{orignX:36,orignY:64,orignWidth:6,orignHeight:14,speed:20,number:15,limit:5,spacing:100,timeout:500,propulsiontype:"line",type:"circle"},{orignX:64,orignY:448,orignWidth:64,orignHeight:64,speed:2,number:15,limit:5,spacing:50,timeout:500,propulsiontype:"circle",type:"circle"},{orignX:32,orignY:32,orignWidth:16,orignHeight:16,speed:5,number:15,limit:5,spacing:50,timeout:1500,propulsiontype:"circle",type:"circle"},{orignX:128,orignY:208,orignWidth:32,orignHeight:32,speed:10,number:25,limit:5,spacing:50,timeout:1500,propulsiontype:"test",type:"circle"},{orignX:192,orignY:256,orignWidth:32,orignHeight:32,speed:10,number:9,limit:5,spacing:50,timeout:1500,propulsiontype:"test",type:"circle"},{orignX:64,orignY:448,orignWidth:64,orignHeight:64,speed:10,number:6,limit:5,spacing:50,timeout:1500,propulsiontype:"test",type:"circle"},{orignX:32,orignY:32,orignWidth:16,orignHeight:16,speed:10,number:15,limit:5,spacing:50,timeout:1500,propulsiontype:"test",type:"circle"},{orignX:32,orignY:32,orignWidth:16,orignHeight:16,speed:10,number:15,limit:5,spacing:50,timeout:1500,propulsiontype:"test",type:"circle"}],Explosion:[{orignX:0,orignY:0,orignWidth:62,orignHeight:63}],Boss:[{orignX:0,orignY:1712,orignWidth:48,orignHeight:48,HP:10}],Player:[{orignX:0,orignY:294,orignWidth:90,orignHeight:90,HP:5}]}},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=function(){function e(t,i,o,r){n(this,e),Object.assign(this,{x:t,y:i,cx:t+o/2,cy:i+r/2,width:o,height:r,halfWidth:o/2,halfHeight:r/2})}return i(e,[{key:"move",value:function(e,t){this.x=e-this.halfWidth,this.y=t-this.halfHeight,this.cx=e,this.cy=t}},{key:"resize",value:function(e){this.width*=e,this.height*=e,this.halfWidth*=e,this.halfHeight*=e}},{key:"carve",value:function(t){var n=[],i=[],o=t.cx,r=t.cy,s=o-this.x,a=r-this.y,u=s>0&&s<this.width,c=a>0&&a<this.height;if(u&&c)for(i=this.carve(o,this.y);i.length;)n=n.concat(i.shift().carve(this.x,r));else u?n.push(new e(this.x,this.y,s,this.height),new e(o,this.y,this.width-s,this.height)):c&&n.push(new e(this.x,this.y,this.width,a),new e(this.x,r,this.width,this.height-a));return n}}]),e}();t["default"]=o},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),u=n(2),c=i(u),l=n(12),h=i(l),d=n(1),f=i(d),p=function(e){function t(e,n){o(this,t);var i=r(this,Object.getPrototypeOf(t).call(this,0,0,n.orignWidth,n.orignHeight));return Object.assign(i,{img:e,orignX:n.orignX,orignY:n.orignY,orignWidth:n.orignWidth,orignHeight:n.orignHeight,mapX:n.orignX,mapY:n.orignY,mapWidth:n.orignWidth,mapHeight:n.orignHeight,removed:!1,undead:!1}),i}return s(t,e),a(t,[{key:"draw",value:function(e){e.drawImage(this.img,this.orignX,this.orignY,this.orignWidth,this.orignHeight,this.cx-this.mapWidth/2,this.cy-this.mapHeight/2,this.mapWidth,this.mapHeight)}},{key:"change",value:function(e){this.orignX=Math.round(e*this.orignWidth)}},{key:"remap",value:function(e){this.mapWidth*=e,this.mapHeight*=e}},{key:"name",value:function(e){this.name=e}},{key:"go",value:function(){}},{key:"destroy",value:function(e,n){var i=new t(e,f["default"].Explosion[0]);i.move(this.cx,this.cy),i.undead=!0,(0,h["default"])(i,0,15,75,n),this.removed=!0}}]),t}(c["default"]);t["default"]=p},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),u=function d(e,t,n){null===e&&(e=Function.prototype);var i=Object.getOwnPropertyDescriptor(e,t);if(void 0===i){var o=Object.getPrototypeOf(e);return null===o?void 0:d(o,t,n)}if("value"in i)return i.value;var r=i.get;if(void 0!==r)return r.call(n)},c=n(3),l=i(c),h=function(e){function t(e,n,i,s){o(this,t);var a=r(this,Object.getPrototypeOf(t).call(this,e,s));return u(Object.getPrototypeOf(t.prototype),"move",a).call(a,n,i),Object.assign(a,{angle:0,dist:0,propulsiontype:null}),a}return s(t,e),a(t,[{key:"set",value:function(e,t,n){this.angle=e,this.dist=t,this.propulsiontype=n}},{key:"go",value:function(){this[this.propulsiontype](this.angle,this.dist)}},{key:"motion",value:function(e,t){this.cx+=e,this.cy+=t,this.x+=e,this.y+=t}},{key:"gravity",value:function(){this.cy+=5,this.y+=5}},{key:"line",value:function(e,t){this.motion(e,t)}},{key:"circle",value:function(e,t){var n=Math.round(Math.sin(e)*t),i=Math.round(Math.cos(e)*t);this.motion(n,i)}},{key:"test",value:function(e,t){var n=Math.round(Math.sin(e)*t),i=Math.round(Math.sqrt(t));this.motion(n,i)}}]),t}(l["default"]);t["default"]=h},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t){return Math.floor(Math.random()*(t-e)+e)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),c=function y(e,t,n){null===e&&(e=Function.prototype);var i=Object.getOwnPropertyDescriptor(e,t);if(void 0===i){var o=Object.getPrototypeOf(e);return null===o?void 0:y(o,t,n)}if("value"in i)return i.value;var r=i.get;if(void 0!==r)return r.call(n)},l=n(3),h=i(l),d=n(6),f=i(d),p=n(1),m=i(p),g=function(e){function t(e,n,i,s){o(this,t);var a=r(this,Object.getPrototypeOf(t).call(this,e,s)),u=m["default"].Emitter[2];return a.emitterConfig=u,c(Object.getPrototypeOf(t.prototype),"remap",a).call(a,2.5),c(Object.getPrototypeOf(t.prototype),"resize",a).call(a,2),c(Object.getPrototypeOf(t.prototype),"move",a).call(a,n,i),a.HP=s.HP,a.emitter={main:new f["default"](e,n,i),speed:u.speed,num:u.number,limit:u.limit,spacing:u.spacing,timeout:u.timeout,type:u.type,dist:0},a.fireTimes=0,a.fireSwitch=!0,a}return s(t,e),u(t,[{key:"setEmitter",value:function(e){Object.assign(this.emitter,e)}},{key:"fire",value:function(e){var t=this;if(this.fireSwitch){if(this.emitter.dist<this.emitter.spacing)return this.emitter.dist+=this.emitter.speed;if(this.emitter.dist=0,this.fireTimes>this.emitter.limit)return this.emitterConfig=m["default"].Emitter[a(1,m["default"].Emitter.length)],this.setEmitter(this.emitterConfig),this.fireTimes=0,this.fireSwitch=!1,setTimeout(function(){t.fireSwitch=!0},this.emitter.timeout);this.fireTimes++,this.emitter.main[this.emitter.type](this.emitterConfig,e)}}},{key:"ceasefire",value:function(){this.fire=new Function}},{key:"hit",value:function(){this.HP--}}]),t}(h["default"]);t["default"]=g},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),s=n(4),a=i(s),u=function(){function e(t,n,i){o(this,e),this.img=t,this.cx=n,this.cy=i}return r(e,[{key:"circle",value:function(e,t){var n=void 0,i=void 0,o=void 0,r=void 0,s=void 0;n=e.number,i=e.speed,o=e.propulsiontype;for(var u=1;n+1>u;++u)r=2*Math.PI*u/n,s=new a["default"](this.img,this.cx,this.cy,e),s.owner="boss",s.set(r,i,o),t.insert(s)}}]),e}();t["default"]=u},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),u=function g(e,t,n){null===e&&(e=Function.prototype);var i=Object.getOwnPropertyDescriptor(e,t);if(void 0===i){var o=Object.getPrototypeOf(e);return null===o?void 0:g(o,t,n)}if("value"in i)return i.value;var r=i.get;if(void 0!==r)return r.call(n)},c=n(3),l=i(c),h=n(4),d=i(h),f=n(1),p=i(f),m=function(e){function t(e,n,i,s){o(this,t);var a=r(this,Object.getPrototypeOf(t).call(this,e,s));u(Object.getPrototypeOf(t.prototype),"move",a).call(a,n,i),u(Object.getPrototypeOf(t.prototype),"resize",a).call(a,.8);var c=p["default"].Emitter[0];return a.HP=s.HP,a.emitter={img:e,speed:c.speed,num:c.number,limit:c.limit,timeout:c.timeout,propulsiontype:c.propulsiontype,type:c.type,spacing:100,dist:0},a}return s(t,e),a(t,[{key:"fire",value:function(e){if(this.emitter.dist+=this.emitter.speed,!(this.emitter.dist<this.emitter.spacing)){this.emitter.dist=0;var t=new d["default"](this.img,this.cx,this.cy,p["default"].Emitter[0]);t.owner="player",t.set(1,-this.emitter.speed,this.emitter.propulsiontype),e.insert(t)}}},{key:"hit",value:function(){this.HP--}},{key:"ceasefire",value:function(){this.fire=new Function}}]),t}(l["default"]);t["default"]=m},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){return e.x+e.width>=t.x&&e.y+e.height>=t.y&&e.x-e.width<=t.x+t.width&&e.y-e.height<=t.y+t.height}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=n(2),u=i(a),c=function(){function e(t,n){o(this,e),this.objects=[],this.nodes=[],this.level="undefined"==typeof n?0:n,this.bounds=t}return s(e,[{key:"clear",value:function(){var e=this.nodes,t=void 0;for(this.objects.splice(0,this.objects.length);e.length;)t=e.shift(),t.clear()}},{key:"getIndex",value:function(e){var t=this.bounds,n=e.y+e.height<=t.cy,i=e.y>=t.cy,o=e.x+e.width<=t.cx,r=e.x>=t.cx;if(n){if(r)return 0;if(o)return 1}else if(i){if(o)return 2;if(r)return 3}return-1}},{key:"split",value:function(){var t=this.level,n=this.bounds,i=n.x,o=n.y,r=n.cx,s=n.cy,a=n.width/2,c=n.height/2;this.nodes.push(new e(new u["default"](r,o,a,c),t+1),new e(new u["default"](i,o,a,c),t+1),new e(new u["default"](i,s,a,c),t+1),new e(new u["default"](r,s,a,c),t+1))}},{key:"insert",value:function(e){var t=this.objects,n=void 0,i=void 0;if(this.nodes.length&&(i=this.getIndex(e),-1!==i))return void this.nodes[i].insert(e);if(t.push(e),!this.nodes.length&&this.objects.length>this.MAX_OBJECTS&&this.level<this.MAX_LEVELS)for(this.split(),n=t.length-1;n>=0;n--)i=this.getIndex(t[n]),-1!==i&&this.nodes[i].insert(t.splice(n,1)[0])}},{key:"retrieve",value:function(e){var t=[],n=void 0,i=void 0,o=void 0;if(this.nodes.length)if(o=this.getIndex(e),-1!==o)t=t.concat(this.nodes[o].retrieve(e));else for(n=e.carve(this.bounds),i=n.length-1;i>=0&&(o=this.getIndex(n[i]),-1!==o);i--)t=t.concat(this.nodes[o].retrieve(e));return t=t.concat(this.objects)}},{key:"refresh",value:function(e){var t=this.objects,n=[],i=void 0,o=void 0,s=void 0,a=void 0;for(e=e||this,s=t.length-1;s>=0;s--)i=t[s],!i.removed&&r(i,e.bounds)?(o=this.getIndex(i),-1!==o&&r(i,this.bounds)?this.nodes.length&&this.nodes[o].insert(t.splice(s,1)[0]):this!==e&&e.insert(t.splice(s,1)[0])):this.objects.splice(s,1);for(s=0,a=this.nodes.length;a>s;s++)n=n.concat(this.nodes[s].refresh(e));return n=n.concat(t)}}]),e}();t["default"]=c,c.prototype.MAX_OBJECTS=10,c.prototype.MAX_LEVELS=5},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}var o=n(5),r=i(o),s=n(7),a=i(s),u=n(8),c=i(u),l=n(2),h=i(l);n(14);var d=n(13),f=i(d),p=n(1),m=i(p);!function(){for(var e=0,t=["ms","moz","webkit","o"],n=0;n<t.length&&!window.requestAnimationFrame;n++)window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[t[n]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t){var n=(new Date).getTime(),i=Math.max(0,16-(n-e)),o=window.setTimeout(function(){t(n+i)},i);return e=n+i,o}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})}();var g={Collision:null,Render:null,Loader:null,Control:null,Resource:null,Setting:null,Dom:null};g.Loader={layer:null,loaded:!0,loadedCount:0,totalCount:0,soundFileExtn:".ogg",init:function(e){var t=void 0,n=void 0,i=document.createElement("audio");i.canPlayType?(t=""!=i.canPlayType("audio/mpeg"),n=""!=i.canPlayType('audio/ogg; codecs = "vorbis"')):(t=!1,n=!1),this.soundFileExtn=n?".ogg":t?".mp3":void 0,this.layer=e},itemLoaded:function(){this.loadedCount++,this.loadedCount===this.totalCount&&(this.loaded=!0,this.layer.style.display="none",this.onload&&(this.onload(),this.onload=void 0))},loadImages:function(e){var t=this;this.totalCount++,this.loaded=!1,this.layer.style.display="block";var n=new Image;return n.src=e,n.onload=function(){return t.itemLoaded()},n},loadSound:function(e){this.totalCount++,this.loaded=!1,this.layer.style.display="block";var t=new Audio;return t.src=e+this.soundFileExtn,t.addEventListener("canplaythrough",this.itemLoaded,!1),t}},g.Control={startPos:{x:0,y:0},movePos:{x:0,y:0},eventList:[],callbackList:[],addHandler:function(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent?e.attachEvent("on"+t,n):e["on"+t]=n},init:function(e){var t=this;e=e||document;var n="ontouchstart"in document?"touchstart":"mousedown",i="ontouchmove"in document?"touchmove":"mousemove",o="ontouchend"in document?"touchend":"mouseup",r=function(e){e=e||window.event;var n="ontouchstart"in document?e.touches[0]:e;t.startPos={x:n.pageX,y:n.pageY},t.movePos=t.startPos},s=function(e){e=e||window.event;var n="ontouchstart"in document?e.touches[0]:e;t.movePos={x:n.pageX,y:n.pageY},e.preventDefault()},a=function(e){e=e||event;for(var n=0,i=t.eventList.length;i>n;n++)t.event[t.eventList[n]](t.callbackList[n].cb,t,e)};this.addHandler(e,n,r),this.addHandler(e,i,s),this.addHandler(e,o,a)},on:function(e,t){return this.eventList.push(e),this.callbackList.push({cb:t}),this},event:{tap:function(e,t,n){Math.abs(t.movePos.x-t.startPos.x)>1||Math.abs(t.movePos.y-t.startPos.y)>1||e(n)},swipe:function(e,t,n){return e(n),t.movePos={x:0,y:0}}}},g.Collision={Tree:null,init:function(e){this.Tree=e},check:function(e,t){var n=Math.abs(e.cx-t.cx),i=Math.abs(e.cy-t.cy);return n<(e.width+t.width)/2&&i<(e.height+t.height)/2}},g.Render={canvas:null,ctx:null,renderWidth:0,renderHeight:0,Queue:[],init:function(e){this.canvas=e,this.ctx=e.getContext("2d"),this.renderWidth=e.width,this.renderHeight=e.height},add:function(e){this.Queue=this.Queue.concat(e)},empty:function(){this.Queue=[]},clear:function(){this.ctx.clearRect(0,0,this.renderWidth,this.renderHeight)},render:function(){var e=this;this.Queue.forEach(function(t){t.go(),t.draw(e.ctx)})}},g.Dom={scorelayer:document.getElementById("score-layer"),menulayer:document.getElementById("menu-layer"),resetlayer:document.getElementById("reset-layer"),loadlayer:document.getElementById("load-layer"),bglayer:document.getElementById("bg-layer"),canvas:document.getElementById("draw-target"),bgcanvas:document.getElementById("bg-target"),score:document.getElementById("score")},g.Resource={images:{},sounds:{}};var y={RAF:null,start:function(){var e=this;g.Dom.canvas.width=document.documentElement.clientWidth,g.Dom.canvas.height=document.documentElement.clientHeight,g.Dom.canvas.backgroundAlpha=0,g.Dom.bgcanvas.width=document.documentElement.clientWidth,g.Dom.bgcanvas.height=document.documentElement.clientHeight;var t=new c["default"](new h["default"](0,0,g.Dom.canvas.width,g.Dom.canvas.height));g.Collision.init(t),g.Render.init(g.Dom.canvas),g.Control.init(document),g.Loader.init(g.Dom.loadlayer),g.Resource.images.all=g.Loader.loadImages(f["default"].images.ALL),g.Resource.images.player=g.Loader.loadImages(f["default"].images.PLAYER),g.Resource.images.explosion=g.Loader.loadImages(f["default"].images.EXPLOSION),g.Resource.images.bg=g.Loader.loadImages(f["default"].images.BG),g.Loader.onload=function(){return e.play()}},play:function(){var e=this,t=[],n=new r["default"](g.Resource.images.all,g.Render.renderWidth/2,g.Render.renderHeight/5,m["default"].Boss[0]),i=new a["default"](g.Resource.images.player,g.Render.renderWidth/2,g.Render.renderHeight,m["default"].Player[0]);g.Dom.bgcanvas.getContext("2d").drawImage(g.Resource.images.bg,0,0,g.Dom.bgcanvas.width,g.Dom.bgcanvas.height);var o=g.Collision.Tree,s=g.Resource.images.explosion;o.insert(n),v.init();var u=function c(){e.RAF=window.requestAnimationFrame(c),n.fire(o),i.fire(o),i.move(g.Control.movePos.x,g.Control.movePos.y),t=o.retrieve(i),t.forEach(function(t){t.removed||t.undead||("player"!==t.owner&&g.Collision.check(i,t)?(t.destroy(s,o),i.hit(),i.HP<=0&&(i.destroy(s,o),i.ceasefire(),setTimeout(function(){g.Dom.resetlayer.style.display="block",window.cancelAnimationFrame(e.RAF)},1e3))):"player"===t.owner&&g.Collision.check(n,t)&&(t.destroy(s,o),n.hit(),g.Dom.score.innerHTML=parseInt(g.Dom.score.innerHTML)+100,n.HP<=0&&(n.destroy(s,o),n.ceasefire(),setTimeout(function(){g.Dom.resetlayer.style.display="block",window.cancelAnimationFrame(e.RAF)},1e3))))}),t=g.Collision.Tree.refresh(),g.Render.add(i),g.Render.add(t),g.Render.clear(),g.Render.render(),g.Render.empty(),v.show()};this.RAF=window.requestAnimationFrame(u),g.Control.on("tap",function(t){t=t||window.event;var n=t.srcElement||t.target;"reset"==n.id&&e.reset()})},reset:function(){window.cancelAnimationFrame(this.RAF),g.Render.clear(),g.Render.empty(),g.Dom.score.innerHTML="0",g.Dom.resetlayer.style.display="none",g.Collision.Tree.clear(),this.play()},end:function(){}},v={layer:null,startTime:null,endTime:null,frame:0,init:function(){this.startTime=+new Date,this.layer=document.getElementById("fps")},show:function(){this.endTime=+new Date,this.frame=Math.round(1e3/(this.endTime-this.startTime)),this.startTime=this.endTime,this.layer.innerHTML=this.frame}};y.start()},,,function(e,t){"use strict";function n(e,t,n,i,o){var r=void 0;!function s(){return t>=n?(e.removed=!0,e.undead=!1,void clearTimeout(r)):(e.change(++t),o.insert(e),void(r=setTimeout(s,i)))}()}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(16),r=i(o),s=n(19),a=i(s),u=n(18),c=i(u),l=n(17),h=i(l);t["default"]={images:{ALL:r["default"],PLAYER:a["default"],EXPLOSION:c["default"],BG:h["default"]},sounds:[]}},function(e,t){},,function(e,t,n){e.exports=n.p+"images/all.png"},function(e,t,n){e.exports=n.p+"images/bg.png"},function(e,t,n){e.exports=n.p+"images/explosion.png"},function(e,t,n){e.exports=n.p+"images/player.png"}]);
//# sourceMappingURL=game.js.map