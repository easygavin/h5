define(function (require, exports, module) {

  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      template = require('../../views/user/accountDetail.html');

  // 处理返回参数
  var canBack = 0;

  // 请求页码
  var requestPage = "1";

  // requestType 0: 全部，1：收入，2：支出
  var requestType = "0";
  // 时间段
  var periodOfCheck = "30";

  // 总页面数
  var pages = 0;

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
    page.setHistoryState({url: "user/accountDetail", data: params},
        "user/accountDetail",
             (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "")+"#user/accountDetail",
        canBack);
    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    // 参数重置
    requestPage = "1", requestType = "0",periodOfCheck = "30";

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
          if (canBack) {
            page.goBack();
          } else {
            page.init("home", {}, 0);
          }
          return true;
        });
  };
  return {init: init};
});