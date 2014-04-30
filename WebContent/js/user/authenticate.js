/**
 * 身份验证.
 */
define(function (require, exports, module) {

  var page = require('page'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      config = require('config'),
      account = require('services/account'),
      template = require("/views/user/authenticate.html");

  // 处理返回参数
  var canBack = 0;

  //登录信息
  var loginState = null;

  //登录状态.
  var tkn;
  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward ? 1 : 0;
    var params = {};
    tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    initShow();

    bindEvent();

    // 处理返回
    page.setHistoryState({url: "user/authenticate", data: params},
        "user/authenticate",
            "#user/authenticate" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack);
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    $("#container").empty().html(template);

    //初始化显示,查询身份证是否认证.
    idState();
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    $('.back').on('click', function () {
      if (canBack) {
        page.goBack();
      } else {
        page.init("home", {}, 0);
      }
      return true;
    });

    // 绑定身份证.
    $('.surebtn').on('click', function () {
      bindIdNumber();
      return true;
    });

  };


  /**
   * 初始化显示,查询身份证是否认证.
   */
  var idState = function () {

    if (!tkn) {
      page.init("login", {}, 1);
      return false;
    }
    loginState = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
    // 显示遮住层
    util.showLoading();
    if (!_.isEmpty(loginState) && loginState.userId && loginState.userKey) {
      var request = account.inspectUserIDCardState(loginState.userId, loginState.userKey, function (data) {
        //隐藏遮盖层
        util.hideLoading();
        $('.surebtn').html('确认');
        if (!_.isEmpty(data)) {
          if (typeof data.statusCode != 'undefined' && data.statusCode == '0') {
            showItems(data.name, data.personCardId);
            //存储用户的真实姓名.在绑定银行卡页面需要.
            util.setLocalJson(util.keyMap.USER_TRUE_NAME, data.name);
          } else if (data.statusCode == '0007') {
            //1,{"statusCode":"0007","errorMsg":"用户信息不存在!"}
            //2,{"statusCode":"0007","name":null,"errorMsg":"该用户未绑定身份证信息","personCardId":null}
          } else if (data.statusCode == '-2' || data.errorMsg.indexOf('token失效') != -1) {
            page.answer("", "因长时间未进行操作,请重新登录", "登录", "取消",
                function (e) {
                  page.init("login", {}, 1);
                },
                function (e) {
                });
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          page.toast('查询信息出错,请稍后充值');
        }
      });
      util.addAjaxRequest(request);
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
      $("#idNumber").val("******"+idNumber.substring(6, 12) + "******").attr("readonly", true);
    } else {
      $("#idNumber").val(idNumber).attr("readonly", true);
    }
    $('.surebtn').off('click').html('返回').on('click', function () {
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
      var request = account.bindIDCard(idNumber, realName, loginState.userId, loginState.userKey, function (data) {
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
      util.addAjaxRequest(request);
    }
  };

  module.exports = {init: init};
});