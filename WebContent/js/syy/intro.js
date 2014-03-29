/**
 * 十一运夺金介绍
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    template = require('../../views/syy/intro.html');

  var canBack = 1;

  var flag = "intro";

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
    page.setHistoryState({url:"dlt/intro", data:params},
      "dlt/intro",
      (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#dlt/intro",
      canBack ? 1 : 0);

    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").html(template);

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

    // 菜单切换
    $(document).off(events.tap(), ".jsBox").
      on(events.tap(), ".jsBox", function (e) {
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

  return {init:init};
});