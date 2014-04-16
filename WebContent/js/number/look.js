/**
 * 开奖信息详情
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    config = require('config'),
    template = require("../../views/number/look.html"),
    digitService = require('services/digit');
  var canBack = 1;

  // 标示符
  var lot = "";
  // 彩种配置
  var lotConfig = {};
  // 期号
  var issueNo = "";
  /**
   * 初始化
   */
  var init = function (data, forward) {
    canBack = forward || 0;

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
      // 期号
      if (typeof data.issueNo != "undefined" && $.trim(data.issueNo) != "") {
        issueNo = data.issueNo;
        params.issueNo = issueNo;
      }
    }

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "number/look", data: params},
      "number/look",
      "#number/look" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
      canBack);
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

    // 获取开奖详情
    getDetail();
  };

  /**
   * 显示title信息
   */
  var showTitle = function () {
    $(".title").text(lotConfig.name + "开奖详情");
  };

  /**
   * 获取开奖详情
   */
  var getDetail = function () {

    // 请求数据
    var request = digitService.getDigitDetailsByIssue(lotConfig.lotteryId, issueNo, function (data) {

      // 隐藏加载标示
      util.hideLoading();
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            showDetail(data);
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
  var showDetail = function (data) {
    data.lot = lot;
    data.issueTitle = lotConfig.name;
    var openLottTpl = require('/tpl/number/look');

    $(".detailBox").html(openLottTpl(data));
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    // 返回
    $(".back").on(events.click(), function (e) {
      page.goBack();
      return true;
    });

    // 去投注
    $("#toBuyNo").on(events.click(), function (e) {
      util.clearLocalData(lotConfig.localKey);
      page.init(lotConfig.paths["ball"].js, {lot: lotConfig.key}, 1);
    });
  };

  return {init: init};
});