/**
 * 提款须知
 */
define(function (require, exports, module) {
  var page = require('page'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      template = require("/views/user/drawalnotes.html");

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
    $("#container").empty().html(template);
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    $('.back').on('click', function () {
        page.goBack();
    });

    // 我已阅读.
    $('#haveRead').on('click', function () {
      page.goBack();
      return true;
    });
  };

  return {init: init};
});