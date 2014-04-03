/**
 * 三球数字彩选号
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    config = require('config'),
    digitService = require('services/digit');
  var canBack = 1;
  // 标示符
  var lot = "";
  // 彩种配置
  var lotConfig = {};
  // 初始化显示模式
  var mode = "0";
  // 期号
  var issue = {};
  // 上期开奖
  var lastIssue = {};
  // 缓存的数据
  var bufferData = null;
  // 注数
  var bets = 0;
  // 开奖期数
  var issueCount = 5;
  // 开奖号码列表
  var openNumbers = {};
  /**
   * 初始化
   */
  var init = function (data, forward) {
    canBack = forward;

    // 参数设置
    var params = {};
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    if (data != null && typeof data != "undefined") {
      // 彩种
      if (typeof data.lot != "undefined" && $.trim(data.lot) != "") {
        lot = data.lot;
        params.lot = lot;
      }
    }
    // 彩种配置
    lotConfig = config.lotteryMap[lot];
    require.async(lotConfig.paths["ball"].tpl, function (tpl) {
      $("#container").html(tpl);

      initShow();
      bindEvent();

    });

    // 处理返回
    page.setHistoryState({url: lotConfig.paths["ball"].js, data: params},
      lotConfig.paths["ball"].js,
      (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#" + lotConfig.paths["ball"].js,
      canBack ? 1 : 0);
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    // 显示title信息
    showTitle();

    // 获取用户中奖信息
    getUserAwardInfo();

    // 获取期号
    getIssue();

    // 获取上期开奖号码
    getLastIssue();

    // 读取缓存数据
    readBuffer();

    // 添加模式项
    addModeItems();

    // 显示模块
    showModeZone();

    // 统计注数
    unitBets();

    // 获取开奖号码
    getOpenNumbers();
  };

  /**
   * 显示title信息
   */
  var showTitle = function () {
    $(".title").text(lotConfig.name);
  };

  /**
   * 读取缓存数据
   */
  var readBuffer = function () {
    // 缓存的数据
    bufferData = util.getLocalJson(lotConfig.localKey);

    if (bufferData !== null && typeof bufferData != "undefined" && bufferData.length > 0) {
      mode = bufferData[0].mode;
    } else {
      if (canBack) {
        mode = lotConfig.modes.def;
        bets = 0;
      }
    }
  };

  /**
   * 添加模式项
   */
  var addModeItems = function () {

    showModeTitle();

    var data = {};
    data.def = mode;
    data.modes = lotConfig.modes.list;

    var ballModeTpl = require('/tpl/number/ball_mode');

    $(".menuBox").html(ballModeTpl(data));

  };

  /**
   * 显示标题
   */
  var showModeTitle = function () {
    // 标题
    var title = lotConfig.modes.list[mode].name;
    $(".caList .mode").text(title);
  };

  /**
   * 显示模块
   */
  var showModeZone = function () {
    $(".bets .hidden").hide();

    if (lotConfig.modes.list[mode].rdm) {
      $(".gmButton").show();
    } else {
      $(".gmButton").hide();
    }

    var modeMap = lotConfig.modes.list[mode];
    for (var i = 0; i < modeMap.shows.length; i++) {
      var $line = $("#line_" + modeMap.shows[i].id);
      $line.find(".ball_t").text(modeMap.shows[i].desc);
      $line.find(".ly_t").text(modeMap.shows[i].yl);
      // 清除上次遗留号
      $line.find(".ext").text("");

      $line.show();
    }
    $(".hot").html(modeMap.desc);

    // 显示遗留号
    showOmitData();
  };

  /**
   * 获取用户中奖信息
   */
  var getUserAwardInfo = function () {
    var request = digitService.getUserAwardByLotteryId(lotConfig.lotteryId, "10", "1", function (data) {
      if (typeof data != "undefined" && data.length > 0) {
        var userName = data[0].username, awardMoney = data[0].awardmoney;
        page.grayToast("恭喜！" + userName + lotConfig.modes.list[mode].name + "，喜中" + awardMoney + "元");
      }
    });

    util.addAjaxRequest(request);
  };

  /**
   * 获取期号
   */
  var getIssue = function () {
    issue = {};
    $("#issueNo").text("获取期号中...");
    var request = digitService.getCurrLottery(lotConfig.lotteryId, function (data) {

      // 隐藏加载标示
      util.hideLoading();
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode === "0") {
            issue = data;
            handleIssue();
          } else {
            page.toast(data.errorMsg);
          }
        }
      }
    });

    util.addAjaxRequest(request);
  };

  /**
   * 处理显示期号
   */
  var handleIssue = function () {

    // 13139期截止时间:11-26 19:30
    var issueTxt = "第" + issue.issueNo + "期 ";
    if (issue.endTime !== null && typeof issue.endTime != "undefined" &&
      $.trim(issue.endTime) !== "") {
      issueTxt += issue.endTime.substring(issue.endTime.indexOf("-") + 1, issue.endTime.lastIndexOf(":"));
    }

    issueTxt += " 截止";
    $("#issueNo").text(issueTxt);
  };

  /**
   * 获取上期开奖号码
   */
  var getLastIssue = function () {
    lastIssue = {};
    var request = digitService.getLastLottery(lotConfig.lotteryId, function (data) {
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode === "0") {
            console.log(JSON.stringify(data));
            lastIssue = data;
            // 显示遗留号
            showOmitData();
          } else {
            page.toast(data.errorMsg);
          }
        }
      }
    });

    util.addAjaxRequest(request);
  };

  /**
   * 显示遗留号
   */
  var showOmitData = function () {
    var modeMap = lotConfig.modes.list[mode];
    if (modeMap.omit &&
      lastIssue !== null && typeof lastIssue != "undefined" &&
      lastIssue.omitDatas !== null && typeof lastIssue.omitDatas != "undefined") {
      if (lastIssue.omitDatas.length) {
        var omitData = lastIssue.omitDatas[modeMap.omitIndex][modeMap.omitKey];
        if (omitData !== null && typeof omitData != "undefined" && omitData.length > 0) {
          // 行迭代
          for (var i = 0; i < modeMap.shows.length; i++) {
            var $line = $("#line_" + modeMap.shows[i].id);

            // 显示遗留号
            $line.find(".ext").each(function (k, item) {
              $(item).text(omitData[i][k]);
            });
          }
        }
      }
    }
  };

  /**
   * 获取上5期开奖号码
   */
  var getOpenNumbers = function () {
    $(".f16").text("获取开奖号码中...");
    // 请求数据
    digitService.getHistoryAwardsByTypes(lotConfig.lotteryId, issueCount, function (data) {
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            openNumbers = data;
            openNumbers.lot = lot;
            showOpenNumbers();
          }
        }
      }
    });
  };

  /**
   * 显示开奖号码列表
   */
  var showOpenNumbers = function () {
    var ballLastTpl = require('/tpl/number/ball_last');

    $("#lastNo").html(ballLastTpl(openNumbers));

    // 显示下拉按钮
    $(".openArrow").show();
  };

  /**
   * 关闭打开开奖列表
   * @param flag
   */
  var toOpenNumbers = function (flag) {
    if (flag && openNumbers !== null && typeof openNumbers != "undefined" &&
      openNumbers.data !== null && typeof openNumbers.data != "undefined" &&
      openNumbers.data.length > 0) {
      $("#lastNo").css({"height": (1.5 * openNumbers.data.length) + "em"});
    } else {
      $("#lastNo").css({"height": "1.5em"});
    }
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    // 摇一摇
    if (window.DeviceMotionEvent) {
      $(window).off("devicemotion").
        on("devicemotion", function (eventData) {
          if (lotConfig.modes.list[mode].rdm) {
            util.deviceMotionHandler(eventData, showRdmNo);
          }
        });
    }

    // 返回
    $(document).off(events.touchStart(), ".back").
      on(events.touchStart(), ".back", function (e) {
        events.handleTapEvent(this, this, events.activate(), e);
        return true;
      });

    $(document).off(events.activate(), ".back").
      on(events.activate(), ".back", function (e) {
        page.init("home", {}, 0);
        return true;
      });

    // 下拉箭头
    $(document).off(events.touchStart(), ".openArrow").
      on(events.touchStart(), ".openArrow", function (e) {
        events.handleTapEvent(this, this, events.activate(), e);
        return true;
      });

    $(document).off(events.activate(), ".openArrow").
      on(events.activate(), ".openArrow", function (e) {
        if ($(this).hasClass("down")) {
          $(this).removeClass("down").addClass("up").html("&#xf060;");
          toOpenNumbers(1);
        } else {
          $(this).removeClass("up").addClass("down").html("&#xf003;");
          toOpenNumbers(0);
        }
        return true;
      });

    // 获取期号
    $(document).off(events.tap(), "#issueNo").
      on(events.tap(), "#issueNo", function (e) {
        // 获取期号信息
        getIssue();
        return true;
      });

    // 模式
    $(document).off(events.touchStart(), ".caList").
      on(events.touchStart(), ".caList", function (e) {
        events.handleTapEvent(this, this, events.activate(), e);
        return true;
      });

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
    $(document).off(events.touchStart(), ".pr0").
      on(events.touchStart(), ".pr0", function (e) {
        events.handleTapEvent(this, this, events.activate(), e);
        return true;
      });

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
            case "hm_menu":
              // 去合买
              break;
            case "gc_menu":
              // 购彩记录
              break;
            case "kj_menu":
              // 开奖信息
              util.hideCover();
              page.init("number/openLott", {lot: lot}, 1);
              break;
            case "wf_menu":
              util.hideCover();
              page.init(lotConfig.paths["intro"].js, {lot: lot}, 1);
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
          showModeZone();

          // 清除原来选中号
          clear();

          // 统计注数
          unitBets();
        }
        return true;
      });

    // 机选一注
    $(document).off(events.touchStart(), ".gmButton").
      on(events.touchStart(), ".gmButton", function (e) {
        events.handleTapEvent(this, this, events.activate(), e);
        return true;
      });

    $(document).off(events.activate(), ".gmButton").
      on(events.activate(), ".gmButton", function (e) {
        showRdmNo();
        return true;
      });

    // 第一行
    $(document).off(events.tap(), "#line_0").
      on(events.tap(), "#line_0", function (e) {
        var $num = $(e.target).closest(".num");

        if ($num.length) {
          if ($num.hasClass("click")) {
            $num.removeClass("click");
          } else {
            var count = $("#line_0 .click").length;
            if (parseInt(mode, 10) > 2) {
              // 胆拖
              switch (mode) {
                case "3": // 直选胆拖
                case "5": // 组六胆拖
                  if (count == 2) {
                    page.toast("所选号码已经达到最大限制");
                    return false;
                  }
                  break;
                case "4": // 组三胆拖
                  if (count == 1) {
                    page.toast("所选号码已经达到最大限制");
                    return false;
                  }
                  break;
              }
              // 移除拖红选中
              $("#line_1 li .num :contains('" + $num.text() + "')").removeClass("click");
            }
            $num.addClass("click");
          }
          // 统计注数
          unitBets();
        }
        return true;
      });

    // 第二行
    $(document).off(events.tap(), "#line_1").
      on(events.tap(), "#line_1", function (e) {
        var $num = $(e.target).closest(".num");

        if ($num.length) {
          if ($num.hasClass("click")) {
            $num.removeClass("click");
          } else {
            $num.addClass("click");

            if (parseInt(mode, 10) > 2) {
              // 胆拖
              // 移除胆红选中
              $("#line_0 li .num :contains('" + $num.text() + "')").removeClass("click");
            }
          }
          // 统计注数
          unitBets();
        }
        return true;
      });

    // 第三行
    $(document).off(events.tap(), "#line_2").
      on(events.tap(), "#line_2", function (e) {
        var $num = $(e.target).closest(".num");

        if ($num.hasClass("click")) {
          $num.removeClass("click");
        } else if ($num.length) {
          $num.addClass("click");
        }
        // 统计注数
        unitBets();
        return true;
      });

    // footer
    $(document).off(events.click(), "footer").
      on(events.click(), "footer", function (e) {
        var $a = $(e.target).closest("a");
        if ($a.length) {
          if ($a.hasClass("fr")) {
            // 确定
            toList();
          } else if ($a.hasClass("fl")) {
            // 清除
            clear();
            // 统计注数
            unitBets();
          }
        }
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

    if (typeof issue.issueNo == "undefined" && bufferData.length === 0) {
      page.toast("无法获取到彩票期号");
      return false;
    }

    if (bets > 0) {

      // 保存双色球数据
      var data = {};
      // 投注模式
      data.mode = mode;
      data.bets = bets;
      // 第一行
      data.arr0 = [];
      $("#line_0 .click").each(function (i, item) {
        data.arr0.push($(item).text());
      });

      // 第二行
      data.arr1 = [];
      $("#line_1 .click").each(function (i, item) {
        data.arr1.push($(item).text());
      });

      // 第三行
      data.arr2 = [];
      $("#line_2 .click").each(function (i, item) {
        data.arr2.push($(item).text());
      });

      bufferData.push(data);
    } else if (bets === 0) {
      var ballCount = $(".bets .click").length;
      if (ballCount) {
        // 再选一注
        page.toast(lotConfig.modes.list[mode].tips);
        return false;
      }
    }

    util.setLocalJson(lotConfig.localKey, bufferData);

    if (bufferData.length === 0) {
      page.toast(lotConfig.modes.list[mode].tips);
      return false;
    }
    page.init(lotConfig.paths["list"].js, {lot: lot}, 1);
    return true;
  };

  /**
   * 清除
   */
  var clear = function () {
    $(".bets .click").removeClass("click");
  };


  /**
   * 显示随机一注
   */
  var showRdmNo = function () {

    // 清空原始的选中
    clear();
    var arr0 = [], arr1 = [], arr2 = [];
    switch (mode) {
      case "0": // 直选
        arr0 = util.getSrand(0, 9, 1);
        arr1 = util.getSrand(0, 9, 1);
        arr2 = util.getSrand(0, 9, 1);
        break;
      case "1": // 组三
        arr0 = util.getSrand(0, 9, 2);
        break;
      case "2": // 组六
        arr0 = util.getSrand(0, 9, 3);
        break;
    }

    addRedsFocus(arr0, arr1, arr2);

    unitBets();

  };

  /**
   * 行焦点显示
   * @param arr
   */
  var addRedsFocus = function (arr0, arr1, arr2) {
    for (var i = 0; i < arr0.length; i++) {
      $("#line_0 li .num :contains('" + arr0[i] + "')").addClass("click");
    }

    for (var j = 0; j < arr1.length; j++) {
      $("#line_1 li .num :contains('" + arr1[j] + "')").addClass("click");
    }

    for (var k = 0; k < arr2.length; k++) {
      $("#line_2 li .num :contains('" + arr2[k] + "')").addClass("click");
    }
  };

  /**
   * 统计注数，消费金额
   */
  var unitBets = function () {
    bets = 0;
    var amount = 0;

    switch (mode) {
      case "0": // 直选
        var line0Count = $("#line_0 .click").length,
          line1Count = $("#line_1 .click").length,
          line2Count = $("#line_2 .click").length;
        bets = line0Count * line1Count * line2Count;
        break;
      case "1": // 组三
        var line0Count = $("#line_0 .click").length;
        if (line0Count >= 2) {
          bets = util.getFactorial(line0Count, 2) * 2;
        }
        break;
      case "2": // 组六
        var line0Count = $("#line_0 .click").length;
        if (line0Count >= 3) {
          bets = util.getFactorial(line0Count, 3);
        }
        break;
      case "3": // 直选胆拖
        var line0Count = $("#line_0 .click").length,
          line1Count = $("#line_1 .click").length;
        if (line0Count >= 1 && line0Count <= 2 && line1Count >= 1) {
          bets = util.getCombineCount(3 - line0Count, line1Count) * 6;
        }
        break;
      case "4": // 组三胆拖
        var line0Count = $("#line_0 .click").length,
          line1Count = $("#line_1 .click").length;
        if (line0Count == 1 && line1Count >= 1) {
          bets = line1Count * 2;
        }
        break;
      case "5": // 组六胆拖
        var line0Count = $("#line_0 .click").length,
          line1Count = $("#line_1 .click").length;
        if (line0Count >= 1 && line0Count <= 2 && line1Count >= 1) {
          bets = util.getCombineCount(3 - line0Count, line1Count);
        }
        break;
    }

    amount = bets * 2;
    $("#bets").text(bets);
    $("#amount").text(amount);
  };

  return {init: init};
});