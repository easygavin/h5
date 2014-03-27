/**
 * 身份验证.
 */
define(function (require, exports, module) {

  var page = require('page'),
      events=require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      accountService = require('accountService'),
      template = require("../../views/user/authenticate.html"),
      config = require('config');

  // 处理返回参数
  var canBack = 0;

  //登录信息
  var loginState = null;

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward ? 1 : 0;

    initShow();

    bindEvent();

    loginState = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    initQuery();

    // 参数设置
    var params = {};
    // 处理返回
    page.setHistoryState({url: "user/authenticate", data: params},
        "user/authenticate",
             (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "")+"#user/authenticate",
        canBack);

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
  };

  /**
   * 初始化显示,查询身份证是否认证.
   */
  var initQuery = function () {

    // 显示遮住层
    util.showCover();
    util.showLoading();

    //if (loginState != null && loginState.userId != 'undefined' && loginState.userKey != 'undefined') {
    accountService.inspectUserIDCardState(loginState.userId, loginState.userKey, function (data) {
      //隐藏遮盖层
      util.hideCover();
      util.hideLoading();
      if (data != "undefined" && data.statusCode == '0') {
        //真实姓名,身份证号.
        showItems(data.name, data.personCardId);
      }
    });
  };

  /**
   * 真实姓名,身份证号文本显示.
   */

  var showItems = function (realName, idNumber) {

    $("#realName").val(realName.length >= 2 ? realName.substring(0, 1) + "***" : realName).attr("readonly", true);
    $("#idNumber").val(idNumber.length >= 13 ? idNumber.substring(0, 12) + "******" : idNumber).attr("readonly", true);
    $("#authenConfrim").html("返回").on(events.activate(), function () {
      page.goBack();
    });
  };


  module.exports = {init: init};
});