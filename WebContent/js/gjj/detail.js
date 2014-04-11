/**
 * 数字彩方案详情
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    template = require("../../views/gjj/detail.html"),
    gjjService = require('services/gjj');
  var canBack = 1;
  // 方案编号
  var projectno = "";
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

    if (data != null && typeof data != "undefined") {
      // 方案编号
      if (typeof data.projectno != "undefined" && $.trim(data.projectno) != "") {
        projectno = data.projectno;
        params.projectno = projectno;
      }
    }

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "gjj/detail", data: params},
      "gjj/detail",
      "#gjj/detail" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
      canBack);
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").html(template);
    // 获取方案详情
    getDetails();
  };

  /**
   * 获取方案详情
   */
  var getDetails = function () {
    /*var request = gjjService.getProjectDetail(projectno, function (data) {
     // 隐藏加载标示
     util.hideLoading();
     if (typeof data != "undefined") {
     if (typeof data.statusCode != "undefined") {
     if (data.statusCode == "0") {
     showDetails(data);
     } else {
     page.codeHandler(data);
     }
     }
     }
     });

     util.addAjaxRequest(request);*/

    // 隐藏加载标示
    util.hideLoading();
    showDetails(resultData);
  };

  /**
   * 显示详情
   * @param data
   */
  var showDetails = function (data) {

    var detailTpl = require('/tpl/gjj/detail');

    $(".detailBox").html(detailTpl(data));
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
        page.goBack();
        return true;
      });

    // 冠军竞猜投注
    $(document).off(events.click(), "#goBuyGjj").
      on(events.click(), "#goBuyGjj", function (e) {
        page.init("gjj/bet", {}, 0);
        return true;
      });
  };

  // 模拟返回数据
  var resultData = {
    statusCode: 0,
    matchInfo: [
      {
        promul: 28,
        champion: "巴西",
        sp: "2.65",
        event: "世界杯",
        gameId: "1",
        team: "巴西",
        playType: "冠军竞猜"
      },
      {
        promul: 17,
        champion: "巴西",
        sp: "4.35",
        event: "世界杯",
        gameId: "2",
        team: "德国",
        playType: "冠军竞猜"
      },
      {
        promul: 19,
        champion: "巴西",
        sp: "4.00",
        event: "世界杯",
        gameId: "3",
        team: "阿根廷",
        playType: "冠军竞猜"
      },
      {
        promul: 15,
        champion: "巴西",
        sp: "5.00",
        event: "世界杯",
        gameId: "4",
        team: "西班牙",
        playType: "冠军竞猜"
      },
      {
        promul: 4,
        champion: "巴西",
        sp: "17.00",
        event: "世界杯",
        gameId: "5",
        team: "比利时",
        playType: "冠军竞猜"
      },
      {
        promul: 4,
        champion: "巴西",
        sp: "17.00",
        event: "世界杯",
        gameId: "6",
        team: "荷兰",
        playType: "冠军竞猜"
      },
      {
        promul: 5,
        champion: "巴西",
        sp: "16.00",
        event: "世界杯",
        gameId: "7",
        team: "意大利",
        playType: "冠军竞猜"
      },
      {
        promul: 4,
        champion: "巴西",
        sp: "18.00",
        event: "世界杯",
        gameId: "8",
        team: "法国",
        playType: "冠军竞猜"
      }
    ],
    projectInfo: {
      awardAmount: 0,
      percent: 0,
      totalAmout: 192,
      projectState: "未开奖",
      oneAmount: 192,
      userId: 2796204,
      openStatus: "4",
      userName: "test101",
      projectType: "0",
      projectNo: "GJZ14041112053245722",
      projectDate: "2014-04-11 12:05"
    }
  };
  return {init: init};
});