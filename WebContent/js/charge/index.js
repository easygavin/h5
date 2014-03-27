/**
 * 充值首页
 */
define(function (require, exports, module) {
    var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      template = require("../../views/charge/index.html"),
      account = require('services/account');

    // 处理返回参数
    var canBack = 0;

    //用户信息.
    var userInfo = null;

    //优惠券编号.从优惠券界面跳转,传递.
    var couponCode = "";

    //.1表示包含可提款余额姓名等信息，0表示只须提供可用余额
    var requestType = 0;

    //优惠券总张数..
    var couponCount = 0;

    //客户端内嵌传值userToken.
    var userToken = "";

    /**
     * 初始化
     */
    var init = function (data, forward) {

      canBack = forward ? 1 : 0;
      //客户端请求带userToken,转换.
      var clientParam = window.location.search.substring(1);
      var from = util.unParam(clientParam);

      if (typeof from.userToken != "undefined") {
        userToken = from.userToken;
      } else if ((typeof from.data != "undefined" && typeof JSON.parse(from.data).userToken != "undefined")) {
        userToken = JSON.parse(from.data).userToken;
      }

      // 参数设置
      var params = {};

      if (data != null && typeof data != "undefined") {
        if (typeof data.couponCode != "undefined" && $.trim(data.couponCode) != '') {
          couponCode = data.couponCode;
          params.couponCode = couponCode;
        }
      }

      var tkn = util.checkLogin(data);
      if (tkn) {
        params.token = tkn;
      }

      if (userToken != '') {
        params.userToken = userToken;
      }

      initShow();

      bindEvent();

      // 处理返回
      page.setHistoryState({url: "charge/index", data: params},
        "charge/index", (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#charge/index",
        canBack);
    };

    /**
     * 初始化显示
     */
    var initShow = function () {

      $("#container").html(template);

      loginByWhich();

      disableCouponInput();

    };

    /**
     * 判断用户登录平台.
     */
    var loginByWhich = function () {
      userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
      //userInfo 不等于空,来自H5自有用户.
      if (typeof userInfo.userId != "undefined" && typeof userInfo.userKey != "undefined") {
        loginByH5();
      } else if (userToken != '') {
        //如果有userToken则表明来自客户端内嵌.
        loginByToken(userToken);
      } else {
        //未登录用户.
        page.init("login", {}, 1);
      }
    };

    /**
     * 获取优惠券总数
     * @param userId   用户Id.
     */
    var getCouponCount = function (userId) {
      var time = getTime();
      var request = account.getCouponInfo("402881a844be45410144be48f845000e", time.beginTime, time.endTime, function (data) {
        //得到优惠券总张数
        if (typeof data != "undefined" && typeof data.statusCode != "undefined") {
          couponCount = typeof data.unUsed == "undefined" ? 0 : data.unUsed;
          $("#couponCount").html(couponCount);
        }
      });
      util.addAjaxRequest(request);
    };

    /**
     *是否禁用优惠券输入框.
     */
    var disableCouponInput = function () {
      if (couponCode != '') {
        $("#coupon").attr("readonly", true).val(couponCode);
      }
    };

    /**
     *获取当前时间,结束时间.
     */
    var getTime = function () {
      var timeObj = {};
      //结束时间(当前时间)
      var endDate = new Date();
      var endYear = endDate.getFullYear();
      var endMonth = endDate.getMonth() < 10 ? "0" + (endDate.getMonth() + 1) : endDate.getMonth() + 1;
      var endDay = endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate();
      var endTime = endYear + "-" + endMonth + "-" + endDay;
      //开始时间(往前推一年).
      var beginDate = new Date(endTime);
      beginDate.setYear(beginDate.getFullYear() - 1);
      var beforeYear = beginDate.getFullYear();
      var beforeMonth = beginDate.getMonth() < 10 ? "0" + (beginDate.getMonth() + 1) : beginDate.getMonth() + 1;
      var beforeDay = beginDate.getDate() < 10 ? "0" + beginDate.getDate() : beginDate.getDate();
      var beginTime = beforeYear + "-" + beforeMonth + "-" + beforeDay;
      timeObj.beginTime = beginTime;
      timeObj.endTime = endTime;
      return timeObj;
    };

    /**
     *文本校验,充值.
     */
    var validateInput = function () {
      var money = $("#money").val(), coupon = $("#coupon").val();
      var pattern = /^[1-9]\d*$/;
      if (money == '') {
        page.toast("请输入充值金额");
        return false;
      } else if (isNaN(money) || !pattern.test(money)) {
        page.toast("充值金额必须为整数");
        return false;
      } else if (parseInt(money) < 10) {
        page.toast("至少充值10元");
        return false;
      }

      /*  var str = "[@/'\"#$%&^*]+";
       var reg = new RegExp(str);
       if (coupon != '' && reg.text(str)) {
       page.toast("请输入有效的优惠券编号");
       }*/


    };

    /**
     * h5自有用户登录.
     */
    var loginByH5 = function () {
      util.showLoading();
      var userId = userInfo.userId, userKey = userInfo.userKey;
      var request = account.getUserBalance(requestType, userId, userKey, function (data) {
        util.hideLoading();
        if (data != "undefined" && data.statusCode == '0') {
          $("#money").html(parseFloat(data.userBalance).toFixed(2));
          // getCouponCount(userId);
        } else {
          page.toast(data.errorMsg);
        }
      });
      util.addAjaxRequest(request);
    };

    /**
     * 根据token得到用户信息,来自客户端.
     */
    var loginByToken = function () {
      var request = account.getUserInfoByToken(userToken, function (data) {
        if (typeof data != "undefined" && typeof data.statusCode != "undefined") {
          if (data.status == '0') {
            $("#money").html(parseFloat(data.userBalance).toFixed(2));
            //getCouponCount(data.userId);
            //保存登录成功信息
            util.setLocalJson(util.keyMap.LOCAL_USER_INFO_KEY, data);
          } else {
            page.toast(data.errorMsg);
          }
        }
      });
      util.addAjaxRequest(request);
    };

    /**
     * 调用充值接口.
     * @param money  充值金额
     * @param coupon  优惠券
     */
    var recharge = function (money, coupon) {

    };

    /**
     * 绑定事件
     */
    var bindEvent = function () {

      //返回
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

      //优惠券说明.
      $(document).off(events.touchStart(), ".whbox").
        on(events.touchStart(), ".whbox", function (e) {
          events.handleTapEvent(this, this, events.activate(), e);
          return true;
        });

      $(document).off(events.activate(), ".whbox").on(events.activate(), ".whbox", function (e) {
        page.init("charge/getCoupon", {}, 1);
        return true;
      });

      //选项卡页面切换.
      $(document).off(events.touchStart(), ".tabs span").
        on(events.touchStart(), ".tabs span", function (e) {
          events.handleTapEvent(this, this, events.activate(), e);
          return true;
        });

      $(document).off(events.activate(), ".tabs span").on(events.activate(), ".tabs span", function (e) {
        $(".tabs span").removeClass("click");
        $(e.currentTarget).addClass("click");
        var showId = $(e.target).attr("id").split("_")[0];
        $('.wrapper').prop('id',$(e.target).data('type'));
      });
      //充值,提款.
      $(document).off(events.touchStart(), ".account").
        on(events.touchStart(), ".account", function (e) {
          events.handleTapEvent(this, this, events.activate(), e);
          return true;
        });

      $(document).off(events.activate(), ".account").
        on(events.activate(), ".account", function (e) {
          var targetId = $(this).attr("id");
          switch (targetId) {
            case "zfb_charge":

              break;
            case "cft_charge":

              break;
            case "czk_charge":

              break;
          }
          return true;
        });
    };

    return {init: init};
  }
);