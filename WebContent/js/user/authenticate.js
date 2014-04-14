/**
 * 身份验证.
 */
define(function (require, exports, module) {

  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      account = require('services/account'),
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

    loginState = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    initShow();

    bindEvent();

    idState();

    // 参数设置
    var params = {};

    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }
    // 处理返回
    page.setHistoryState({url: "user/authenticate", data: params},
        "user/authenticate",
        "#user/authenticate"+(JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
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
    $(document).off(events.touchStart(), ".back").on(events.touchStart(), ".back", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });


    $(document).off(events.activate(), ".back").on(events.activate(), ".back", function (e) {
      if (canBack) {
        page.goBack();
      } else {
        page.init("home", {}, 0);
      }
      return true;
    });
  };

  // 绑定身份证.
  $(document).off(events.touchStart(), ".surebtn").on(events.touchStart(), ".surebtn", function (e) {
    events.handleTapEvent(this, this, events.activate(), e);
    return true;
  });


  $(document).off(events.activate(), ".surebtn").on(events.activate(), ".surebtn", function (e) {
    bindIdNumber();
    return true;
  });


  /**
   * 初始化显示,查询身份证是否认证.
   */
  var idState = function () {
    // 显示遮住层
    util.showLoading();
    if (!_.isEmpty(loginState) && loginState.userId && loginState.userKey) {
      account.inspectUserIDCardState(loginState.userId, loginState.userKey, function (data) {
        //隐藏遮盖层
        util.hideLoading();
        $('.surebtn').html('确认');
        if (!_.isEmpty(data)) {
          if (typeof data.statusCode!='undefined' && data.statusCode == '0') {
            showItems(data.name, data.personCardId);
            //存储用户的真实姓名.在绑定银行卡页面需要.
            util.setLocalJson(util.keyMap.USER_TRUE_NAME, data.name);
          } else if (data.statusCode == '0007') {
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          page.toast('查询信息出错,请稍后充值');
        }
      });
    } else {
      page.init('login', {}, 1);
    }
  };

  /**
   * 真实姓名,身份证号文本显示.
   */
  var showItems = function (realName, idNumber) {

    if (realName.length >= 2) {
      $("#realName").val(realName.substring(0, 1) + "***").attr("readonly", true);
    } else {
      $("#realName").val(realName).attr("readonly", true);
    }

    if (idNumber.length >= 13) {
      $("#idNumber").val(idNumber.substring(0, 12) + "******").attr("readonly", true);
    } else {
      $("#idNumber").val(idNumber).attr("readonly", true);
    }
    $('.surebtn').html('返回');
    $(document).off(events.activate(), ".surebtn").on(events.activate(), ".surebtn", function (e) {
      page.goBack();
    });
  };

  /**
   * 身份证验证.
   */
  var bindIdNumber = function () {
    var realName = $("#realName").val().trim(), idNumber = $("#idNumber").val().trim();
    if (realName == '') {
      page.toast("请输入真实姓名");
      return false;
    } else if (!realName.match(/^[\u4E00-\u9FA5a-zA-Z0-9_]{2,10}$/)) {
      page.toast("真实姓名输入有误");
      return false;
    }
    var isIDCard1 = "[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}(\\d|x|X)$";
    if (idNumber == '') {
      page.toast("请输入身份证号");
      return false;
    } else if (!idNumber.match(isIDCard1)) {
      page.toast("身份证号不正确");
      return false;
    }
    if (!_.isEmpty(loginState) && loginState.userId && loginState.userKey) {
      account.bindIDCard(idNumber, realName, loginState.userId, loginState.userKey, function (data) {
        if (!_.isEmpty(data)) {
          if (data.statusCode == '0') {
            page.toast("绑定成功");
            //存储用户的真实姓名.在绑定银行卡页面需要.
            util.setLocalJson(util.keyMap.USER_TRUE_NAME, realName);
            page.goBack();
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          page.toast('绑定失败,请稍候重试');
        }
      });
    }
  };

  module.exports = {init: init};
});