/**
 * 双色球选号
 */
define(function (require, exports, module) {
  var page = require('page'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    config = require('config'),
    digitService = require('services/digit');
  var canBack = 1;
  // 标示符
  var lot = "ssq";
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
  // 登录标示
  var tkn = "";
  /**
   * 初始化
   */
  var init = function (data, forward) {
    canBack = forward || 0;

    // 参数设置
    var params = {};
    tkn = util.checkLogin(data);
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
      "#" + lotConfig.paths["ball"].js + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
      canBack);
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
    var request = digitService.getHistoryAwardsByTypes(lotConfig.lotteryId, issueCount, function (data) {
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

    util.addAjaxRequest(request);
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
      $("#lastNo").css({"height": (1.8 * openNumbers.data.length) + "em"});
    } else {
      $("#lastNo").css({"height": "1.8em"});
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
    $(".back").on("click", function (e) {
      page.init("home", {}, 0);
      return true;
    });

    // 下拉箭头
    $(".openArrow, #lastNo").on("click", function (e) {
      var $openArrow = $(".openArrow");
      if ($openArrow.hasClass("down")) {
        $openArrow.removeClass("down").addClass("up").html("&#xf060;");
        toOpenNumbers(1);
      } else {
        $openArrow.removeClass("up").addClass("down").html("&#xf003;");
        toOpenNumbers(0);
      }
      return true;
    });

    // 获取期号
    $("#issueNo").on("click", function (e) {
      // 获取期号信息
      getIssue();
      return true;
    });

    // 模式
    $(".caList").on("click", function (e) {
      if (bufferData !== null && typeof bufferData != "undefined" && bufferData.length > 0) {
        page.toast("本站暂不支持多种玩法混合投注");
      } else {
        $(".menuBox").show();
        util.showCover();
      }
      return true;
    });

    // 右菜单
    $(".pr0").on("click", function (e) {
      $(".popup").show();
      util.showCover();
      return true;
    });

    // 右菜单项点击
    $(".popup").on("click", function (e) {
      var $a = $(e.target).closest("a");
      if (!$a.hasClass("click")) {
        var id = $a.attr("id");
        switch (id) {
          case "hm_menu":
            // 去合买
            page.init("hm/index", {lotteryTypeArray: lotConfig.lotteryId}, 1);
            break;
          case "gc_menu":
            if (!tkn) {
              page.codeHandler({statusCode: "off"});
            } else {
              // 购彩记录
              page.init("user/buyRecord", {lotteryTypeArray: lotConfig.lotteryId}, 1);
            }
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
    $(".cover").off("click").on("click", function (e) {
      $(".popup").hide();
      $(".menuBox").hide();
      util.hideCover();
      return true;
    });

    // 选中模式
    $(".menuBox").on("click", function (e) {
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
    $(".gmButton").on("click", function (e) {
      showRdmNo();
      return true;
    });

    // 第一行
    $("#line_0").on("click", function (e) {
      var $num = $(e.target).closest(".num");

      if ($num.length) {
        if ($num.hasClass("click")) {
          $num.removeClass("click");
        } else {
          var count = $("#line_0 .click").length;
          if (mode === "0") {
            // 普通投注
            // 只能选20个红球
            if (count == 20) {
              page.toast("所选号码已经达到最大限制");
              return false;
            }
          } else if (mode === "1") {
            // 胆拖投注
            // 只能选5个胆红
            if (count == 5) {
              page.toast("所选号码已经达到最大限制");
              return false;
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
    $("#line_1").on("click", function (e) {
      var $num = $(e.target).closest(".num");

      if ($num.length) {
        if ($num.hasClass("click")) {
          $num.removeClass("click");
        } else {
          $num.addClass("click");
          // 移除胆红选中
          $("#line_0 li .num :contains('" + $num.text() + "')").removeClass("click");
        }
        // 统计注数
        unitBets();
      }
      return true;
    });

    // 第三行
    $("#line_2").on("click", function (e) {
      var $num = $(e.target).closest(".num");

      if ($num.length) {
        if ($num.hasClass("click")) {
          $num.removeClass("click");
        } else if ($num.length) {
          $num.addClass("click");
        }
        // 统计注数
        unitBets();
      }
      return true;
    });

    // 确定
    $(".btn2").on("click", function (e) {
      toList();
      return true;
    });

    // 清除
    $(".btn1").on("click", function (e) {
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
      if (data.mode === "1") {
        // 胆红
        data.redsDan = [];
        $("#line_0 .click").each(function (i, item) {
          data.redsDan.push($(item).text());
        });

        // 拖红
        data.redsTuo = [];
        $("#line_1 .click").each(function (i, item) {
          data.redsTuo.push($(item).text());
        });

        // 胆拖蓝
        data.blues = [];
        $("#line_2 .click").each(function (i, item) {
          data.blues.push($(item).text());
        });

      } else {
        // 普通投注
        data.reds = [];
        $("#line_0 .click").each(function (i, item) {
          data.reds.push($(item).text());
        });
        data.blues = [];
        $("#line_2 .click").each(function (i, item) {
          data.blues.push($(item).text());
        });
      }
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
    var reds = util.getSrand(1, 33, 6);
    console.log(reds.toString());
    for (var i = 0, redLen = reds.length; i < redLen; i++) {
      $("#line_0 li .num :contains('" + (reds[i] < 10 ? ("0" + reds[i]) : reds[i]) + "')").addClass("click");
    }
    var blues = util.getSrand(1, 16, 1);
    console.log(blues.toString());

    for (var j = 0, blueLen = blues.length; j < blueLen; j++) {
      $("#line_2 li .num :contains('" + (blues[j] < 10 ? ("0" + blues[j]) : blues[j]) + "')").addClass("click");
    }

    unitBets();

  };

  /**
   * 统计注数，消费金额
   */
  var unitBets = function () {
    bets = 0;
    var amount = 0;
    if (mode === "0") {
      var reds = $("#line_0 .click").length;
      var blues = $("#line_2 .click").length;

      if (reds >= 6 && blues >= 1) {
        bets = util.getFactorial(reds, 6) * blues;
      }
    } else if (mode === "1") {
      var redsDan = $("#line_0 .click").length;
      var redsTuo = $("#line_1 .click").length;
      var dBlues = $("#line_2 .click").length;

      if (redsDan >= 1 && redsTuo >= 1 && redsDan + redsTuo >= 6) {
        bets = util.getCombineCount(6 - redsDan, redsTuo) * dBlues;
      }
    }
    amount = bets * 2;
    $("#bets").text(bets);
    $("#amount").text(amount);
  };

  return {init: init};
});