/**
 * 充值响应页面.
 */
define(function (require, exports, module) {

  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      template = require("../../views/charge/callback.html");

  var canBack = 1;

  //服务器跳转传递来的参数,用来判断是哪种充值方式.

  var type = '';

  //结果{1:成功,0:失败}

  var result;

  //所有的充值方式汇总.

  var allChargeType = {};

  //token--充值页面保存,当前页面获取.

  var userInfo = '';


  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward;

    // 参数设置
    var params = {};

    //从后台,通过Response.sendRedirect()方法传递.
    var backStageParam = window.location.search.substring(1);
    var parameters = util.unParam(backStageParam);

    //类型,某种充值方式.
    if (typeof parameters.type != "undefined" && typeof  parameters.result != "undefined") {
      type = parameters.type;
      result = parameters.result;
      params.type = type;
      params.result = result;
    } else if ((typeof parameters.data != "undefined"
        && typeof JSON.parse(parameters.data).type != "undefined")
        && typeof JSON.parse(parameters.data).result != "undefined") {
      type = JSON.parse(parameters.data).type;
      result = JSON.parse(parameters.data).result;
      params.type = type;
      params.result = result;
    }

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    initShow();

    bindEvent();


    // 处理返回
    page.setHistoryState({url: "charge/callback", data: params},
        "charge/callback",
            (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#charge/callback",
        canBack ? 1 : 0);

    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    // compile our template
    var tmp = _.template(template);

    $("#container").empty().html(tmp());

    displayResult();

  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    // 返回
    $(document).off(events.touchStart(), ".back").on(events.touchStart(), ".back", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), ".back").on(events.activate(), ".back", function (e) {
      //后退
      window.history.go(-8);
      return true;
    });

    //页面链接{双色球,11选5,竞彩足球}
    $(document).off(events.touchStart(), ".back").on(events.touchStart(), ".back", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), ".back").on(events.activate(), ".back", function (e) {
      //后退
      window.history.go(-8);
      return true;
    });
  };

  var displayResult = function () {

    var subItem = allChargeType[type];
    if (subItem != null && subItem != "undefined") {
      $('#typeTitle').html(subItem.title);
      if (result != "undefined" && result != '') {
       var userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
       alert(JSON.stringify(userInfo));
        if (result == '1') {
          $('#success').show();
        } else if (result == '0') {
          $('#error').show();
        }
      }
    }

  };

  allChargeType = {
    "0": {"title": "支付宝WAP充值"},
    "1": {"title": "财付通WAP充值"}
  };

  return {init: init};

});