/*!
* jQuery Cycle2; version: 2.1.6 build: 20141007
* http://jquery.malsup.com/cycle2/
* Copyright (c) 2014 M. Alsup; Dual licensed: MIT/GPL
*/;(function($){"use strict";var version='2.1.6';$.fn.cycle=function(options){var o;if(this.length===0&&!$.isReady){o={s:this.selector,c:this.context};$.fn.cycle.log('requeuing slideshow (dom not ready)');$(function(){$(o.s,o.c).cycle(options);});return this;}
return this.each(function(){var data,opts,shortName,val;var container=$(this);var log=$.fn.cycle.log;if(container.data('cycle.opts'))
return;if(container.data('cycle-log')===false||(options&&options.log===false)||(opts&&opts.log===false)){log=$.noop;}
log('--c2 init--');data=container.data();for(var p in data){if(data.hasOwnProperty(p)&&/^cycle[A-Z]+/.test(p)){val=data[p];shortName=p.match(/^cycle(.*)/)[1].replace(/^[A-Z]/,lowerCase);log(shortName+':',val,'('+typeof val+')');data[shortName]=val;}}
opts=$.extend({},$.fn.cycle.defaults,data,options||{});opts.timeoutId=0;opts.paused=opts.paused||false;opts.container=container;opts._maxZ=opts.maxZ;opts.API=$.extend({_container:container},$.fn.cycle.API);opts.API.log=log;opts.API.trigger=function(eventName,args){opts.container.trigger(eventName,args);return opts.API;};container.data('cycle.opts',opts);container.data('cycle.API',opts.API);opts.API.trigger('cycle-bootstrap',[opts,opts.API]);opts.API.addInitialSlides();opts.API.preInitSlideshow();if(opts.slides.length)
opts.API.initSlideshow();});};$.fn.cycle.API={opts:function(){return this._container.data('cycle.opts');},addInitialSlides:function(){var opts=this.opts();var slides=opts.slides;opts.slideCount=0;opts.slides=$();slides=slides.jquery?slides:opts.container.find(slides);if(opts.random){slides.sort(function(){return Math.random()-0.5;});}
opts.API.add(slides);},preInitSlideshow:function(){var opts=this.opts();opts.API.trigger('cycle-pre-initialize',[opts]);var tx=$.fn.cycle.transitions[opts.fx];if(tx&&$.isFunction(tx.preInit))
tx.preInit(opts);opts._preInitialized=true;},postInitSlideshow:function(){var opts=this.opts();opts.API.trigger('cycle-post-initialize',[opts]);var tx=$.fn.cycle.transitions[opts.fx];if(tx&&$.isFunction(tx.postInit))
tx.postInit(opts);},initSlideshow:function(){var opts=this.opts();var pauseObj=opts.container;var slideOpts;opts.API.calcFirstSlide();if(opts.container.css('position')=='static')
opts.container.css('position','relative');$(opts.slides[opts.currSlide]).css({opacity:1,display:'block',visibility:'visible'});opts.API.stackSlides(opts.slides[opts.currSlide],opts.slides[opts.nextSlide],!opts.reverse);if(opts.pauseOnHover){if(opts.pauseOnHover!==true)
pauseObj=$(opts.pauseOnHover);pauseObj.hover(function(){opts.API.pause(true);},function(){opts.API.resume(true);});}
if(opts.timeout){slideOpts=opts.API.getSlideOpts(opts.currSlide);opts.API.queueTransition(slideOpts,slideOpts.timeout+opts.delay);}
opts._initialized=true;opts.API.updateView(true);opts.API.trigger('cycle-initialized',[opts]);opts.API.postInitSlideshow();},pause:function(hover){var opts=this.opts(),slideOpts=opts.API.getSlideOpts(),alreadyPaused=opts.hoverPaused||opts.paused;if(hover)
opts.hoverPaused=true;else
opts.paused=true;if(!alreadyPaused){opts.container.addClass('cycle-paused');opts.API.trigger('cycle-paused',[opts]).log('cycle-paused');if(slideOpts.timeout){clearTimeout(opts.timeoutId);opts.timeoutId=0;opts._remainingTimeout-=($.now()-opts._lastQueue);if(opts._remainingTimeout<0||isNaN(opts._remainingTimeout))
opts._remainingTimeout=undefined;}}},resume:function(hover){var opts=this.opts(),alreadyResumed=!opts.hoverPaused&&!opts.paused,remaining;if(hover)
opts.hoverPaused=false;else
opts.paused=false;if(!alreadyResumed){opts.container.removeClass('cycle-paused');if(opts.slides.filter(':animated').length===0)
opts.API.queueTransition(opts.API.getSlideOpts(),opts._remainingTimeout);opts.API.trigger('cycle-resumed',[opts,opts._remainingTimeout]).log('cycle-resumed');}},add:function(slides,prepend){var opts=this.opts();var oldSlideCount=opts.slideCount;var startSlideshow=false;var len;if($.type(slides)=='string')
slides=$.trim(slides);$(slides).each(function(i){var slideOpts;var slide=$(this);if(prepend)
opts.container.prepend(slide);else
opts.container.append(slide);opts.slideCount++;slideOpts=opts.API.buildSlideOpts(slide);if(prepend)
opts.slides=$(slide).add(opts.slides);else
opts.slides=opts.slides.add(slide);opts.API.initSlide(slideOpts,slide,--opts._maxZ);slide.data('cycle.opts',slideOpts);opts.API.trigger('cycle-slide-added',[opts,slideOpts,slide]);});opts.API.updateView(true);startSlideshow=opts._preInitialized&&(oldSlideCount<2&&opts.slideCount>=1);if(startSlideshow){if(!opts._initialized)
opts.API.initSlideshow();else if(opts.timeout){len=opts.slides.length;opts.nextSlide=opts.reverse?len-1:1;if(!opts.timeoutId){opts.API.queueTransition(opts);}}}},calcFirstSlide:function(){var opts=this.opts();var firstSlideIndex;firstSlideIndex=parseInt(opts.startingSlide||0,10);if(firstSlideIndex>=opts.slides.length||firstSlideIndex<0)
firstSlideIndex=0;opts.currSlide=firstSlideIndex;if(opts.reverse){opts.nextSlide=firstSlideIndex-1;if(opts.nextSlide<0)
opts.nextSlide=opts.slides.length-1;}
else{opts.nextSlide=firstSlideIndex+1;if(opts.nextSlide==opts.slides.length)
opts.nextSlide=0;}},calcNextSlide:function(){var opts=this.opts();var roll;if(opts.reverse){roll=(opts.nextSlide-1)<0;opts.nextSlide=roll?opts.slideCount-1:opts.nextSlide-1;opts.currSlide=roll?0:opts.nextSlide+1;}
else{roll=(opts.nextSlide+1)==opts.slides.length;opts.nextSlide=roll?0:opts.nextSlide+1;opts.currSlide=roll?opts.slides.length-1:opts.nextSlide-1;}},calcTx:function(slideOpts,manual){var opts=slideOpts;var tx;if(opts._tempFx)
tx=$.fn.cycle.transitions[opts._tempFx];else if(manual&&opts.manualFx)
tx=$.fn.cycle.transitions[opts.manualFx];if(!tx)
tx=$.fn.cycle.transitions[opts.fx];opts._tempFx=null;this.opts()._tempFx=null;if(!tx){tx=$.fn.cycle.transitions.fade;opts.API.log('Transition "'+opts.fx+'" not found.  Using fade.');}
return tx;},prepareTx:function(manual,fwd){var opts=this.opts();var after,curr,next,slideOpts,tx;if(opts.slideCount<2){opts.timeoutId=0;return;}
if(manual&&(!opts.busy||opts.manualTrump)){opts.API.stopTransition();opts.busy=false;clearTimeout(opts.timeoutId);opts.timeoutId=0;}
if(opts.busy)
return;if(opts.timeoutId===0&&!manual)
return;curr=opts.slides[opts.currSlide];next=opts.slides[opts.nextSlide];slideOpts=opts.API.getSlideOpts(opts.nextSlide);tx=opts.API.calcTx(slideOpts,manual);opts._tx=tx;if(manual&&slideOpts.manualSpeed!==undefined)
slideOpts.speed=slideOpts.manualSpeed;if(opts.nextSlide!=opts.currSlide&&(manual||(!opts.paused&&!opts.hoverPaused&&opts.timeout))){opts.API.trigger('cycle-before',[slideOpts,curr,next,fwd]);if(tx.before)
tx.before(slideOpts,curr,next,fwd);after=function(){opts.busy=false;if(!opts.container.data('cycle.opts'))
return;if(tx.after)
tx.after(slideOpts,curr,next,fwd);opts.API.trigger('cycle-after',[slideOpts,curr,next,fwd]);opts.API.queueTransition(slideOpts);opts.API.updateView(true);};opts.busy=true;if(tx.transition)
tx.transition(slideOpts,curr,next,fwd,after);else
opts.API.doTransition(slideOpts,curr,next,fwd,after);opts.API.calcNextSlide();opts.API.updateView();}else{opts.API.queueTransition(slideOpts);}},doTransition:function(slideOpts,currEl,nextEl,fwd,callback){var opts=slideOpts;var curr=$(currEl),next=$(nextEl);var fn=function(){next.animate(opts.animIn||{opacity:1},opts.speed,opts.easeIn||opts.easing,callback);};next.css(opts.cssBefore||{});curr.animate(opts.animOut||{},opts.speed,opts.easeOut||opts.easing,function(){curr.css(opts.cssAfter||{});if(!opts.sync){fn();}});if(opts.sync){fn();}},queueTransition:function(slideOpts,specificTimeout){var opts=this.opts();var timeout=specificTimeout!==undefined?specificTimeout:slideOpts.timeout;if(opts.nextSlide===0&&--opts.loop===0){opts.API.log('terminating; loop=0');opts.timeout=0;if(timeout){setTimeout(function(){opts.API.trigger('cycle-finished',[opts]);},timeout);}
else{opts.API.trigger('cycle-finished',[opts]);}
opts.nextSlide=opts.currSlide;return;}
if(opts.continueAuto!==undefined){if(opts.continueAuto===false||($.isFunction(opts.continueAuto)&&opts.continueAuto()===false)){opts.API.log('terminating automatic transitions');opts.timeout=0;if(opts.timeoutId)
clearTimeout(opts.timeoutId);return;}}
if(timeout){opts._lastQueue=$.now();if(specificTimeout===undefined)
opts._remainingTimeout=slideOpts.timeout;if(!opts.paused&&!opts.hoverPaused){opts.timeoutId=setTimeout(function(){opts.API.prepareTx(false,!opts.reverse);},timeout);}}},stopTransition:function(){var opts=this.opts();if(opts.slides.filter(':animated').length){opts.slides.stop(false,true);opts.API.trigger('cycle-transition-stopped',[opts]);}
if(opts._tx&&opts._tx.stopTransition)
opts._tx.stopTransition(opts);},advanceSlide:function(val){var opts=this.opts();clearTimeout(opts.timeoutId);opts.timeoutId=0;opts.nextSlide=opts.currSlide+val;if(opts.nextSlide<0)
opts.nextSlide=opts.slides.length-1;else if(opts.nextSlide>=opts.slides.length)
opts.nextSlide=0;opts.API.prepareTx(true,val>=0);return false;},buildSlideOpts:function(slide){var opts=this.opts();var val,shortName;var slideOpts=slide.data()||{};for(var p in slideOpts){if(slideOpts.hasOwnProperty(p)&&/^cycle[A-Z]+/.test(p)){val=slideOpts[p];shortName=p.match(/^cycle(.*)/)[1].replace(/^[A-Z]/,lowerCase);opts.API.log('['+(opts.slideCount-1)+']',shortName+':',val,'('+typeof val+')');slideOpts[shortName]=val;}}
slideOpts=$.extend({},$.fn.cycle.defaults,opts,slideOpts);slideOpts.slideNum=opts.slideCount;try{delete slideOpts.API;delete slideOpts.slideCount;delete slideOpts.currSlide;delete slideOpts.nextSlide;delete slideOpts.slides;}catch(e){}
return slideOpts;},getSlideOpts:function(index){var opts=this.opts();if(index===undefined)
index=opts.currSlide;var slide=opts.slides[index];var slideOpts=$(slide).data('cycle.opts');return $.extend({},opts,slideOpts);},initSlide:function(slideOpts,slide,suggestedZindex){var opts=this.opts();slide.css(slideOpts.slideCss||{});if(suggestedZindex>0)
slide.css('zIndex',suggestedZindex);if(isNaN(slideOpts.speed))
slideOpts.speed=$.fx.speeds[slideOpts.speed]||$.fx.speeds._default;if(!slideOpts.sync)
slideOpts.speed=slideOpts.speed/2;slide.addClass(opts.slideClass);},updateView:function(isAfter,isDuring,forceEvent){var opts=this.opts();if(!opts._initialized)
return;var slideOpts=opts.API.getSlideOpts();var currSlide=opts.slides[opts.currSlide];if(!isAfter&&isDuring!==true){opts.API.trigger('cycle-update-view-before',[opts,slideOpts,currSlide]);if(opts.updateView<0)
return;}
if(opts.slideActiveClass){opts.slides.removeClass(opts.slideActiveClass).eq(opts.currSlide).addClass(opts.slideActiveClass);}
if(isAfter&&opts.hideNonActive)
opts.slides.filter(':not(.'+opts.slideActiveClass+')').css('visibility','hidden');if(opts.updateView===0){setTimeout(function(){opts.API.trigger('cycle-update-view',[opts,slideOpts,currSlide,isAfter]);},slideOpts.speed/(opts.sync?2:1));}
if(opts.updateView!==0)
opts.API.trigger('cycle-update-view',[opts,slideOpts,currSlide,isAfter]);if(isAfter)
opts.API.trigger('cycle-update-view-after',[opts,slideOpts,currSlide]);},getComponent:function(name){var opts=this.opts();var selector=opts[name];if(typeof selector==='string'){return(/^\s*[\>|\+|~]/).test(selector)?opts.container.find(selector):$(selector);}
if(selector.jquery)
return selector;return $(selector);},stackSlides:function(curr,next,fwd){var opts=this.opts();if(!curr){curr=opts.slides[opts.currSlide];next=opts.slides[opts.nextSlide];fwd=!opts.reverse;}
$(curr).css('zIndex',opts.maxZ);var i;var z=opts.maxZ-2;var len=opts.slideCount;if(fwd){for(i=opts.currSlide+1;i<len;i++)
$(opts.slides[i]).css('zIndex',z--);for(i=0;i<opts.currSlide;i++)
$(opts.slides[i]).css('zIndex',z--);}
else{for(i=opts.currSlide-1;i>=0;i--)
$(opts.slides[i]).css('zIndex',z--);for(i=len-1;i>opts.currSlide;i--)
$(opts.slides[i]).css('zIndex',z--);}
$(next).css('zIndex',opts.maxZ-1);},getSlideIndex:function(el){return this.opts().slides.index(el);}};$.fn.cycle.log=function log(){if(window.console&&console.log)
console.log('[cycle2] '+Array.prototype.join.call(arguments,' '));};$.fn.cycle.version=function(){return 'Cycle2: '+version;};function lowerCase(s){return(s||'').toLowerCase();}
$.fn.cycle.transitions={custom:{},none:{before:function(opts,curr,next,fwd){opts.API.stackSlides(next,curr,fwd);opts.cssBefore={opacity:1,visibility:'visible',display:'block'};}},fade:{before:function(opts,curr,next,fwd){var css=opts.API.getSlideOpts(opts.nextSlide).slideCss||{};opts.API.stackSlides(curr,next,fwd);opts.cssBefore=$.extend(css,{opacity:0,visibility:'visible',display:'block'});opts.animIn={opacity:1};opts.animOut={opacity:0};}},fadeout:{before:function(opts,curr,next,fwd){var css=opts.API.getSlideOpts(opts.nextSlide).slideCss||{};opts.API.stackSlides(curr,next,fwd);opts.cssBefore=$.extend(css,{opacity:1,visibility:'visible',display:'block'});opts.animOut={opacity:0};}},scrollHorz:{before:function(opts,curr,next,fwd){opts.API.stackSlides(curr,next,fwd);var w=opts.container.css('overflow','hidden').width();opts.cssBefore={left:fwd?w:-w,top:0,opacity:1,visibility:'visible',display:'block'};opts.cssAfter={zIndex:opts._maxZ-2,left:0};opts.animIn={left:0};opts.animOut={left:fwd?-w:w};}}};$.fn.cycle.defaults={allowWrap:true,autoSelector:'.cycle-slideshow[data-cycle-auto-init!=false]',delay:0,easing:null,fx:'fade',hideNonActive:true,loop:0,manualFx:undefined,manualSpeed:undefined,manualTrump:true,maxZ:100,pauseOnHover:false,reverse:false,slideActiveClass:'cycle-slide-active',slideClass:'cycle-slide',slideCss:{position:'absolute',top:0,left:0},slides:'> img',speed:500,startingSlide:0,sync:true,timeout:4000,updateView:0};$(document).ready(function(){$($.fn.cycle.defaults.autoSelector).cycle();});})(jQuery);/*!Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130913*/(function($){"use strict";$.extend($.fn.cycle.defaults,{autoHeight:0,autoHeightSpeed:250,autoHeightEasing:null});$(document).on('cycle-initialized',function(e,opts){var autoHeight=opts.autoHeight;var t=$.type(autoHeight);var resizeThrottle=null;var ratio;if(t!=='string'&&t!=='number')
return;opts.container.on('cycle-slide-added cycle-slide-removed',initAutoHeight);opts.container.on('cycle-destroyed',onDestroy);if(autoHeight=='container'){opts.container.on('cycle-before',onBefore);}
else if(t==='string'&&/\d+\:\d+/.test(autoHeight)){ratio=autoHeight.match(/(\d+)\:(\d+)/);ratio=ratio[1]/ratio[2];opts._autoHeightRatio=ratio;}
if(t!=='number'){opts._autoHeightOnResize=function(){clearTimeout(resizeThrottle);resizeThrottle=setTimeout(onResize,50);};$(window).on('resize orientationchange',opts._autoHeightOnResize);}
setTimeout(onResize,30);function onResize(){initAutoHeight(e,opts);}});function initAutoHeight(e,opts){var clone,height,sentinelIndex;var autoHeight=opts.autoHeight;if(autoHeight=='container'){height=$(opts.slides[opts.currSlide]).outerHeight();opts.container.height(height);}
else if(opts._autoHeightRatio){opts.container.height(opts.container.width()/opts._autoHeightRatio);}
else if(autoHeight==='calc'||($.type(autoHeight)=='number'&&autoHeight>=0)){if(autoHeight==='calc')
sentinelIndex=calcSentinelIndex(e,opts);else if(autoHeight>=opts.slides.length)
sentinelIndex=0;else
sentinelIndex=autoHeight;if(sentinelIndex==opts._sentinelIndex)
return;opts._sentinelIndex=sentinelIndex;if(opts._sentinel)
opts._sentinel.remove();clone=$(opts.slides[sentinelIndex].cloneNode(true));clone.removeAttr('id name rel').find('[id],[name],[rel]').removeAttr('id name rel');clone.css({position:'static',visibility:'hidden',display:'block'}).prependTo(opts.container).addClass('cycle-sentinel cycle-slide').removeClass('cycle-slide-active');clone.find('*').css('visibility','hidden');opts._sentinel=clone;}}
function calcSentinelIndex(e,opts){var index=0,max=-1;opts.slides.each(function(i){var h=$(this).height();if(h>max){max=h;index=i;}});return index;}
function onBefore(e,opts,outgoing,incoming,forward){var h=$(incoming).outerHeight();opts.container.animate({height:h},opts.autoHeightSpeed,opts.autoHeightEasing);}
function onDestroy(e,opts){if(opts._autoHeightOnResize){$(window).off('resize orientationchange',opts._autoHeightOnResize);opts._autoHeightOnResize=null;}
opts.container.off('cycle-slide-added cycle-slide-removed',initAutoHeight);opts.container.off('cycle-destroyed',onDestroy);opts.container.off('cycle-before',onBefore);if(opts._sentinel){opts._sentinel.remove();opts._sentinel=null;}}})(jQuery);/*!caption plugin for Cycle2; version: 20130306*/(function($){"use strict";$.extend($.fn.cycle.defaults,{caption:'> .cycle-caption',captionTemplate:'{{slideNum}} / {{slideCount}}',overlay:'> .cycle-overlay',overlayTemplate:'<div>{{title}}</div><div>{{desc}}</div>',captionModule:'caption'});$(document).on('cycle-update-view',function(e,opts,slideOpts,currSlide){if(opts.captionModule!=='caption')
return;var el;$.each(['caption','overlay'],function(){var name=this;var template=slideOpts[name+'Template'];var el=opts.API.getComponent(name);if(el.length&&template){el.html(opts.API.tmpl(template,slideOpts,opts,currSlide));el.show();}
else{el.hide();}});});$(document).on('cycle-destroyed',function(e,opts){var el;$.each(['caption','overlay'],function(){var name=this,template=opts[name+'Template'];if(opts[name]&&template){el=opts.API.getComponent('caption');el.empty();}});});})(jQuery);/*!command plugin for Cycle2; version: 20140415*/(function($){"use strict";var c2=$.fn.cycle;$.fn.cycle=function(options){var cmd,cmdFn,opts;var args=$.makeArray(arguments);if($.type(options)=='number'){return this.cycle('goto',options);}
if($.type(options)=='string'){return this.each(function(){var cmdArgs;cmd=options;opts=$(this).data('cycle.opts');if(opts===undefined){c2.log('slideshow must be initialized before sending commands; "'+cmd+'" ignored');return;}
else{cmd=cmd=='goto'?'jump':cmd;cmdFn=opts.API[cmd];if($.isFunction(cmdFn)){cmdArgs=$.makeArray(args);cmdArgs.shift();return cmdFn.apply(opts.API,cmdArgs);}
else{c2.log('unknown command: ',cmd);}}});}
else{return c2.apply(this,arguments);}};$.extend($.fn.cycle,c2);$.extend(c2.API,{next:function(){var opts=this.opts();if(opts.busy&&!opts.manualTrump)
return;var count=opts.reverse?-1:1;if(opts.allowWrap===false&&(opts.currSlide+count)>=opts.slideCount)
return;opts.API.advanceSlide(count);opts.API.trigger('cycle-next',[opts]).log('cycle-next');},prev:function(){var opts=this.opts();if(opts.busy&&!opts.manualTrump)
return;var count=opts.reverse?1:-1;if(opts.allowWrap===false&&(opts.currSlide+count)<0)
return;opts.API.advanceSlide(count);opts.API.trigger('cycle-prev',[opts]).log('cycle-prev');},destroy:function(){this.stop();var opts=this.opts();var clean=$.isFunction($._data)?$._data:$.noop;clearTimeout(opts.timeoutId);opts.timeoutId=0;opts.API.stop();opts.API.trigger('cycle-destroyed',[opts]).log('cycle-destroyed');opts.container.removeData();clean(opts.container[0],'parsedAttrs',false);if(!opts.retainStylesOnDestroy){opts.container.removeAttr('style');opts.slides.removeAttr('style');opts.slides.removeClass(opts.slideActiveClass);}
opts.slides.each(function(){var slide=$(this);slide.removeData();slide.removeClass(opts.slideClass);clean(this,'parsedAttrs',false);});},jump:function(index,fx){var fwd;var opts=this.opts();if(opts.busy&&!opts.manualTrump)
return;var num=parseInt(index,10);if(isNaN(num)||num<0||num>=opts.slides.length){opts.API.log('goto: invalid slide index: '+num);return;}
if(num==opts.currSlide){opts.API.log('goto: skipping, already on slide',num);return;}
opts.nextSlide=num;clearTimeout(opts.timeoutId);opts.timeoutId=0;opts.API.log('goto: ',num,' (zero-index)');fwd=opts.currSlide<opts.nextSlide;opts._tempFx=fx;opts.API.prepareTx(true,fwd);},stop:function(){var opts=this.opts();var pauseObj=opts.container;clearTimeout(opts.timeoutId);opts.timeoutId=0;opts.API.stopTransition();if(opts.pauseOnHover){if(opts.pauseOnHover!==true)
pauseObj=$(opts.pauseOnHover);pauseObj.off('mouseenter mouseleave');}
opts.API.trigger('cycle-stopped',[opts]).log('cycle-stopped');},reinit:function(){var opts=this.opts();opts.API.destroy();opts.container.cycle();},remove:function(index){var opts=this.opts();var slide,slideToRemove,slides=[],slideNum=1;for(var i=0;i<opts.slides.length;i++){slide=opts.slides[i];if(i==index){slideToRemove=slide;}
else{slides.push(slide);$(slide).data('cycle.opts').slideNum=slideNum;slideNum++;}}
if(slideToRemove){opts.slides=$(slides);opts.slideCount--;$(slideToRemove).remove();if(index==opts.currSlide)
opts.API.advanceSlide(1);else if(index<opts.currSlide)
opts.currSlide--;else
opts.currSlide++;opts.API.trigger('cycle-slide-removed',[opts,index,slideToRemove]).log('cycle-slide-removed');opts.API.updateView();}}});$(document).on('click.cycle','[data-cycle-cmd]',function(e){e.preventDefault();var el=$(this);var command=el.data('cycle-cmd');var context=el.data('cycle-context')||'.cycle-slideshow';$(context).cycle(command,el.data('cycle-arg'));});})(jQuery);/*!hash plugin for Cycle2; version: 20130905*/(function($){"use strict";$(document).on('cycle-pre-initialize',function(e,opts){onHashChange(opts,true);opts._onHashChange=function(){onHashChange(opts,false);};$(window).on('hashchange',opts._onHashChange);});$(document).on('cycle-update-view',function(e,opts,slideOpts){if(slideOpts.hash&&('#'+slideOpts.hash)!=window.location.hash){opts._hashFence=true;window.location.hash=slideOpts.hash;}});$(document).on('cycle-destroyed',function(e,opts){if(opts._onHashChange){$(window).off('hashchange',opts._onHashChange);}});function onHashChange(opts,setStartingSlide){var hash;if(opts._hashFence){opts._hashFence=false;return;}
hash=window.location.hash.substring(1);opts.slides.each(function(i){if($(this).data('cycle-hash')==hash){if(setStartingSlide===true){opts.startingSlide=i;}
else{var fwd=opts.currSlide<i;opts.nextSlide=i;opts.API.prepareTx(true,fwd);}
return false;}});}})(jQuery);/*!loader plugin for Cycle2; version: 20131121*/(function($){"use strict";$.extend($.fn.cycle.defaults,{loader:false});$(document).on('cycle-bootstrap',function(e,opts){var addFn;if(!opts.loader)
return;addFn=opts.API.add;opts.API.add=add;function add(slides,prepend){var slideArr=[];if($.type(slides)=='string')
slides=$.trim(slides);else if($.type(slides)==='array'){for(var i=0;i<slides.length;i++)
slides[i]=$(slides[i])[0];}
slides=$(slides);var slideCount=slides.length;if(!slideCount)
return;slides.css('visibility','hidden').appendTo('body').each(function(i){var count=0;var slide=$(this);var images=slide.is('img')?slide:slide.find('img');slide.data('index',i);images=images.filter(':not(.cycle-loader-ignore)').filter(':not([src=""])');if(!images.length){--slideCount;slideArr.push(slide);return;}
count=images.length;images.each(function(){if(this.complete){imageLoaded();}
else{$(this).load(function(){imageLoaded();}).on("error",function(){if(--count===0){opts.API.log('slide skipped; img not loaded:',this.src);if(--slideCount===0&&opts.loader=='wait'){addFn.apply(opts.API,[slideArr,prepend]);}}});}});function imageLoaded(){if(--count===0){--slideCount;addSlide(slide);}}});if(slideCount)
opts.container.addClass('cycle-loading');function addSlide(slide){var curr;if(opts.loader=='wait'){slideArr.push(slide);if(slideCount===0){slideArr.sort(sorter);addFn.apply(opts.API,[slideArr,prepend]);opts.container.removeClass('cycle-loading');}}
else{curr=$(opts.slides[opts.currSlide]);addFn.apply(opts.API,[slide,prepend]);curr.show();opts.container.removeClass('cycle-loading');}}
function sorter(a,b){return a.data('index')-b.data('index');}}});})(jQuery);/*!pager plugin for Cycle2; version: 20140415*/(function($){"use strict";$.extend($.fn.cycle.defaults,{pager:'> .cycle-pager',pagerActiveClass:'cycle-pager-active',pagerEvent:'click.cycle',pagerEventBubble:undefined,pagerTemplate:'<span>&bull;</span>'});$(document).on('cycle-bootstrap',function(e,opts,API){API.buildPagerLink=buildPagerLink;});$(document).on('cycle-slide-added',function(e,opts,slideOpts,slideAdded){if(opts.pager){opts.API.buildPagerLink(opts,slideOpts,slideAdded);opts.API.page=page;}});$(document).on('cycle-slide-removed',function(e,opts,index,slideRemoved){if(opts.pager){var pagers=opts.API.getComponent('pager');pagers.each(function(){var pager=$(this);$(pager.children()[index]).remove();});}});$(document).on('cycle-update-view',function(e,opts,slideOpts){var pagers;if(opts.pager){pagers=opts.API.getComponent('pager');pagers.each(function(){$(this).children().removeClass(opts.pagerActiveClass).eq(opts.currSlide).addClass(opts.pagerActiveClass);});}});$(document).on('cycle-destroyed',function(e,opts){var pager=opts.API.getComponent('pager');if(pager){pager.children().off(opts.pagerEvent);if(opts.pagerTemplate)
pager.empty();}});function buildPagerLink(opts,slideOpts,slide){var pagerLink;var pagers=opts.API.getComponent('pager');pagers.each(function(){var pager=$(this);if(slideOpts.pagerTemplate){var markup=opts.API.tmpl(slideOpts.pagerTemplate,slideOpts,opts,slide[0]);pagerLink=$(markup).appendTo(pager);}
else{pagerLink=pager.children().eq(opts.slideCount-1);}
pagerLink.on(opts.pagerEvent,function(e){if(!opts.pagerEventBubble)
e.preventDefault();opts.API.page(pager,e.currentTarget);});});}
function page(pager,target){var opts=this.opts();if(opts.busy&&!opts.manualTrump)
return;var index=pager.children().index(target);var nextSlide=index;var fwd=opts.currSlide<nextSlide;if(opts.currSlide==nextSlide){return;}
opts.nextSlide=nextSlide;opts._tempFx=opts.pagerFx;opts.API.prepareTx(true,fwd);opts.API.trigger('cycle-pager-activated',[opts,pager,target]);}})(jQuery);/*!prevnext plugin for Cycle2; version: 20140408*/(function($){"use strict";$.extend($.fn.cycle.defaults,{next:'> .cycle-next',nextEvent:'click.cycle',disabledClass:'disabled',prev:'> .cycle-prev',prevEvent:'click.cycle',swipe:false});$(document).on('cycle-initialized',function(e,opts){opts.API.getComponent('next').on(opts.nextEvent,function(e){e.preventDefault();opts.API.next();});opts.API.getComponent('prev').on(opts.prevEvent,function(e){e.preventDefault();opts.API.prev();});if(opts.swipe){var nextEvent=opts.swipeVert?'swipeUp.cycle':'swipeLeft.cycle swipeleft.cycle';var prevEvent=opts.swipeVert?'swipeDown.cycle':'swipeRight.cycle swiperight.cycle';opts.container.on(nextEvent,function(e){opts._tempFx=opts.swipeFx;opts.API.next();});opts.container.on(prevEvent,function(){opts._tempFx=opts.swipeFx;opts.API.prev();});}});$(document).on('cycle-update-view',function(e,opts,slideOpts,currSlide){if(opts.allowWrap)
return;var cls=opts.disabledClass;var next=opts.API.getComponent('next');var prev=opts.API.getComponent('prev');var prevBoundry=opts._prevBoundry||0;var nextBoundry=(opts._nextBoundry!==undefined)?opts._nextBoundry:opts.slideCount-1;if(opts.currSlide==nextBoundry)
next.addClass(cls).prop('disabled',true);else
next.removeClass(cls).prop('disabled',false);if(opts.currSlide===prevBoundry)
prev.addClass(cls).prop('disabled',true);else
prev.removeClass(cls).prop('disabled',false);});$(document).on('cycle-destroyed',function(e,opts){opts.API.getComponent('prev').off(opts.nextEvent);opts.API.getComponent('next').off(opts.prevEvent);opts.container.off('swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle');});})(jQuery);/*!progressive loader plugin for Cycle2; version: 20130315*/(function($){"use strict";$.extend($.fn.cycle.defaults,{progressive:false});$(document).on('cycle-pre-initialize',function(e,opts){if(!opts.progressive)
return;var API=opts.API;var nextFn=API.next;var prevFn=API.prev;var prepareTxFn=API.prepareTx;var type=$.type(opts.progressive);var slides,scriptEl;if(type=='array'){slides=opts.progressive;}
else if($.isFunction(opts.progressive)){slides=opts.progressive(opts);}
else if(type=='string'){scriptEl=$(opts.progressive);slides=$.trim(scriptEl.html());if(!slides)
return;if(/^(\[)/.test(slides)){try{slides=$.parseJSON(slides);}
catch(err){API.log('error parsing progressive slides',err);return;}}
else{slides=slides.split(new RegExp(scriptEl.data('cycle-split')||'\n'));if(!slides[slides.length-1])
slides.pop();}}
if(prepareTxFn){API.prepareTx=function(manual,fwd){var index,slide;if(manual||slides.length===0){prepareTxFn.apply(opts.API,[manual,fwd]);return;}
if(fwd&&opts.currSlide==(opts.slideCount-1)){slide=slides[0];slides=slides.slice(1);opts.container.one('cycle-slide-added',function(e,opts){setTimeout(function(){opts.API.advanceSlide(1);},50);});opts.API.add(slide);}
else if(!fwd&&opts.currSlide===0){index=slides.length-1;slide=slides[index];slides=slides.slice(0,index);opts.container.one('cycle-slide-added',function(e,opts){setTimeout(function(){opts.currSlide=1;opts.API.advanceSlide(-1);},50);});opts.API.add(slide,true);}
else{prepareTxFn.apply(opts.API,[manual,fwd]);}};}
if(nextFn){API.next=function(){var opts=this.opts();if(slides.length&&opts.currSlide==(opts.slideCount-1)){var slide=slides[0];slides=slides.slice(1);opts.container.one('cycle-slide-added',function(e,opts){nextFn.apply(opts.API);opts.container.removeClass('cycle-loading');});opts.container.addClass('cycle-loading');opts.API.add(slide);}
else{nextFn.apply(opts.API);}};}
if(prevFn){API.prev=function(){var opts=this.opts();if(slides.length&&opts.currSlide===0){var index=slides.length-1;var slide=slides[index];slides=slides.slice(0,index);opts.container.one('cycle-slide-added',function(e,opts){opts.currSlide=1;opts.API.advanceSlide(-1);opts.container.removeClass('cycle-loading');});opts.container.addClass('cycle-loading');opts.API.add(slide,true);}
else{prevFn.apply(opts.API);}};}});})(jQuery);/*!tmpl plugin for Cycle2; version: 20121227*/(function($){"use strict";$.extend($.fn.cycle.defaults,{tmplRegex:'{{((.)?.*?)}}'});$.extend($.fn.cycle.API,{tmpl:function(str,opts){var regex=new RegExp(opts.tmplRegex||$.fn.cycle.defaults.tmplRegex,'g');var args=$.makeArray(arguments);args.shift();return str.replace(regex,function(_,str){var i,j,obj,prop,names=str.split('.');for(i=0;i<args.length;i++){obj=args[i];if(!obj)
continue;if(names.length>1){prop=obj;for(j=0;j<names.length;j++){obj=prop;prop=prop[names[j]]||str;}}else{prop=obj[str];}
if($.isFunction(prop))
return prop.apply(obj,args);if(prop!==undefined&&prop!==null&&prop!=str)
return prop;}
return str;});}});})(jQuery);/*!swipe plugin for Cycle2; version: 20121120*/(function($){"use strict";var supportTouch='ontouchend'in document;$.event.special.swipe=$.event.special.swipe||{scrollSupressionThreshold:10,durationThreshold:1000,horizontalDistanceThreshold:30,verticalDistanceThreshold:75,setup:function(){var $this=$(this);$this.bind('touchstart',function(event){var data=event.originalEvent.touches?event.originalEvent.touches[0]:event;var stop,start={time:(new Date()).getTime(),coords:[data.pageX,data.pageY],origin:$(event.target)};function moveHandler(event){if(!start)
return;var data=event.originalEvent.touches?event.originalEvent.touches[0]:event;stop={time:(new Date()).getTime(),coords:[data.pageX,data.pageY]};if(Math.abs(start.coords[0]-stop.coords[0])>$.event.special.swipe.scrollSupressionThreshold){event.preventDefault();}}
$this.bind('touchmove',moveHandler).one('touchend',function(event){$this.unbind('touchmove',moveHandler);if(start&&stop){if(stop.time-start.time<$.event.special.swipe.durationThreshold&&Math.abs(start.coords[0]-stop.coords[0])>$.event.special.swipe.horizontalDistanceThreshold&&Math.abs(start.coords[1]-stop.coords[1])<$.event.special.swipe.verticalDistanceThreshold){start.origin.trigger("swipe").trigger(start.coords[0]>stop.coords[0]?"swipeleft":"swiperight");}}
start=stop=undefined;});});}};$.event.special.swipeleft=$.event.special.swipeleft||{setup:function(){$(this).bind('swipe',$.noop);}};$.event.special.swiperight=$.event.special.swiperight||$.event.special.swipeleft;})(jQuery);/*! Lity - v2.3.1 - 2018-04-20
* http://sorgalla.com/lity/
* Copyright (c) 2015-2018 Jan Sorgalla; Licensed MIT */(function(window,factory){if(typeof define==='function'&&define.amd){define(['jquery'],function($){return factory(window,$);});}else if(typeof module==='object'&&typeof module.exports==='object'){module.exports=factory(window,require('jquery'));}else{window.lity=factory(window,window.jQuery||window.Zepto);}}(typeof window!=="undefined"?window:this,function(window,$){'use strict';var document=window.document;var _win=$(window);var _deferred=$.Deferred;var _html=$('html');var _instances=[];var _attrAriaHidden='aria-hidden';var _dataAriaHidden='lity-'+_attrAriaHidden;var _focusableElementsSelector='a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])';var _defaultOptions={esc:true,handler:null,handlers:{image:imageHandler,inline:inlineHandler,youtube:youtubeHandler,vimeo:vimeoHandler,googlemaps:googlemapsHandler,facebookvideo:facebookvideoHandler,iframe:iframeHandler},template:'<div class="lity" role="dialog" aria-label="Dialog Window (Press escape to close)" tabindex="-1"><div class="lity-wrap" data-lity-close role="document"><div class="lity-loader" aria-hidden="true">Loading...</div><div class="lity-container"><div class="lity-content"></div><button class="lity-close" type="button" aria-label="Close (Press escape to close)" data-lity-close>&times;</button></div></div></div>'};var _imageRegexp=/(^data:image\/)|(\.(png|jpe?g|gif|svg|webp|bmp|ico|tiff?)(\?\S*)?$)/i;var _youtubeRegex=/(youtube(-nocookie)?\.com|youtu\.be)\/(watch\?v=|v\/|u\/|embed\/?)?([\w-]{11})(.*)?/i;var _vimeoRegex=/(vimeo(pro)?.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/;var _googlemapsRegex=/((maps|www)\.)?google\.([^\/\?]+)\/?((maps\/?)?\?)(.*)/i;var _facebookvideoRegex=/(facebook\.com)\/([a-z0-9_-]*)\/videos\/([0-9]*)(.*)?$/i;var _transitionEndEvent=(function(){var el=document.createElement('div');var transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'};for(var name in transEndEventNames){if(el.style[name]!==undefined){return transEndEventNames[name];}}
return false;})();function transitionEnd(element){var deferred=_deferred();if(!_transitionEndEvent||!element.length){deferred.resolve();}else{element.one(_transitionEndEvent,deferred.resolve);setTimeout(deferred.resolve,500);}
return deferred.promise();}
function settings(currSettings,key,value){if(arguments.length===1){return $.extend({},currSettings);}
if(typeof key==='string'){if(typeof value==='undefined'){return typeof currSettings[key]==='undefined'?null:currSettings[key];}
currSettings[key]=value;}else{$.extend(currSettings,key);}
return this;}
function parseQueryParams(params){var pairs=decodeURI(params.split('#')[0]).split('&');var obj={},p;for(var i=0,n=pairs.length;i<n;i++){if(!pairs[i]){continue;}
p=pairs[i].split('=');obj[p[0]]=p[1];}
return obj;}
function appendQueryParams(url,params){return url+(url.indexOf('?')>-1?'&':'?')+$.param(params);}
function transferHash(originalUrl,newUrl){var pos=originalUrl.indexOf('#');if(-1===pos){return newUrl;}
if(pos>0){originalUrl=originalUrl.substr(pos);}
return newUrl+originalUrl;}
function error(msg){return $('<span class="lity-error"/>').append(msg);}
function imageHandler(target,instance){var desc=(instance.opener()&&instance.opener().data('lity-desc'))||'Image with no description';var img=$('<img src="'+target+'" alt="'+desc+'"/>');var deferred=_deferred();var failed=function(){deferred.reject(error('Failed loading image'));};img.on('load',function(){if(this.naturalWidth===0){return failed();}
deferred.resolve(img);}).on('error',failed);return deferred.promise();}
imageHandler.test=function(target){return _imageRegexp.test(target);};function inlineHandler(target,instance){var el,placeholder,hasHideClass;try{el=$(target);}catch(e){return false;}
if(!el.length){return false;}
placeholder=$('<i style="display:none !important"/>');hasHideClass=el.hasClass('lity-hide');instance.element().one('lity:remove',function(){placeholder.before(el).remove();if(hasHideClass&&!el.closest('.lity-content').length){el.addClass('lity-hide');}});return el.removeClass('lity-hide').after(placeholder);}
function youtubeHandler(target){var matches=_youtubeRegex.exec(target);if(!matches){return false;}
return iframeHandler(transferHash(target,appendQueryParams('https://www.youtube'+(matches[2]||'')+'.com/embed/'+matches[4],$.extend({autoplay:1},parseQueryParams(matches[5]||'')))));}
function vimeoHandler(target){var matches=_vimeoRegex.exec(target);if(!matches){return false;}
return iframeHandler(transferHash(target,appendQueryParams('https://player.vimeo.com/video/'+matches[3],$.extend({autoplay:1},parseQueryParams(matches[4]||'')))));}
function facebookvideoHandler(target){var matches=_facebookvideoRegex.exec(target);if(!matches){return false;}
if(0!==target.indexOf('http')){target='https:'+target;}
return iframeHandler(transferHash(target,appendQueryParams('https://www.facebook.com/plugins/video.php?href='+target,$.extend({autoplay:1},parseQueryParams(matches[4]||'')))));}
function googlemapsHandler(target){var matches=_googlemapsRegex.exec(target);if(!matches){return false;}
return iframeHandler(transferHash(target,appendQueryParams('https://www.google.'+matches[3]+'/maps?'+matches[6],{output:matches[6].indexOf('layer=c')>0?'svembed':'embed'})));}
function iframeHandler(target){return '<div class="lity-iframe-container"><iframe frameborder="0" allowfullscreen src="'+target+'"/></div>';}
function winHeight(){return document.documentElement.clientHeight?document.documentElement.clientHeight:Math.round(_win.height());}
function keydown(e){var current=currentInstance();if(!current){return;}
if(e.keyCode===27&&!!current.options('esc')){current.close();}
if(e.keyCode===9){handleTabKey(e,current);}}
function handleTabKey(e,instance){var focusableElements=instance.element().find(_focusableElementsSelector);var focusedIndex=focusableElements.index(document.activeElement);if(e.shiftKey&&focusedIndex<=0){focusableElements.get(focusableElements.length-1).focus();e.preventDefault();}else if(!e.shiftKey&&focusedIndex===focusableElements.length-1){focusableElements.get(0).focus();e.preventDefault();}}
function resize(){$.each(_instances,function(i,instance){instance.resize();});}
function registerInstance(instanceToRegister){if(1===_instances.unshift(instanceToRegister)){_html.addClass('lity-active');_win.on({resize:resize,keydown:keydown});}
$('body > *').not(instanceToRegister.element()).addClass('lity-hidden').each(function(){var el=$(this);if(undefined!==el.data(_dataAriaHidden)){return;}
el.data(_dataAriaHidden,el.attr(_attrAriaHidden)||null);}).attr(_attrAriaHidden,'true');}
function removeInstance(instanceToRemove){var show;instanceToRemove.element().attr(_attrAriaHidden,'true');if(1===_instances.length){_html.removeClass('lity-active');_win.off({resize:resize,keydown:keydown});}
_instances=$.grep(_instances,function(instance){return instanceToRemove!==instance;});if(!!_instances.length){show=_instances[0].element();}else{show=$('.lity-hidden');}
show.removeClass('lity-hidden').each(function(){var el=$(this),oldAttr=el.data(_dataAriaHidden);if(!oldAttr){el.removeAttr(_attrAriaHidden);}else{el.attr(_attrAriaHidden,oldAttr);}
el.removeData(_dataAriaHidden);});}
function currentInstance(){if(0===_instances.length){return null;}
return _instances[0];}
function factory(target,instance,handlers,preferredHandler){var handler='inline',content;var currentHandlers=$.extend({},handlers);if(preferredHandler&&currentHandlers[preferredHandler]){content=currentHandlers[preferredHandler](target,instance);handler=preferredHandler;}else{$.each(['inline','iframe'],function(i,name){delete currentHandlers[name];currentHandlers[name]=handlers[name];});$.each(currentHandlers,function(name,currentHandler){if(!currentHandler){return true;}
if(currentHandler.test&&!currentHandler.test(target,instance)){return true;}
content=currentHandler(target,instance);if(false!==content){handler=name;return false;}});}
return{handler:handler,content:content||''};}
function Lity(target,options,opener,activeElement){var self=this;var result;var isReady=false;var isClosed=false;var element;var content;options=$.extend({},_defaultOptions,options);element=$(options.template);self.element=function(){return element;};self.opener=function(){return opener;};self.options=$.proxy(settings,self,options);self.handlers=$.proxy(settings,self,options.handlers);self.resize=function(){if(!isReady||isClosed){return;}
content.css('max-height',winHeight()+'px').trigger('lity:resize',[self]);};self.close=function(){if(!isReady||isClosed){return;}
isClosed=true;removeInstance(self);var deferred=_deferred();if(activeElement&&(document.activeElement===element[0]||$.contains(element[0],document.activeElement))){try{activeElement.focus();}catch(e){}}
content.trigger('lity:close',[self]);element.removeClass('lity-opened').addClass('lity-closed');transitionEnd(content.add(element)).always(function(){content.trigger('lity:remove',[self]);element.remove();element=undefined;deferred.resolve();});return deferred.promise();};result=factory(target,self,options.handlers,options.handler);element.attr(_attrAriaHidden,'false').addClass('lity-loading lity-opened lity-'+result.handler).appendTo('body').focus().on('click','[data-lity-close]',function(e){if($(e.target).is('[data-lity-close]')){self.close();}}).trigger('lity:open',[self]);registerInstance(self);$.when(result.content).always(ready);function ready(result){content=$(result).css('max-height',winHeight()+'px');element.find('.lity-loader').each(function(){var loader=$(this);transitionEnd(loader).always(function(){loader.remove();});});element.removeClass('lity-loading').find('.lity-content').empty().append(content);isReady=true;content.trigger('lity:ready',[self]);}}
function lity(target,options,opener){if(!target.preventDefault){opener=$(opener);}else{target.preventDefault();opener=$(this);target=opener.data('lity-target')||opener.attr('href')||opener.attr('src');}
var instance=new Lity(target,$.extend({},opener.data('lity-options')||opener.data('lity'),options),opener,document.activeElement);if(!target.preventDefault){return instance;}}
lity.version='2.3.1';lity.options=$.proxy(settings,lity,_defaultOptions);lity.handlers=$.proxy(settings,lity,_defaultOptions.handlers);lity.current=currentInstance;$(document).on('click.lity','[data-lity]',lity);return lity;}));$(function(){jQuery.event.special.scrolldelta={delegateType:"scroll",bindType:"scroll",handle:function(event){var handleObj=event.handleObj;var targetData=jQuery.data(event.target);var ret=null;var elem=event.target;var isDoc=elem===document;var oldTop=targetData.top||0;var oldLeft=targetData.left||0;targetData.top=isDoc?elem.documentElement.scrollTop+elem.body.scrollTop:elem.scrollTop;targetData.left=isDoc?elem.documentElement.scrollLeft+elem.body.scrollLeft:elem.scrollLeft;event.scrollTopDelta=targetData.top-oldTop;event.scrollTop=targetData.top;event.scrollLeftDelta=targetData.left-oldLeft;event.scrollLeft=targetData.left;event.type=handleObj.origType;ret=handleObj.handler.apply(this,arguments);event.type=handleObj.type;return ret;}};var $nav=$('.mydoc-navbar-menu .mydoc-navbar-nav');var navTopLimit=48;var scrollSensitivity=5;$(window).on('scrolldelta',function(e){var top=e.scrollTop;var topDelta=e.scrollTopDelta;var left=e.scrollLeft;var leftDelta=e.scrollLeftDelta;var navTop=parseInt($nav.css("margin-top"));var navTopTarget=navTop-=(Math.abs(topDelta)>scrollSensitivity?topDelta/scrollSensitivity:0);var opacityTarget=(navTop+navTopLimit)/navTopLimit;if(navTopTarget<-navTopLimit){navTopTarget=-navTopLimit;}else if(navTopTarget>0){navTopTarget=0;}
$nav.css({"margin-top":navTopTarget+"px","opacity":opacityTarget});});$('#contact-form').submit(function(e){e.preventDefault();var form=$(this);var url=form.attr('action');var name=$('#name').val();var email=$('#email').val();var message=$('#message').val();var email_regex=/^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;var validate=false;var error_msg="";if(name.length<1||email.length<1||message.length<1){error_msg="All fields should be filled.";}else if(!email_regex.test(email)){error_msg="Email address is not valid.";}else if(message.length<10){error_msg="Message should be longer than 10 characters.";}else{validate=true;$('.mydoc-form-validation').html("Please wait&hellip;");}
if(validate==true){$.ajax({method:'POST',url:url,dataType:'json',accepts:'application/json',data:form.serialize(),success:(data)=>{if(data.status=200){$('.mydoc-form-validation').html("Your message has been sent.");}},error:(err)=>{console.log(err);$('.mydoc-form-validation').html(err.data);}});}else{$('.mydoc-form-validation').html(error_msg);}});});