!function(t){function e(s){if(i[s])return i[s].exports;var r=i[s]={exports:{},id:s,loaded:!1};return t[s].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var i={};return e.m=t,e.c=i,e.p="./",e(0)}({0:function(t,e,i){t.exports=i(14)},14:function(t,e,i){"use strict";i(20),i(16),!function(){var t=document.getElementById("tab-ctrl"),e=document.getElementById("tab-slider-container"),i=t.children,s=e.children[0].clientWidth;Array.prototype.forEach.call(i,function(i,r){i.onmouseover=function(){t.querySelector(".tab-selected").className="",this.className+="tab-selected",e.style.marginLeft=-s*r+"px"}})}(),addCarousel({carouselId:"carousel-wrap",mainId:"carousel-wrap-main",type:"wrap"}),addCarousel({carouselId:"carousel-fade",mainId:"carousel-fade-main",type:"fade",timeout:5e3})},16:function(t,e){"use strict";!function(){function t(t){var i=new e(t);return i.init(),i.resize(),i.create(),i.start(),i}function e(t){return t?void this.extend({carouselId:"carousel",mainId:"carousel-main",type:"wrap",width:"",cssImage:!1,timeout:3e3,direction:"left",btnColor:"#cf1132",markerActiveColor:"#cf1132",markerNormalColor:"#333"},t):alert("请填写目标元素id和按钮容器id")}return e.prototype={extend:function(t,e){for(var i in t)e.hasOwnProperty(i)&&(t[i]=e[i]),this[i]=t[i]},hasClass:function(t,e){return t.className.match(new RegExp("\\b"+e+"\\b"))},addClass:function(t,e){this.hasClass(t,e)||(t.className=t.className.split(" ").concat(e).join(" "))},removeClass:function(t,e){t.className=t.className.replace(new RegExp("\\b"+e+"\\b"),"")},init:function(){this.carousel=document.getElementById(this.carouselId),this.main=document.getElementById(this.mainId),this.main.img=this.main.getElementsByTagName("img"),this.carouselStyle=this.carousel.style,this.mainStyle=this.main.style,this.items=this.main.children,this.total=this.main.children.length,this.prevIndex=0,this.currIndex=0,this.interval=null,this.addClass(this.carousel,"carousel"),this.addClass(this.main,"carousel-main")},loaded:function(){},resize:function(){var t=this,e=this.main.img[0];this.width?(Array.prototype.forEach.call(this.main.img,function(e){e.width=t.width,e.onload=function(){this.width=t.width}}),this.carouselStyle.width=this.width+"px"):this.carouselStyle.width=e.width+"px",this.mainStyle.height=this.carouselStyle.height=e.height+"px",e.onload=function(){t.mainStyle.height=t.carouselStyle.height=this.height+"px"}},create:function(){function t(){var t=document.createElement("a");return t.href="javascript:;",t.style.position="absolute",t.style.top="50%",t.style.padding="20px 10px",t.style.color="white",t.style.backgroundColor=i.btnColor,t.style.display="block",t.style.zIndex="10",t}function e(){var t=document.createElement("a");return t.href="javascript:;",t.style.width="20px",t.style.height="20px",t.style.color="#fff",t.style.borderRadius="50%",t.style.backgroundColor=i.markerNormalColor,t.style.display="inline-block",t}var i=this;switch(this.type){case"fade":Array.prototype.forEach.call(this.main.children,function(t){t.style.opacity="0",t.style.transformDuration="1s"}),this.main.children[0].style.opacity="1";break;case"wrap":var s=this.items[0].cloneNode(!0),r=this.items[this.total-1].cloneNode(!0);this.main.insertBefore(r,this.items[0]),this.main.appendChild(s),Array.prototype.map.call(i.main.children,function(t,e){return t.style.left=i.main.offsetWidth*(e-1)+"px",t}),this.main.style.transformDuration="1s"}var n,a;n=t(),a=t(),n.style.left="0",a.style.right="0",n.innerHTML="<",a.innerHTML=">",n.onclick=function(){clearInterval(i.interval),i.start(),i.prev()},a.onclick=function(){clearInterval(i.interval),i.start(),i.next()},this.carousel.appendChild(n),this.carousel.appendChild(a);var o,l,h,c;for(c=document.createElement("div"),c.className="carousel-ctrl-nav",c.style.position="absolute",c.style.bottom="2%",c.style.width="100%",c.style.textAlign="center",c.style.zIndex="10",l=0,h=this.total;l<h;++l)o=e(),o.onclick=function(t){return function(){clearInterval(i.interval),i.start(),i.skip(t)}}(l),c.appendChild(o);this.carousel.appendChild(c),this.markerNumber=c.children,this.mark()},start:function(){var t=this;this.interval=setInterval(function(){t.next()},this.timeout)},mark:function(){this.markerNumber[this.prevIndex].style.backgroundColor=this.markerNormalColor,this.markerNumber[this.currIndex].style.backgroundColor=this.markerActiveColor},skip:function(t){this.currIndex=t,this.loop()},prev:function(){this.currIndex--,this.loop()},next:function(){this.currIndex++,this.loop()},loop:function(){switch(this.type){case"wrap":this.mainStyle.transform="translate3d("+-this.currIndex*this.main.offsetWidth+"px, 0, 0)",this.mainStyle.transitionDuration="1s",this.currIndex===this.total?(this.mainStyle.transform="translate3d("+this.main.offsetWidth+"px, 0, 0)",this.mainStyle.transitionDuration="0s",this.mainStyle.transform="translate3d("+0*this.main.offsetWidth+"px, 0, 0)",this.mainStyle.transitionDuration="1s"):this.currIndex===-1&&(this.mainStyle.transform="translate3d("+-this.total*this.main.offsetWidth+"px, 0, 0)",this.mainStyle.transitionDuration="0s",this.mainStyle.transform="translate3d("+(-this.total+1)*this.main.offsetWidth+"px, 0, 0)",this.mainStyle.transitionDuration="1s"),this.currIndex=this.currIndex<0?this.total-1:this.currIndex%this.total,this.mark(),this.prevIndex=this.currIndex;break;case"fade":this.currIndex=this.currIndex<0?this.total-1:this.currIndex%this.total,this.items[this.prevIndex].style.opacity="0",this.items[this.currIndex].style.opacity="1",this.mark(),this.prevIndex=this.currIndex}this.mark()}},window.addCarousel=t,t}()},20:function(t,e){}});