/**
 * 提款
 */
define(function (require, exports, module) {
  var page = require('page'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      path = require('path'),
      account = require('services/account'),
      template = require("../../views/user/withdrawal.html");

  var canBack = 1;

  var requestType = 1;

  //用户信息.
  var userInfo = null;

  var userBankInfo = {};

  var tkn;

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward || 0;
    var params = {};
    tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    initShow();

    bindEvent();

    // 处理返回
    page.setHistoryState({url: "user/withdrawal", data: params},
        "user/withdrawal",
            "#user/withdrawal" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack);
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
   * 获取绑定银行卡信息.
   */
  var getBalance = function () {

    if (!tkn) {
      page.init("login", {}, 1);
      return false;
    }

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
    if (!_.isEmpty(userInfo) && userInfo.userId && userInfo.userKey) {
      var userId = userInfo.userId, userKey = userInfo.userKey;
     var request= account.getUserBalance(requestType, userId, userKey, function (data) {
        if (!_.isEmpty(data)) {
          if (typeof  data.statusCode != 'undefined' && data.statusCode == '0') {
            userBankInfo = data;
            var reduce = parseFloat(data.availMoney); //可提款金额
            $("#trueName").html(data.name.substring(0, 1) + "***");
            if (reduce > 0) {
              $("#candrawal").html(reduce.toFixed(2) + "元");
            } else {
              $("#candrawal").html("0元");
            }
            $("#bankInfo").html(data.bankInfo);
            if ((data.cardNo).length > 10) {
              $("#bankNum").html((data.cardNo).substring(0, 9) + "*****");
            } else {
              $("#bankNum").html(data.cardNo);
            }
          } else if (data.statusCode == "0007") {
            page.toast(data.errorMsg);
            page.goBack();
          }else if (data.statusCode == '-2' || data.errorMsg.indexOf('token失效') != -1) {
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
          //接口返回数据失败.
          page.toast("查询失败,请稍后重试");
        }
      });
      util.addAjaxRequest(request);
    } else {
      page.init("login", {}, 1);
    }
  };

  /**
   *提款.
   */
  var withdrawal = function () {

    if (!tkn) {
      // 尚未登录，弹出提示框
      page.answer("", "您还未登录，请先登录", "登录", "取消", function () {
        page.init("login", {}, 1);
      }, function () {
        $(".popup").hide();
      });
      return false;
    }

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    if (!_.isEmpty(userBankInfo) && typeof userBankInfo.availMoney != 'undefined') {
      var availMoney = parseInt(userBankInfo.availMoney);
      var drawalmoney = $("#drawalmoney").val(), drawalpass = $("#drawalpass").val();
      if (availMoney < 10) {
        page.toast("您的可提款金额小于10元");
        return false;
      }
      if (drawalmoney < 10) {
        page.toast("提款金额最少10元");
        return false;
      } else if (isNaN(drawalmoney)) {
        page.toast("取款金额必须为正整数");
        return false;
      }
      if (drawalpass == '') {
        page.toast("请输入提款密码");
        return false;
      }
      var platform = path.platform, channelNo = path.channelNo;
      // 发送请求.
      var request = account.withdrawal(userInfo.userId, userInfo.userKey,
          drawalmoney, userInfo.userMobile, drawalpass, 0, platform, channelNo, userInfo.userName, function (data) {
            if (!_.isEmpty(data)) {
              if (typeof data.statusCode != 'undefined' && data.statusCode == '0') {
                //重新再请求下数据.
                getBalance();
                //提款成功.更新可用金额显示.
                page.answer(
                    "提款成功", "提款申请成功，经审核无误款项将在三个工作日内汇进您的指定账户",
                    "返回个人中心", "确定",
                    function (e) {
                     page.init('user/person',{},1);
                    },
                    function (e) {
                      page.init('user/withdrawal',{},1);
                    }
                );
              } else {
                page.toast(data.errorMsg);
              }
            } else {
              page.toast("系统错误请稍后重试");
            }
          });
      util.addAjaxRequest(request);
    }
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    $('.back').on('click', function () {
      page.goBack();
      return true;
    });

    // 提款须知.
    $('#notes').on('click', function () {
      page.init('user/drawalnotes', {}, 1);
      return true;
    });

    // 提款.
    $('#confdrawal').on('click', function () {
      withdrawal();
      return true;
    });
  };

  return {init: init};
});