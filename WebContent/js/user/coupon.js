/**
 * 优惠券
 */
define(function (require, exports, module) {

  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      template = require("../../views/user/coupon.html"),
      account = require('services/account');

  // 处理返回参数
  var canBack = 0;

  var userInfo;

  //页码.
  var pageNo = 1;

  //总页数.
  var pages = 0;

  //页行数{每页显示10行.}
  var pageSize = 10;

  //用户登录状态.
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
    page.setHistoryState({url: "user/coupon", data: params},
        "user/coupon",
            "#user/coupon" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack);
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    $("#container").html(template);
    //得到优惠券之类的信息.
    getCouponCount();
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
      offBind();
      if (canBack) {
        page.goBack();
      } else {
        page.init("home", {}, 0);
      }
      return true;
    });

    //当点击加载更多按钮的时候.触发
    $(document).off(events.touchStart(), ".loadText").on(events.touchStart(), ".loadText", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), ".loadText").on(events.activate(), ".loadText", function (e) {
      var intRequestPage = parseInt(pageNo, 10);
      if (intRequestPage < pages) {
        pageNo = (intRequestPage + 1) + "";
        getCouponCount();
      }
      return true;
    });


    //点击尚未使用的优惠券编号时,跳转到充值页.自动填充优惠券选项卡.
    $(document).off(events.touchStart(), ".hmBox i").on(events.touchStart(), ".hmBox i", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), ".hmBox i").on(events.activate(), ".hmBox i", function (e) {
      var targetId = $(e.target).attr('id');
      if (targetId != 'undefined' && targetId != '') {
        var couponCode = targetId.split('_')[1];
        page.init('charge/index', {"couponCode": couponCode}, 1);
      }
      return true;
    });

    var timer = 0;
    $(window).on("scroll", function () {
      if (!timer) {
        timer = setTimeout(function () {
          checkScrollPosition();
          timer = 0;
        }, 250);
      }
    });

  };

  /**
   * 获取优惠券列表.
   */

  var getCouponCount = function () {

    if (!tkn) {
      // 尚未登录，弹出提示框
      page.answer("", "您还未登录，请先登录", "登录", "取消", function () {
        page.init("login", {}, 1);
      }, function () {
        $(".popup").hide();
      });
    }

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    //获取优惠券
    var time = getTime();
    // 显示加载图标
    loadingShow(1);
    var request = account.getCouponInfo(userInfo.userId, time.beginTime, time.endTime, pageNo, pageSize, function (data) {
      if (!_.isEmpty(data) && typeof  data.statusCode != "undefined") {
        if (data.statusCode == '0') {
          //data = JSON.parse('{"statusCode":"0","unUsed":3,"count":3,"list":[{"createTime":"2014-03-22","couponName":"充1000.0送10.0充值优惠券","couponNo":"20140322191","updateTime":"","couponType":"1","statusView":"已使用","realDepositMoney":"null","facePresentMoney":"10.0","id":"8a8b818c44e3d11c0144e943b7280018","flag":"0","realPresentMoney":"null","userId":"ff80808144c543a20144dd3d96c00054","useFlag":"0","expiredTime":"2014-06-23","receiveTime":"2014-03-27","faceDepositMoney":"1000.0"},{"createTime":"2014-03-22","couponName":"充1000.0送10.0充值优惠券","couponNo":"20140322192","updateTime":"","couponType":"1","statusView":"未使用","realDepositMoney":"null","facePresentMoney":"10.0","id":"8a8b818c44e3d11c0144e943b72b0019","flag":"0","realPresentMoney":"null","userId":"ff80808144c543a20144dd3d96c00054","useFlag":"0","expiredTime":"2014-06-23","receiveTime":"2014-03-27","faceDepositMoney":"1000.0"},{"createTime":"2014-03-22","couponName":"充1000.0送10.0充值优惠券","couponNo":"20140322193","updateTime":"","couponType":"1","statusView":"未使用","realDepositMoney":"null","facePresentMoney":"10.0","id":"8a8b818c44e3d11c0144e943b72d001a","flag":"0","realPresentMoney":"null","userId":"ff80808144c543a20144dd3d96c00054","useFlag":"0","expiredTime":"2014-06-23","receiveTime":"2014-03-27","faceDepositMoney":"1000.0"}],"errorMsg":"成功"} ');
          showCouponItem(data);
        } else {
          page.toast(data.errorMsg);
        }
      } else {
        page.toast("查询优惠券失败,请稍候重试!");
      }
      util.addAjaxRequest(request);
    });
    loadingShow(0);
  };

  /**
   * 优惠券页面模版.
   */
  var showCouponItem = function (data) {
    pages = (parseInt(data.count) + pageSize - 1) / pageSize;
    if (pageNo < pages) {
      $(".loadText").text("查看更多");
    } else {
      $(".loadText").text("");
    }
    var tmp = $("#couponTpl").html();
    var cmp = _.template(tmp);
    var beforeContent = $('.bb1').html();
    $('.bb1').html(beforeContent + cmp(data));
  };

  /**
   * 加载图片的显示
   */
  var loadingShow = function (flag) {
    if (flag) {
      $(".loadIcon").css({"visibility": "visible"});
    } else {
      $(".loadIcon").css({"visibility": "hidden"});
    }
  };
  /**
   * 检查滚动的位置
   */
  var checkScrollPosition = function () {
    var distance = $(window).scrollTop() + $(window).height();
    if ($("#couponDiv").height() <= distance) {
      var intRequestPage = parseInt(pageNo, 10);
      if (intRequestPage < pages) {
        pageNo = (intRequestPage + 1) + "";
        getCouponCount();
      }
    }
  };

  /**
   * 解除绑定
   */
  var offBind = function () {
    $(window).off("scroll");
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

  return {init: init};

});