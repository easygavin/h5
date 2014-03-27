/**
 * 所有开奖信息列表
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    config = require('config'),
    template = require("../views/openAll.html"),
    digitService = require('services/digit');
  var canBack = 1;

  // 彩种 双色球|大乐透|十一运夺金|福彩3D|幸运赛车|竞彩篮球|竞彩足球
  var lotteryTypeArray = "11";

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
    page.setHistoryState({url: "openAll", data: params},
      "openAll",
      (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#openAll",
      canBack ? 1 : 0);
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").html(template);

    // 获取开奖信息
    getOpenAll();
  };

  /**
   * 获取开奖信息
   */
  var getOpenAll = function () {

    // 请求数据
    var request = digitService.getAwardInfoList(lotteryTypeArray, function (data) {

      // 隐藏加载标示
      util.hideLoading();
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            showItems(data);
          }
        }
      }
    });

    util.addAjaxRequest(request);
  };

  /**
   * 显示列表信息
   * @param data
   */
  var showItems = function (data) {
    var openLottTpl = require('/tpl/openAll');

    $("#main").html(openLottTpl(data));
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

    $(document).off(events.touchStart(), ".kjList tr").
      on(events.touchStart(), ".kjList tr", function (e) {
        events.handleTapEvent(this, this, events.activate(), e);
        return true;
      });

    $(document).off(events.activate(), ".kjList tr").
      on(events.activate(), ".kjList tr", function (e) {
        var $fm = $(this).find(".fm");
        if ($fm.length) {
          // 开奖列表
          var lotteryType = $fm.attr("id").split("_")[1];
          var lot = config.lotteryIdToStr[lotteryType];
          if (lot !== null && typeof lot != "undefined" && $.trim(lot) != "") {
            page.init("digit/openLott", {lot: lot}, 1);
          }
        }
        return true;
      });

  };

  return {init: init};
});