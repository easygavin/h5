/**
 * 公告详情
 */
define(function (require, exports, module) {
  var page = require("page"),
    util = require("util"),
    $ = require("zepto"),
    _ = require("underscore"),
    template = require("../../views/notice/detail.html"),
    noticeService = require('services/notice'),
    path = require('path'),
    config = require('config');

  var canBack = 1;
  // 公告ID
  var noticeId = "";
  // 返回数据
  var result = null;


  /**
   * 初始化
   */
  var init = function (data, forward) {
    canBack = forward || 0;

    // 参数设置
    var params = {};
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    // 公告ID
    if (data != null && typeof data != "undefined"
      && typeof data.noticeId != "undefined" && $.trim(data.noticeId) != "") {
      noticeId = data.noticeId;
      params.noticeId = noticeId;
    }

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "notice/detail", data: params},
      "notice/detail",
      "#notice/detail" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
      canBack);
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").html(template);

    // 请求数据
    getNoticeDetail();
  };

  /**
   * 获取公告详情
   */
  var getNoticeDetail = function () {

    // 请求数据
    var request = noticeService.getNoticeDetail(noticeId, function (data) {

      // 隐藏加载标示
      util.hideLoading();
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            showDetail(data);
          }
        }
      }
    });

    util.addAjaxRequest(request);
  };

  /**
   * 显示列表信息
   * @param data
   */
  var showDetail = function (data) {

    result = data;
    // 标题
    $(".lotteryNum").text(result.title);

    var $contain = $(".bets");

    // 图片
    if ($.trim(result.imgUrl) != "") {
      console.log(path.NOTICE_SERVER_URL + result.imgUrl);
      $contain.append($("<img width='95%' style='width: 95%;display: block;margin: 1em auto;' " +
        "src='" + path.NOTICE_SERVER_URL + result.imgUrl + "'/>"));
    }

    // 内容
    if ($.trim(result.contentUrl) != "") {
      var contentUrl = path.NOTICE_SERVER_URL + result.contentUrl;
      $contain.append($("<div style='width: 98%;margin:0 auto;'></div>").append($("<iframe id='noticeFrame' scrolling='no' frameborder='0' width='100%' height='0' style='padding: 0;margin: 0;height:1500px;'" +
        " src=" + contentUrl + "></iframe>")));
    }

    // 类型
    if (result.type == "-1") { // 不显示立即参与
      // 普通活动
      $("footer").hide();
    }

  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    $(window).off("message").
      on("message", function (e) {
        if (e.origin === "http://gj.caipiao123.com.cn") {
          var height = parseInt(e.data, 10) + 40;
          $("#noticeFrame").css({"height": height + "px"});
        }
        return true;
      });

    // 返回
    $(".back").on("click", function (e) {
      if (canBack) {
        page.goBack();
      } else {
        page.init("home", {}, 0);
      }
      return true;
    });

    // 立即参与
    $("#noticeJoin").on("click", function (e) {
      switch (result.type) {
        case "0": // 普通活动
          switch (result.lotteryId) {
            case "500": // 注册页
              page.init("register", {}, 1);
              break;
            case "501": // 反馈页
              break;
            case "502": // 设置页
              break;
          }
          break;
        case "1": // 充值
          // 跳到充值页面

          break;
        case "2": // 购彩
          switch (result.lotteryId) {
            case "4": // 排列3
            case "11": // 双色球
            case "12": // 福彩3D
            case "13": // 大乐透
            case "31": // 十一运夺金
            case "34": // 11选5
              var key = config.lotteryIdToStr[result.lotteryId];
              var lotConfig = config.lotteryMap[key];
              util.clearLocalData(lotConfig.localKey);
              page.init(lotConfig.paths["ball"].js, {lot: lotConfig.key}, 1);

              break;
            case "46": // 竞彩足球
              console.log("[notice detail] : to jcz");
              break;
            case "36": // 竞彩篮球
              console.log("[notice detail] : to jcl");
              break;
          }
          break;
        case "3": // 网页跳转
          window.location.href = result.openUrl;
          break;
      }
      return true;
    });
  };

  return {init: init};
});