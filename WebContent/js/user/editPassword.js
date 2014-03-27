/**
 * 修改密码.
 */
define(function (require, exports, module) {
  var page = require('page'),
      util = require('util'),
      zepto = require('zepto'),
      _ = require('underscore'),
      events = require('events'),
      template = require('../../views/user/editPassword.html');

  // 处理返回参数
  var canBack = 0;

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward ? 1 : 0;

    initShow();

    bindEvent();

    // 参数设置
    var params = {};
    // 处理返回
    page.setHistoryState({url: "user/editPassword", data: params},
        "user/editPassword",
            (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#user/editPassword",
        forward ? 1 : 0);
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
    $(document).off(events.touchStart(), ".back").
        on(events.touchStart(), ".back", function (e) {
          events.handleTapEvent(this, this, events.activate(), e);
          return true;
        });

    $(document).off(events.activate(), ".back").
        on(events.activate(), ".back", function (e) {
          if (forward) {
            page.goBack();
          } else {
            page.init("home", {}, 0);
          }
          return true;
        });
  };
  return {init: init};
});