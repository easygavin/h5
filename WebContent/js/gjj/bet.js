/**
 * 冠军竞猜对阵
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    config = require('config'),
    template = require("../../views/gjj/bet.html"),
    gjjService = require('services/gjj');

  var canBack = 1;
  // 标示符
  var lot = "gjj";
  // 彩种配置
  var lotConfig = {};
  // 初始化显示模式
  var mode = "0";
  // 缓存的数据
  var bufferData = null;
  // 注数
  var bets = 0;
  // 对阵列表数据
  var betList = {};
  // 赛事Map
  var matchMap = {};

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

    // 彩种配置
    lotConfig = config.lotteryMap[lot];
    $("#container").html(template);

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "gjj/bet", data: params},
      "gjj/bet",
      "#gjj/bet" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
      canBack);
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    // 显示title信息
    showTitle();

    // 添加模式项
    addModeItems();

    if (canBack) {

      // 获取对阵列表
      getBetList();
    } else {
      // 根据缓存数据判断是否需要重新拉取列表
      // 缓存的数据
      bufferData = util.getLocalJson(lotConfig.localKey);
      if (bufferData != null && typeof bufferData != "undefined"
        && betList != null && typeof betList != "undefined"
        && betList.length > 0) {

        // 处理对阵列表
        handleBetList();

        // 显示缓存数据
        showBuffer();
      } else {
        // 获取对阵列表
        getBetList();
      }
    }

    // 统计注数
    unitBets();
  };

  /**
   * 显示title信息
   */
  var showTitle = function () {
    $(".title").text(lotConfig.name);
  };

  /**
   * 添加模式项
   */
  var addModeItems = function () {

    showModeTitle();

    var data = {};
    data.def = mode;
    data.modes = lotConfig.modes.list;

    var ballModeTpl = require('/tpl/gjj/ball_mode');

    $(".menuBox").html(ballModeTpl(data));
  };

  /**
   * 显示标题
   */
  var showModeTitle = function () {
    // 标题
    var title = lotConfig.modes.list[mode].name;
    $(".caList .mode").text(title);

    // 显示截止时间
    showEndTime();
  };

  /**
   * 显示截止时间
   */
  var showEndTime = function () {
    var issueTxt = "截止时间:" + lotConfig.modes.list[mode].endTime;
    $("#issueNo").text(issueTxt);
  };

  /**
   * 获取对阵列表
   */
  var getBetList = function () {
    betList = {};
    var modeMap = lotConfig.modes.list[mode];
    var request = gjjService.getMatchList(modeMap.event, modeMap.issueNo, function (data) {

      // 隐藏加载标示
      util.hideLoading();
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode === 0) {
            betList = data.datas;
            handleBetList();
          } else {
            page.toast(data.errorMsg);
          }
        }
      }
    });

    util.addAjaxRequest(request);

    handleBetList();
  };

  /**
   * 处理请求的对阵列表
   */
  var handleBetList = function () {
    var data = {};
    data.matchs = betList;
    data.flags = lotConfig.flags;

    var ballMatchTpl = require('/tpl/gjj/ball_match');

    $(".bets").html(ballMatchTpl(data));

    // 重新定义赛事Map
    matchMap = {};
    for (var i = 0, len = betList.length; i < len; i++) {
      matchMap[betList[i].gameId] = betList[i];
    }
  };

  /**
   * 显示缓存数据
   */
  var showBuffer = function () {
    // 隐藏加载标示
    util.hideLoading();

    var matchBetList = bufferData.matchBetList;
    for (var i = 0, len = matchBetList.length; i < len; i++) {
      var item = matchBetList[i];
      $("#m_" + item.gameId).find(".matchSp").addClass("click");
    }
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    // 返回, 模式, 右菜单, 机选一注
    $(document).off(events.touchStart(), ".back, .caList, .pr0, .gmButton").
      on(events.touchStart(), ".back, .caList, .pr0, .gmButton", function (e) {
        events.handleTapEvent(this, this, events.activate(), e);
        return true;
      });

    $(document).off(events.activate(), ".back").
      on(events.activate(), ".back", function (e) {
        page.init("home", {}, 0);
        return true;
      });

    // 模式
    $(document).off(events.activate(), ".caList").
      on(events.activate(), ".caList", function (e) {
        if (bufferData !== null && typeof bufferData != "undefined" && bufferData.length > 0) {
          page.toast("本站暂不支持多种玩法混合投注");
        } else {
          $(".menuBox").show();
          util.showCover();
        }
        return true;
      });

    // 右菜单
    $(document).off(events.activate(), ".pr0").
      on(events.activate(), ".pr0", function (e) {
        $(".popup").show();
        util.showCover();
        return true;
      });

    // 右菜单项点击
    $(document).off(events.click(), ".popup").
      on(events.click(), ".popup", function (e) {
        var $a = $(e.target).closest("a");
        if (!$a.hasClass("click")) {
          var id = $a.attr("id");
          switch (id) {
            case "gc_menu":
              // 购彩记录
              break;
            case "wf_menu":
              util.hideCover();
              page.init("gjj/intro", {}, 1);
              // 玩法介绍
              break;
          }
        }
        return true;
      });

    // 关闭显示框
    $(".cover").off(events.click()).on(events.click(), function (e) {
      $(".popup").hide();
      $(".menuBox").hide();
      util.hideCover();
      return true;
    });

    // 选中模式
    $(document).off(events.click(), ".menuBox").
      on(events.click(), ".menuBox", function (e) {
        var $a = $(e.target).closest("a");
        if (!$a.hasClass("click")) {
          var id = $a.attr("id").split("_")[1];
          // 保存模式
          mode = id;

          $(".menuBox a").removeClass("click");
          $a.addClass("click");

          $(".menuBox").hide();
          util.hideCover();

          // 显示标题
          showModeTitle();

          // 显示模块
          // 显示加载标示
          util.showLoading();
          // 获取对阵列表
          getBetList();

          // 清除原来选中号
          clear();

          // 统计注数
          unitBets();
        }
        return true;
      });

    // 赛事列表点击
    $(document).off(events.tap(), ".bets").
      on(events.tap(), ".bets", function (e) {
        var $matchSp = $(e.target).closest(".matchSp");

        if ($matchSp.length) {
          if ($matchSp.hasClass("click")) {
            $matchSp.removeClass("click");
          } else {
            var count = $(".bets .click").length;
            if (count == 15) {
              page.toast("最多选择15场比赛进行投注");
              return false;
            }
            $matchSp.addClass("click");
          }

          // 统计注数
          unitBets();
        }
      });

    // 确定
    $(document).off(events.click(), ".btn2").
      on(events.click(), ".btn2", function (e) {
        toList();
        return true;
      });

    // 清除
    $(document).off(events.click(), ".btn1").
      on(events.click(), ".btn1", function (e) {
        // 清除
        clear();
        // 统计注数
        unitBets();
        return true;
      });
  };

  /**
   * 确定到列表
   * @returns {boolean}
   */
  var toList = function () {
    // 缓存的数据
    bufferData = (bufferData === null || typeof bufferData == "undefined" || bufferData.length === 0) ? [] : bufferData;

    if (bets > 0) {
      // 保存缓存数据
      var bufferData = {};
      // 投注模式
      bufferData.mode = mode;
      bufferData.bets = bets;

      // 赛事对阵列表
      var matchBetList = [];
      $(".bets .click").each(function (i, item) {
        var gameId = $(item).closest("table ").attr("id").split("_")[1];
        matchBetList.push(matchMap[gameId]);
      });

      bufferData.matchBetList = matchBetList;

      util.setLocalJson(lotConfig.localKey, bufferData);

      page.init("gjj/list", {}, 1);
      return true;
    } else {
      page.toast("请至少选择1场赛事!");
      return false;
    }
  };

  /**
   * 清除
   */
  var clear = function () {
    $(".bets .click").removeClass("click");
  };

  /**
   * 统计注数，消费金额
   */
  var unitBets = function () {
    bets = $(".bets .click").length;

    $("#bets").text(bets);
  };

  return {init: init};
});