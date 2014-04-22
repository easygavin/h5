/**
 * 数字彩介绍
 */
define(function (require, exports, module) {
  var page = require('page'),
    util = require('util'),
    $ = require('zepto'),
    config = require('config');

  var canBack = 1;
  // 标示符
  var lot = "";
  // 彩种配置
  var lotConfig = {};

  var flag = "intro";

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
    }
    // 彩种配置
    lotConfig = config.lotteryMap[lot];
    require.async(lotConfig.paths["intro"].tpl, function (tpl) {
      $("#container").html(tpl);

      initShow();
      bindEvent();

    });

    // 处理返回
    page.setHistoryState({url: "digit/intro", data: params},
      "digit/intro",
      "#digit/intro" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
      canBack);

    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    flag = "intro";
    showZone();
  };

  /**
   * 显示区域
   */
  var showZone = function () {
    $("#m_" + flag).addClass("click");
    $("#" + flag).show();
  };

  /**
   * 隐藏区域
   */
  var hideZone = function () {
    $("#m_" + flag).removeClass("click");
    $("#" + flag).hide();
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    // 返回
    $(".back").on("click", function (e) {
      page.goBack();
      return true;
    });

    // 菜单切换
    $(".jsBox").on("click", function (e) {
      var $target = $(e.target);
      var $a = null;
      if (e.target.tagName.toLocaleLowerCase() === "a") {
        $a = $target;
      } else {
        $a = $target.find("a");
      }

      if ($a.length && !$a.hasClass("click")) {
        hideZone();
        flag = $a.attr("id").split("_")[1];
        showZone();
      }
      return true;
    });
  };

  return {init: init};
});