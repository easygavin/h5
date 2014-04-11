/**
 * 数字彩方案详情
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    template = require("../../views/gjj/detail.html"),
    gjjService = require('services/gjj');
  var canBack = 1;
  // 方案编号
  var projectno = "";
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
      // 方案编号
      if (typeof data.projectno != "undefined" && $.trim(data.projectno) != "") {
        projectno = data.projectno;
        params.projectno = projectno;
      }
    }

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "gjj/detail", data: params},
      "gjj/detail",
      "#gjj/detail" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
      canBack);
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").html(template);
    // 获取方案详情
    getDetails();
  };

  /**
   * 获取方案详情
   */
  var getDetails = function () {
    var request = gjjService.getProjectDetail(projectno, function (data) {
      // 隐藏加载标示
      util.hideLoading();
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            showDetails(data);
          } else {
            page.codeHandler(data);
          }
        }
      }
    });

    util.addAjaxRequest(request);
  };

  /**
   * 显示详情
   * @param data
   */
  var showDetails = function (data) {

    var detailTpl = require('/tpl/gjj/detail');

    $(".detailBox").html(detailTpl(data));
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

    // 冠军竞猜投注
    $(document).off(events.click(), "#goBuyGjj").
      on(events.click(), "#goBuyGjj", function (e) {
        page.init("gjj/bet", {}, 0);
        return true;
      });
  };

  return {init: init};
});