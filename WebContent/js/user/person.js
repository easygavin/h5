/**
 * 个人中心首页
 */
define(function (require, exports, module) {

  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      fastClick = require('fastclick'),
      template = require("../../views/user/person.html"),
      account = require('services/account');

  // 处理返回参数
  var canBack = 0;

  //从callback到个人中心,传递过来的result &type
  var result, type;

  //用户信息.
  var userInfo = null;

  //1表示包含可提款余额姓名等信息，0表示只须提供可用余额
  var requestType = 0;

  //登录状态校验.
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

    type = data.type;
    result = data.result;

    initShow();

    bindEvent();

    // 处理返回
    page.setHistoryState({url: "user/person", data: params},
        "user/person", "#user/person" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack);

    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    $("#container").html(template);
    //金额,账户名显示.
    getBalance();

  };

  /**
   * 查询账户姓名,金额.
   */
  var getBalance = function () {

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
    if (!_.isEmpty(userInfo) && userInfo.userId && userInfo.userKey) {
      util.showLoading();
      var request = account.getUserBalance(requestType, userInfo.userId, userInfo.userKey, function (data) {
        util.hideLoading();
        if (!_.isEmpty(data) && data.statusCode == '0') {
          $("#trueName").html("账户名:" + userInfo.userName);
          var balance = parseFloat(data.userBalance).toFixed(2);
          $("#balance").html(balance > 0 ? balance : 0);
        } else if (data.statusCode == '0007') {
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
   * 查询是否绑定身份证(当点击绑定银行卡的时候).
   * @param flag 如果参数 flag =withdrawal 则表明,用户点击提款.
   */
  var idState = function (flag) {

    if (!tkn) {
      // 尚未登录，弹出提示框
      page.answer("", "您还未登录，请先登录", "登录", "取消", function () {
        page.init("login", {}, 1);
      }, function () {
        $(".popup").hide();
      });
    }
    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
    // 显示遮住层
    if (!_.isEmpty(userInfo) && userInfo.userId && userInfo.userKey) {
      account.inspectUserIDCardState(userInfo.userId, userInfo.userKey, function (data) {
        if (!_.isEmpty(data)) {
          if (typeof data.statusCode != 'undefined' && data.statusCode == '0') {
            //存储用户的真实姓名.在绑定银行卡页面需要.
            util.setLocalJson(util.keyMap.USER_TRUE_NAME, data.name);
            //如果flag=1则代表用户是点击提款,则接下来判断是否绑定银行卡.
            if (flag == 'withdrawal') {
              bankCardState();
            } else {
              //否则直接跳转到绑定银行卡界面.
              page.init('user/bindBankCard', {}, 1);
            }
          } else if (data.statusCode == '0007') {
            page.toast('暂未进行身份认证');
            page.init('user/authenticate', {}, 1);
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          page.toast('查询失败,请稍后重试!');
        }
      });
    } else {
      page.init('login', {}, 1);
    }
  };

  /**
   * 查询是否绑定银行卡.
   */
  var bankCardState = function () {

    if (!tkn) {
      // 尚未登录，弹出提示框
      page.answer("", "您还未登录，请先登录", "登录", "取消", function () {
        page.init("login", {}, 1);
      }, function () {
        $(".popup").hide();
      });
    }

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
    if (!_.isEmpty(userInfo) && userInfo.userId && userInfo.userKey) {
      var userId = userInfo.userId, userKey = userInfo.userKey;
      account.getUserBalance('1', userId, userKey, function (data) {
        if (!_.isEmpty(data)) {
          if (typeof  data.statusCode != 'undefined' && data.statusCode == '0') {
            page.init('user/withdrawal');
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          page.toast('查询失败,请稍后重试');
        }
      });
    }
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    fastClick.attach('click');
    // 返回
    $('.back').on('click', function () {
      if (type != '' && type != 'undefined' && result != '' && result != 'undefined') {
        page.init('home', {}, 0);
      } else {
        if (canBack) {
          page.goBack();
        } else {
          page.init("home", {}, 0);
        }
      }
      return true;
    });
    //选项.
    $('.account').on('click', "li", function (e) {
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
          //先查询是否绑定身份证.
          idState('');
          break;
        //手机绑定.
        case "bindMobile":
          page.init("user/bindMobile", {}, 1);
          break;
        //密码修改.
        case "editinfo":
          page.init("user/editinfo", {}, 1);
          break;
        //身份认证.
        case "authenticate":
          page.init("user/authenticate", {}, 1);
          break;
      }
    });

    //充值,提款.
    $('#cwi').on('click', 'a', function () {
      var targetId = $(this).attr("id");
      switch (targetId) {
        case "charge":
          page.init("charge/index", {}, 1);
          break;
        case "withdrawal":
          idState('withdrawal');
          break;
      }
    });
  };

  return {init: init};
});