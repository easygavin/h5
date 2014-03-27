/**
 * 开奖信息列表
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    config = require('config'),
    template = require("../../views/digit/openLott.html"),
    digitService = require('services/digit');
  var canBack = 1;

  // 标示符
  var lot = "";
  // 彩种配置
  var lotConfig = {};
  // 数据条数
  var issueCount = 20;
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

    if (data != null && typeof data != "undefined") {
      // 彩种
      if (typeof data.lot != "undefined" && $.trim(data.lot) != "") {
        lot = data.lot;
        params.lot = lot;
      }
    }

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "digit/openLott", data: params},
      "digit/openLott",
      (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#digit/openLott",
      canBack ? 1 : 0);
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    // 彩种配置
    lotConfig = config.lotteryMap[lot];

    $("#container").html(template);

    // 显示title信息
    showTitle();

    // 获取历史开奖信息
    getOpenLott();
  };

  /**
   * 显示title信息
   */
  var showTitle = function () {
    $(".title").text(lotConfig.name + "开奖信息");
  };

  /**
   * 获取历史开奖信息
   */
  var getOpenLott = function () {

    // 请求数据
    var request = digitService.getHistoryAwardsByTypes(lotConfig.lotteryId, issueCount, function (data) {

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
    data.lot = lot;
    var openLottTpl = require('/tpl/digit/openLott');

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
        page.goBack();
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
          // 详情
          var issueNo = $fm.attr("id").split("_")[1];
          if ($.trim(issueNo) != "") {
            page.init("digit/look", {lot: lot, issueNo: issueNo}, 1);
          }
        }
        return true;
      });
  };

  return {init: init};
});