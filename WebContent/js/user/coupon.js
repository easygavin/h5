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

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward ? 1 : 0;

    initShow();

    bindEvent();

    // 参数设置
    var params = {};
    // 处理返回
    page.setHistoryState({url: "user/coupon", data: params},
        "user/coupon",
            (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#user/coupon",
        canBack);
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    // compile our template
    var tmp = _.template(template);

    $("#container").empty().html(tmp());

    var userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
    //优惠券测试..
    getCouponCount("402881a844be45410144be48f845000e");
    //userToken取值测试.
    //getCouponCount("d53b0a31882653c7d10050ad20c73df5");
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
   * 获取优惠券总数
   * @param userId   用户userId.
   */

  var getCouponCount = function (userId) {
    //获取优惠券
    var time = getTime();
    var request = account.getCouponInfo(userId, time.beginTime, time.endTime, function (data) {
      if (data != "undefined" && data.statusCode == "0") {
        console.log(JSON.stringify(data))
      }
      //得到优惠券总张数
      //couponCount = data.count
    });

    //获取token..
   /* var request =account.getUserInfoByToken("d53b0a31882653c7d10050ad20c73df5",function(data){
      console.log("efg");
      if (data != "undefined") {
        console.log("abc:"+JSON.stringify(data));
      }
    });*/
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