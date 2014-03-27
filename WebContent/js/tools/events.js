/**
 * 页面事件处理
 */
define(function (require, exports, module) {
  var Event = {};
  // 参数设置
  Event.params = {
    // 样式元素
    eventEl: null,
    // 事件目标对象
    eventTarget: null,
    // 事件超时时间
    eventTime: 750,
    // 开始时间
    startTime: 0,
    // 结束时间
    endTime: 0,
    // 移动距离
    delta: 10,
    // 开始X坐标
    startPageX: 0,
    // 开始Y坐标
    startPageY: 0,
    // 标示触发处理事件
    needTrigger: true,
    // 事件过长应该触发点击结束事件
    triggerTimer: null,
    // Tap 样式定时器
    tapCSSTimer: null,
    // 是否已经触发事件
    hasActivate: false
  };


  // touchStart开始事件
  Event.touchStart = function () {
    return "touchstart";
  };

  // touchEnd结束事件
  Event.touchEnd = function () {
    return "touchend";
  };

  // touchMove事件
  Event.touchMove = function () {
    return "touchmove";
  };

  // 自定义Tap激活事件
  Event.activate = function () {
    return document.hasOwnProperty("ontouchstart") ? "activate" : "click";
  };

  // 点击事件
  Event.click = function () {
    return document.hasOwnProperty("ontouchstart") ? "touchstart" : "click";
  };

  // Tap 事件
  Event.tap = function () {
    return document.hasOwnProperty("ontouchstart") ? "tap" : "click";
  };

  //var elements = [];

  /**
   * 处理Tap事件
   * @param el 样式元素
   * @param target 事件元素
   * @param trigger 触发事件
   * @param event 事件对象
   */
  Event.handleTapEvent = function (el, target, trigger, event) {
    //elements.push(target.className);
    //util.toast("start:"+elements.toString());
    // 记录开始时间
    Event.params.startTime = new Date().getTime();
    Event.params.eventEl = el;
    Event.params.eventTarget = target;
    Event.params.needTrigger = true;
    Event.params.hasActivate = false;
    clearTimeout(Event.params.tapCSSTimer);
    Event.params.tapCSSTimer = setTimeout(function () {
      if (Event.params.needTrigger && !Event.params.hasActivate) {
        // Tap显示样式
        $(".tapHover").css({
          "top": $(Event.params.eventEl).offset().top,
          "left": $(Event.params.eventEl).offset().left,
          "width": $(Event.params.eventEl)[0].offsetWidth,
          "height": $(Event.params.eventEl)[0].offsetHeight
        }).show();
      }
    }, 65);

    Event.params.startPageX = event.pageX;
    Event.params.startPageY = event.pageY;
    // touchEnd 触发事件
    $(target).off(Event.touchEnd(), Event.handleTouchEnd);
    $(target).on(Event.touchEnd(), Event.handleTouchEnd);

    // touchMove 触发事件
    $(target).off(Event.touchMove(), Event.handleTouchMove);
    $(target).on(Event.touchMove(), Event.handleTouchMove);

    clearTimeout(Event.params.triggerTimer);
    Event.params.triggerTimer = setTimeout(function () {
      // 隐藏Tap样式
      $(".tapHover").hide();
    }, Event.params.eventTime);
  };

  /**
   * 处理touchEnd事件
   * @param e
   * @return {Boolean}
   */
  Event.handleTouchEnd = function (e) {
    // 记录结束时间
    Event.params.endTime = new Date().getTime();

    if (Event.params.needTrigger && Event.params.endTime - Event.params.startTime < Event.params.eventTime) {
      Event.params.hasActivate = true;
      $(Event.params.eventTarget).trigger(Event.activate());
    }

    // 隐藏Tap样式
    $(".tapHover").hide();
    return true;
  };

  /**
   * 处理touchMove事件
   * @param e
   * @return {Boolean}
   */
  Event.handleTouchMove = function (e) {
    var pageX = e.pageX;
    var pageY = e.pageY;

    //if (Math.abs(startPageX - pageX) > delta || Math.abs(startPageY - pageY) > delta) {
    Event.params.needTrigger = false;
    //}
    // 隐藏Tap样式
    $(".tapHover").hide();
    return true;
  };

  module.exports = Event;
});