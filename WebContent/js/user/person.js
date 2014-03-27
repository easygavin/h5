/**
 * 个人中心首页
 */
define(function (require, exports, module) {
  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      template = require("../../views/user/person.html"),
      account = require('services/account');

  // 处理返回参数
  var canBack = 0;

  //用户信息.
  var userInfo = null;

  //1表示包含可提款余额姓名等信息，0表示只须提供可用余额
  var requestType = 0;

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward ? 1 : 0;

    initShow();

    bindEvent();

    // 参数设置
    var params = {};
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    // 处理返回
    page.setHistoryState({url: "user/person", data: params},
        "user/person", (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#user/person",
        canBack);

    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    $("#container").html(template);

    getBalance();
  };

  /**
   * 查询账户姓名,金额.
   */
  var getBalance = function () {

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    if (userInfo != null && userInfo.userId != "undefined" && userInfo.userKey != "undefined") {

      var request = account.getUserBalance(requestType, userInfo.userId, userInfo.userKey, function (data) {

        util.hideCover();
        util.hideLoading();

        if (data != "undefined" && data.statusCode == "0") {
          $("#trueName").html(" 用户名:" + userInfo.userName);
          $("#balance").html(parseFloat(data.userBalance).toFixed(2));
        } else {
          page.toast(data.errorMsg);
        }

      });
      util.addAjaxRequest(request);
    } else {
      page.init("login", {}, 1);
    }
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

    //选项.
    $(document).off(events.touchStart(), ".account li").
        on(events.touchStart(), ".account li", function (e) {
          events.handleTapEvent(this, this, events.activate(), e);
          return true;
        });

    $(document).off(events.activate(), ".account li").
        on(events.activate(), ".account li", function (e) {
          var targetId = $(this).attr("id");
          switch (targetId) {
            //我的优惠券.
            case "coupon":
              page.init("user/coupon", {}, 1);
              break;
            //账户明细.
            case "accountDetail":
              page.init("user/accountDetail", {}, 1);
              break;
            //购彩记录.
            case "buyRecord":
              page.init("user/buyRecord", {}, 1);
              break;
            //绑定银行卡.
            case "bindBankCard":
              page.init("user/bindBankCard", {}, 1);
              break;
            //手机绑定.
            case "bindMobile":
              page.init("user/bindMobile", {}, 1);
              break;
            //密码修改.
            case "editPassword":
              page.init("user/editPassword", {}, 1);
              break;
            //身份认证.
            case "authenticate":
              page.init("user/authenticate", {}, 1);
              break;
          }
          return true;
        });

    //充值,提款.
    $(document).off(events.touchStart(), "#cwi a").
        on(events.touchStart(), "#cwi a", function (e) {
          events.handleTapEvent(this, this, events.activate(), e);
          return true;
        });

    $(document).off(events.activate(), "#cwi a").
        on(events.activate(), "#cwi a", function (e) {
          var targetId = $(this).attr("id");
          switch (targetId) {
            case "charge":
              page.init("charge/index", {}, 1);
              break;
            case "withdrawal":
              page.init("charge/withdrawal", {}, 1);
              break;
          }
          return true;
        });
  };

  return {init: init};
});