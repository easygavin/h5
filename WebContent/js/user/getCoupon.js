/**
 * 获得优惠券.
 */
define(function (require, exports, module) {

    var page = require('page'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      template = require("/views/user/getCoupon.html");

  var canBack = 0;

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward;

    // 参数设置
    var params = {};

    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    initShow();

    bindEvent();

    // 处理返回
    // 处理返回
    page.setHistoryState({url: "user/getCoupon", data: params},
        "user/getCoupon",
        "#user/getCoupon"+(JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack?1:0);
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").empty().html(template);
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    $('.back').on('click', function () {
      if (canBack) {
        page.goBack();
      } else {
        page.init("home", {}, 0);
      }
    });
  };

  return {init:init};
});