/**
 * 账户明细
 */
define(function (require, exports, module) {
  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      account = require('services/account'),
      template = require('../../views/user/accountDetail.html');

  // 处理返回参数
  var canBack = 0;
  //用户信息.
  var userInfo;
  // 请求页码
  var requestPage = "1";
  // requestType 0: 全部，1：收入，2：支出
  var requestType = "0";
  // 时间段
  var periodOfCheck = "30";
  // 总页面数
  var pages = 0;

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward ? 1 : 0;

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    initShow();

    initQuery();

    bindEvent();

    // 参数设置
    var params = {};

    // 参数设置
    var params = {};
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }
    // 处理返回
    page.setHistoryState({url: "user/accountDetail", data: params},
        "user/accountDetail",
            "#user/accountDetail" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack);
    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    $("#container").html(template);
  };

  /**
   * 初始化加载内容.
   */

  var initQuery = function (data) {

    // 参数重置
    requestPage = "1", requestType = "0", periodOfCheck = "30";

    // 清空列表
    clearItems();

    // 请求数据
    getBuyRecordsList();
  };
  /**
   * 获取购买记录
   */
  var getBuyRecordsList = function () {

    // 总页数重置
    pages = 0;
    if (_.isEmpty(userInfo)) {
      page.init('login', {}, 1);
      return false;
    }

    // 保存登录成功信息
    var data = {};
    // sortType 排序方式,0 表示时间倒序默认为0;1 表示金额倒序
    data.sortType = "0";
    data.requestPage = requestPage;
    // requestType 0: 全部，1：中奖，2：未中奖
    data.requestType = requestType;
    data.pagesize = "20";
    data.periodOfCheck = periodOfCheck;
    data.userId = userInfo.userId + "";
    data.userKey = userInfo.userKey;

    // 显示加载图标
    loadingShow(1);

    var request = account.getAccountDetailList(data, function (data) {
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            showItems(data);
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          page.toast("加载失败");
        }
      } else {
        page.toast("加载失败");
      }
      // 隐藏加载图标
      loadingShow(0);
    });
  };

  /**
   * 显示列表信息
   * @param data
   */
  var showItems = function (data) {
    pages = data.pages;
    if (parseInt(requestPage, 10) < pages) {
      $(".loadText").text("查看更多");
    } else {
      $(".loadText").text("");
    }
    for (var i = 0, len = data.recordArray.length; i < len; i++) {
      addItem(data.recordArray[i]);
    }
  };
  /**
   * 添加一项数据
   * @param item
   */
  var addItem = function (item) {
    var typeTxt = "";
    switch (item.incomeOrExpenses + "") {
      case "0": // 收入
        typeTxt = "收入";
        break;
      case "1": // 支出
        typeTxt = "支出";
        break;
    }
    var $tr = $("<tr></tr>");
    $tr.append($('<td width="2%">&nbsp;</td>'));
    var html =
        "<p class='smbg'><i></i>" + typeTxt + "</p>" +
        "<p>时间：" + item.time + "</p>" +
        "<p>类型：" + item.exchangeType + "</p>" +
        "<p>编号：" + item.lotteryNo + "</p>" +
        "<p>金额：<i style='color: #ff0000;margin: 0 5px'>" + parseFloat(item.amount).toFixed(2) + "</i>元</p>";
    $tr.append($("<td></td>").html(html));
    $tr.append($('<td width="2%">&nbsp;</td>'));
    $("#accountRecord tbody").append($tr);
  };
  /**
   * 清空列表.
   */
  var clearItems = function () {

    $('#accountRecord tbody').empty();

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
    if ($("#accountDiv").height() <= distance) {
      var intRequestPage = parseInt(requestPage, 10);
      if (intRequestPage < pages) {
        requestPage = (intRequestPage + 1) + "";
        getBuyRecordsList();
      }
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
      offBind();
      page.goBack();
      return true;
    });

    // Tab 切换
    $(document).off(events.touchStart(), ".jltab a").on(events.touchStart(), ".jltab a", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), ".jltab a").on(events.activate(), ".jltab a", function (e) {
      var $target = $(this);
      var id = $target.attr("id").split("_")[1];
      switch (id) {
        case "all":
          requestType = "0";
          periodOfCheck = "30";
          break;
        case "out":
          requestType = "2"; //支出
          periodOfCheck = "30";
          break;
        case "in": // 收入
          requestType = "1";
          periodOfCheck = "30";
          break;
        case "day": // 近一周
          requestType = "0";
          periodOfCheck = "7";
          break;
      }
      // 重新拉取数据
      requestPage = "1";

      clearItems();
      getBuyRecordsList();

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
   * 解除绑定
   */
  var offBind = function () {
    $(window).off("scroll");
  };

  return {init: init};
});