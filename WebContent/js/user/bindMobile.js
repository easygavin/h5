/**
 * 绑定手机号
 */
define(function (require, exports, module) {

  var page = require('page'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      account = require('services/account'),
      template = require("/views/user/bindMobile.html");

  // 处理返回参数
  var canBack = 0;

  var userInfo = null;

  // 倒计时秒数
  var seconds = 0;

  // 定时器
  var secondsTimer = null;

  //登录状态.
  var tkn;

  //判断是否绑定
  var bindFlag = false;

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
    page.setHistoryState({url: "user/bindMobile", data: params},
        "user/bindMobile",
            "#user/bindMobile" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack);
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").html(template);
    //查询手机绑定状态.
    mobileBindState();
  };

  /**
   * 查询手机绑定状态.
   */
  var mobileBindState = function () {

    if (!tkn) {
      page.init('login', {}, 1);
      return false;
    }

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
    if (!_.isEmpty(userInfo)) {
      var mobileNo = userInfo.userMobile;
      if (mobileNo) {
        $('#mobileNo').val("您已绑定手机号码").attr("disabled", true);
        var displayNo = mobileNo.substr(0, 3) + "****" + mobileNo.substr(7, mobileNo.length);
        //显示绑定号码,隐藏发送验证码按钮.
        $('#captcha').val(displayNo).attr("disabled", true);
        $('#sendCaptcha').hide();
        $('#mt').html('');
        $('#ym').html('');
        $('.surebtn').html('返回');
        $('#pass').hide();
        bindFlag = true;
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

    if (!tkn) {
      page.init('login', {}, 1);
      return false;
    }
    if (!bindFlag) {
      var mobileNo = $('#mobileNo').val();
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
        var request = account.bindMobileNo(mobileNo, userInfo.userId, userInfo.userKey, captcha, function (data) {
          if (!_.isEmpty(data)) {
            if (typeof  data.statusCode != 'undefined' && data.statusCode == '0') {
              userInfo.userMobile = mobileNo;
              util.setLocalJson(util.keyMap.LOCAL_USER_INFO_KEY, userInfo);
              page.toast('手机绑定成功');
              page.init('user/bindMobile', {}, 1);
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
            page.toast("系统错误,请稍后再重试");
            page.goBack();
          }
        });
        util.addAjaxRequest(request);
      } else {
        page.init("login", {}, 1);
      }
    } else {
      page.goBack();
    }
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

    //发送验证码
    $('#sendCaptcha').on('click', function () {
      if (secondsTimer != null) {
        return false;
      } else {
        sendCaptcha();
      }
      return true;
    });

    //绑定手机号码.
    $('.surebtn').on('click', function () {
      bindMobile();
      return true;
    });

    //跳过.
    $('#pass').on('click', function () {
      if (canBack) {
        page.goBack();
      } else {
        page.init("home", {}, 0);
      }
      return true;
    });
  };


  return {init: init};
});