/**
 * 所有开奖信息列表
 */
define(function (require, exports, module) {
  var page = require('page'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    config = require('config'),
    template = require("/views/openAll.html"),
    digitService = require('services/digit');
  var canBack = 1;

  // 彩种 双色球|大乐透|福彩3D|排列3|十一运夺金|十一运夺金|竞彩足球|竞彩篮球
  var lotteryTypeArray = "11|13|12|4|34|31|46|36";

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

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "openAll", data: params},
      "openAll",
      "#openAll" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
      canBack);
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
    $('.back').on('click', function () {
      canBack ? page.goBack() : page.init('home', {}, 0);
    });

    $(document).off("click", ".kjList tr").
      on("click", ".kjList tr", function (e) {
        var $fm = $(this).find(".fm");
        if ($fm.length) {
          // 开奖列表
          var lotteryType = $fm.attr("id").split("_")[1];
          var lot = config.lotteryIdToStr[lotteryType];
          if (lot !== null && typeof lot != "undefined" && $.trim(lot) != "") {
            if (lot == "ssq" || lot == "dlt" || lot == "f3d" || lot == "pl3" ||
              lot == "syx" || lot == "syy") {
              page.init("number/openLott", {lot: lot}, 1);
            } else if (lot == "jcl") {
              // 竞彩篮球
              page.init('jcl/lottery_list', {lotteryType: lotteryType}, 1);
            } else if (lot == "jcz") {
              // 竞彩足球
              page.init('jcz/lottery_list', {lotteryType: lotteryType}, 1);
            }
          }
        }
      });
  };
  return {init: init};
});