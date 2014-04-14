/**
 * 购彩记录
 */
define(function (require, exports, module) {
  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      template = require("../../views/user/buyRecord.html"),
      account = require('services/account');

  // 处理返回参数
  var canBack = 0;

  // 彩种 双色球|大乐透|十一运夺金|福彩3D|幸运赛车|竞彩足球|
  // 竞彩篮球胜负|竞彩篮球让分胜负|竞彩篮球胜分差||竞彩篮球大小分|竞彩篮球混投
  // 竞彩足球胜平负|竞彩足球让球胜平负|竞彩足球比分|竞彩足球总进球|竞彩足球半全场|竞彩足球混投|让球胜平负
  var lotteryTypeArray = "11|13|31|12|14|36|37|38|39|53|46|56|47|48|49|52|56";

  // 请求彩种列表
  var typeArr = "";

  // buyType 0: 全部, 1: 自购
  var buyType = "0";

  // 请求页码
  var requestPage = "1";

  // requestType 0: 全部，1：中奖，2：未中奖
  var requestType = "0";

  // 总页面数
  var pages = 0;

  //用户信息.
  var userInfo;

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward ? 1 : 0;

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    // 彩种列表
    typeArr = data.lotteryTypeArray || lotteryTypeArray;

    // 返回后的Tab焦点与数据加载参数
    if (forward) {
      buyType = "0", requestPage = "1", requestType = "0";
    }

    // 参数设置
    var params = {};
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }
    params.lotteryTypeArray = typeArr;

    initShow();

    bindEvent();

    initQuery();

    // 处理返回
    page.setHistoryState({url: "user/buyRecord", data: params},
        "user/buyRecord",
            "#user/buyRecord" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack);
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initQuery = function (data) {

    showTitle();

    // 清空列表
    clearItems();

    requestPage = "1";
    // 请求数据
    getBuyRecordsList();
  };

  /**
   * 显示title信息
   */
  var showTitle = function () {
    var title = "购彩记录", prepend = "";
    switch (typeArr) {
      case "11": // 双色球
        prepend = "双色球";
        break;
      case "13": // 大乐透
        prepend = "大乐透";
        break;
      case "31": // 十一运夺金
        prepend = "十一运夺金";
        break;
      case "12": // 福彩3D
        prepend = "福彩3D";
        break;
      case "14": // 幸运赛车
        prepend = "幸运赛车";
        break;
      case "46": // 竞彩足球胜平负
      case "47": // 竞彩足球比分
      case "48": // 竞彩足球总进球
      case "49": // 竞彩足球半全场
      case "52": // 竞彩足球混投
      case "56": // 竞彩足球让球胜平负
        prepend = "竞彩足球";

        break;
      case "36": // 竞彩蓝球胜负
      case "37": // 竞彩蓝球让分胜负
      case "38": // 竞彩蓝球胜分差
      case "39": // 竞彩蓝球大小分
      case "53": // 竞彩蓝球混投
        prepend = "竞彩蓝球";
        break;
    }
    $("#title").text(prepend + title);
  };

  /**
   * 清空列表
   */
  var clearItems = function () {

    $(".buyInformation tbody").empty();

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

    var data = {};
    // buyType 0: 全部, 1: 自购
    data.buyType = buyType;
    data.requestPage = requestPage;
    // requestType 0: 全部，1：中奖，2：未中奖
    data.requestType = requestType;
    data.lotteryTypeArray = typeArr;
    data.pagesize = "20";
    data.periodOfCheck = "90";
    data.userId = userInfo.userId + "";
    data.userKey = userInfo.userKey;

    // 显示加载图标
    loadingShow(1);

    account.getBuyRecordsList(data, function (data) {
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
  /**
   * 添加一项数据
   * @param item
   */
  var addItem = function (item) {
    var cssStyle = '', schemeStatus = '';
    switch (item.schemeStatus) {
      case "0": //失败
        cssStyle = 'bg5';
        schemeStatus = '失败';
        break;
      case "1": //未满员
        cssStyle = 'bg2';
        schemeStatus = '未满员';
        break;
      case "2": //出票中
        cssStyle = 'bg4';
        schemeStatus = '出票中';
        break;
      case "3": //未开奖
        cssStyle = 'bg3';
        schemeStatus = '未开奖';
        break;
      case "4": //未中奖
        cssStyle = 'bg8';
        schemeStatus = '未中奖';
        break;
      case "5": //已中奖
        cssStyle = 'bg1';
        schemeStatus = '已中奖';
        break;
      case "6": //已撤单
        cssStyle = 'bg9';
        schemeStatus = '已撤单';
        break;
      case "7"://追号中
        cssStyle = 'bg7';
        schemeStatus = '追号中';
        break;
    }
    var $tr = $("<tr></tr>");
    $tr.append($("<td></td>").append($("<b></b>").html(schemeStatus).addClass(cssStyle)));
    var $p1 = $("<p></p>");
    $p1.html("<i class='f16'>" + item.lotteryName + "-" + item.purchaseType + "</i>");
    var payment = "<i>认购金额：<span class='cf60'>" + parseFloat(item.payment).toFixed(2) + "</span>元</i>";
    var $p2 = $("<p></p>");
    $p2.html(payment);
    var $td = $("<td class='tl'></td>");
    $td.append($p1, $p2);
    if (parseInt(item.income, 10) > 0) {
      var $p3 = $("<p></p>");
      $p3.html("<i>奖金：<i class='cf60'>" + parseFloat(item.income).toFixed(2) + "</i>元</i>");
      $td.append($p3);
    }
    $tr.append($td);
    $tr.append($("<td></td>").html("<i class='fr'>" + item.time + "</i>"));
    $tr.append($("<td class='tc'></td>").append($("<a class='fm'>&#xf059;</a>").attr({"id": "more_" + item.lotteryType + "_" + item.projectId})));
    $(".buyInformation tbody").append($tr);
  };
  /**
   * 初始化显示
   */
  var initShow = function () {

    $("#container").html(template);
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

    //tab 切换.
    $(document).off(events.touchStart(), ".jltab a").on(events.touchStart(), ".jltab a", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), ".jltab a").on(events.activate(), ".jltab a", function (e) {
      var $target = $(this);
      var id = $target.attr("id").split("_")[1];
      switch (id) {
        case "all": //全部
          requestType ="0";
          buyType ="0";
          break;
        case "awarded": // 中奖
          requestType = "1";
          buyType ="0";
          break;
        case "notAward": // 未中奖
          requestType = "2";
          buyType ="0";
          break;
        case "buy": // 自购
          requestType ="0";
          buyType = "1";
          break;
      }
      // 重新拉取数据
      requestPage = "1";
      clearItems();
      getBuyRecordsList();
      return true;
    });


    // 详情
    $(document).off(events.touchStart(), ".buyInformation tr").on(events.touchStart(), ".buyInformation tr", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), ".buyInformation tr").on(events.activate(), ".buyInformation tr", function (e) {
      // 详情
      var params = $(this).find(".fm").attr("id").split("_");
      if (params.length == 3) {
        offBind();
        var lotteryType = params[1], requestType = "0", projectId = params[2];
        if (lotteryType == "11" || lotteryType == "12" || lotteryType == "13" || lotteryType == "14" || lotteryType == "31") {
          // 数字彩，高频彩
          page.init("digit/details", {lotteryType: lotteryType, requestType: requestType, projectId: projectId}, 1);
        } else if (lotteryType == "36" || lotteryType == "37"
            || lotteryType == "38" || lotteryType == "39"
            || lotteryType == "53") {
          // 竞彩篮球
          page.init("jcl/result", {lotteryType: lotteryType, requestType: requestType, projectId: projectId}, 1);
        } else if (lotteryType == "46" || lotteryType == "47" || lotteryType == "48" || lotteryType == "49" || lotteryType == "52" || lotteryType == "56") {
          page.init("jcz/result", {lotteryType: lotteryType, requestType: requestType, projectId: projectId}, 1);
        }
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
   * 检查滚动的位置
   */
  var checkScrollPosition = function () {
    var distance = $(window).scrollTop() + $(window).height();
    if ($("#buyRecordDiv").height() <= distance) {
      var intRequestPage = parseInt(requestPage, 10);
      if (intRequestPage < pages) {
        requestPage = (intRequestPage + 1) + "";
        getBuyRecordsList();
      }
    }
  };

  /**
   * 解除绑定
   */
  var offBind = function () {
    $(window).off("scroll");
  };

  return {init: init};
});