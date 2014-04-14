/**
 * 绑定手机号
 */
define(function (require, exports, module) {
  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      template = require("../../views/user/bindMobile.html"),
      account = require('services/account');

  // 处理返回参数
  var canBack = 0;

  var userInfo = null;

  // 倒计时秒数
  var seconds = 0;

  // 定时器
  var secondsTimer = null;


  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward ? 1 : 0;

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    initShow();

    bindEvent();

    mobileBindState();

    // 参数设置
    var params = {};

    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    // 处理返回
    page.setHistoryState({url: "user/bindMobile", data: params},
        "user/bindMobile",
        "#user/bindMobile"+(JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack);
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
   * 查询手机绑定状态.
   */
  var mobileBindState = function () {
    if (!_.isEmpty(userInfo)) {
      var mobileNo = userInfo.userMobile;
      if (mobileNo) {
        $('#mobileNo').val("您已绑定手机号码").attr("disabled", true);
        var displayNo = mobileNo.substr(0, 3) + "****" + mobileNo.substr(7, mobileNo.length);
        //显示绑定号码,隐藏发送验证码按钮.
        $('#captcha').val(displayNo).attr("disabled", true);
        $('#sendCaptcha').hide();
        $('.surebtn').html('返回');
        $(document).off(events.activate(), ".surebtn").on(events.activate(), ".surebtn", function (e) {
          page.goBack();
        });
      }
    }

  };

  /**
   * 发送验证码
   */
  var sendCaptcha = function () {
    var mobileNo = $("#mobileNo").val().trim();
    var reg = new RegExp("^[0-9]*$");
    if (mobileNo == '' || mobileNo.length != 11) {
      page.toast("请输入有效的手机号码");
      return false;
    } else if (!reg.test(mobileNo)) {
      page.toast("请输入有效的手机号码");
      return false;
    }
    if (!_.isEmpty(userInfo)) {
      //发送验证码请求.
      var request = account.sendCaptcha(userInfo.userKey, mobileNo, userInfo.userId, function (data) {
        if (!_.isEmpty(data)) {
          if (data.statusCode && data.statusCode == '0') {
            page.toast("验证码发送成功");
            seconds = 60;
            //倒计时60秒
            countSec();
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          util.toast("验证码发送失败");
        }
      });
      util.addAjaxRequest(request);
    } else {
      page.init("login", {}, 1);
    }
  };

  /**
   * 短信定时器(60s)
   */
  var countSec = function () {
    if (seconds-- > 0) {
      $("#sendCaptcha").html("剩余:" + seconds + "秒");
      clearTimeout(secondsTimer);
      secondsTimer = setTimeout(function () {
        countSec();
      }, 1000);

    } else {
      secondsTimer = null;
      clearTimeout(secondsTimer);
      $("#sendCaptcha").html("发送验证码");
    }
  };
  /**
   *绑定手机号
   */
  var bindMobile = function () {


    var mobileNo = $('#mobileNo').val().trim();
    var reg = new RegExp("^[0-9]*$");
    if (mobileNo == '') {
      page.toast('手机号码不能为空');
      return false;
    } else if (!reg.test(mobileNo) || mobileNo.length != 11) {
      page.toast('请输入有效的手机号码');
      return false;
    }

    var captcha = $('#captcha').val().trim();
    if (captcha == '') {
      page.toast('请输入有效的验证码');
      return false;
    } else if (isNaN(captcha)) {
      page.toast('请输入有效的6位验证码');
      return false;
    }

    if (!_.isEmpty(userInfo)) {
      account.bindMobileNo(mobileNo, userInfo.userId, userInfo.userKey, captcha, function (data) {
        if (!_.isEmpty(data)) {
          if (typeof  data.statusCode!='undefined' && data.statusCode == '0') {
            userInfo.userMobile = mobileNo;
            util.setLocalJson(util.keyMap.LOCAL_USER_INFO_KEY, userInfo);
            page.toast('手机绑定成功');
            page.goBack();
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          page.toast("系统错误,请稍后再重试");
          page.goBack();
        }
      });
    } else {
      page.init("login", {}, 1);
    }
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

    //发送验证码
    $(document).off(events.touchStart(), "#sendCaptcha").on(events.touchStart(), "#sendCaptcha", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), "#sendCaptcha").on(events.activate(), "#sendCaptcha", function (e) {
      if (secondsTimer != null) {
        return false;
      } else {
        sendCaptcha();
      }
      return true;
    });
  };

  //绑定手机号码.
  $(document).off(events.touchStart(), ".surebtn").on(events.touchStart(), ".surebtn", function (e) {
    events.handleTapEvent(this, this, events.activate(), e);
    return true;
  });

  $(document).off(events.activate(), ".surebtn").on(events.activate(), ".surebtn", function (e) {
    bindMobile();
    return true;
  });

  //跳过.
  $(document).off(events.touchStart(), "#pass").on(events.touchStart(), "#pass", function (e) {
    events.handleTapEvent(this, this, events.activate(), e);
    return true;
  });

  $(document).off(events.activate(), "#pass").on(events.activate(), "#pass", function (e) {
    page.goBack();
    return true;
  });

  return {init: init};
});