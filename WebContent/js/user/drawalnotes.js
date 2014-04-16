/**
 * 提款须知
 */
define(function (require, exports, module) {
  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      template = require("../../views/user/drawalnotes.html");

  var canBack = 1;

  /**
   * 初始化
   */
  var init = function (data, forward) {
    canBack = forward || 0;

    // 参数设置
    var params = {};

    initShow();

    bindEvent();

    // 处理返回
    page.setHistoryState({url: "user/drawalnotes", data: params},
        "user/drawalnotes",
            "#user/drawalnotes" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack);

    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    // compile our template
    var tmp = _.template(template);

    $("#container").empty().html(tmp());
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    // 返回
    $(document).off(events.touchStart(), ".back").on(events.touchStart(), ".back", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), ".back").on(events.activate(), ".back", function (e) {
      page.goBack();
      return true;
    });


    // 我已阅读.
    $(document).off(events.touchStart(), "#haveRead").on(events.touchStart(), "#haveRead", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), "#haveRead").on(events.activate(), "#haveRead", function (e) {
      page.goBack();
      return true;
    });
  };

  return {init: init};
});