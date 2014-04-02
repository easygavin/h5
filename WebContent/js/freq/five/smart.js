/**
 * 五球高频彩智能追号
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
  // 期号
  var issue = {};
  // 缓存的数据
  var bufferData = null;
  // 计时秒
  var seconds = 0;
  // 倒计时定时器
  var secondInterval = null;
  // 传递参数
  var opt = {};
  // 预处理参数
  var handleResult = {};
  // 默认值
  var rate = 30;
  var income = 30;
  var type = 1;
  var count = 10;
  // 追号列表
  var items = [];
  // 购买成功后返回的结果集
  var result = {};
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
    require.async(lotConfig.paths["smart"].tpl, function (tpl) {
      $("#container").html(tpl);

      initShow();
      bindEvent();

    });

    // 处理返回
    page.setHistoryState({url: lotConfig.paths["smart"].js, data: params},
      lotConfig.paths["smart"].js,
      (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#" + lotConfig.paths["smart"].js,
      canBack ? 1 : 0);
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    if (canBack) {
      rate = 30, income = 30, type = 1, count = 10;
    }

    // 显示title信息
    showTitle();

    // 获取期号
    issue = {};
    getIssue();
  };

  /**
   * 显示title信息
   */
  var showTitle = function () {
    $(".title").text(lotConfig.name);
  };

  /**
   * 获取期号
   */
  var getIssue = function () {
    $("#issueNo").text("获取期号中...");
    var request = digitService.getCurrLottery(lotConfig.lotteryId, function (data) {

      // 隐藏加载标示
      util.hideLoading();
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode === "0") {
            if (typeof issue.issueNo != "undefined") {
              page.dialog(
                issue.issueNo + "期已截止",
                "起始期已经更新为" + data.issueNo + "期,请核对期号",
                "确定",
                function (e) {
                }
              );
            }
            issue = data;
            handleIssue();

            // 获取智能追号检查结果
            getSmartOpt();

            // 获取智能追号列表
            getSmartList();
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

    if (issue.endTime != null && typeof issue.endTime != "undefined"
      && $.trim(issue.endTime) != "") {
      var endDate = new Date(issue.endTime);
      console.log("endDate:" + endDate.getTime());
      var serverDate = new Date(issue.serverTime);
      console.log("serverDate:" + serverDate.getTime());
      seconds = (endDate.getTime() - serverDate.getTime()) / 1000;
      console.log("seconds:" + seconds);

      // 倒计时
      clearInterval(secondInterval);
      util.clearIntervals();
      secondInterval = setInterval(function () {
        if (seconds > 0) {
          seconds--;
          showIssue();
        } else {
          clearInterval(secondInterval);
          util.clearIntervals();
          // 重新拉取期号信息
          getIssue();
        }
      }, 1000);
      util.addInterval(secondInterval);
    }
  };

  /**
   * 显示期号，倒计时
   */
  var showIssue = function () {
    var minute = Math.floor(seconds / 60);
    var second = seconds % 60;
    var issueTxt = "距第" + issue.issueNo.substring(8) + "期截止:" + minute + ":" +
      ( second < 10 ? "0" + second : second );
    $("#issueNo").text(issueTxt);
  };

  /**
   * 获取智能追号参数
   */
  var getSmartOpt = function () {
    opt = util.getLocalJson(util.keyMap.LOCAL_FIVE_SMART);
    opt.issueNo = issue.issueNo;
  };

  /**
   * 获取智能追号列表
   */
  var getSmartList = function () {
    opt.count = count;
    console.log("opt:" + JSON.stringify(opt));
    // 检查返回结果
    handleResult = digitService.beforeHandler(opt);

    if (typeof handleResult.startIssue == "undefined") {
      page.toast("你太贪心哦，人家满足不了你呢");
      return false;
    }

    handleResult.rate = rate;
    handleResult.income = income;
    handleResult.type = type;
    handleResult.count = count;

    console.log("handleResult:" + JSON.stringify(handleResult));

    items = digitService.getAppendList(handleResult);
    showPayInfo();
    showItems();
  };

  /**
   * 显示消费信息
   * @param items
   */
  var showPayInfo = function () {
    var issueCount = 0, amount = 0;
    if (items.length) {
      issueCount = items.length;
      amount = items[issueCount - 1].totalPay;
    }

    $(".issueShow").text(issueCount);
    $(".amountShow").text(amount);
  };

  /**
   * 显示智能追号列表
   */
  var showItems = function () {
    var smartTpl = require('/tpl/freq/five/smart');

    $(".line30 tbody").html(smartTpl({items: items}));
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

    // 获取期号
    $(document).off(events.tap(), "#issueNo").
      on(events.tap(), "#issueNo", function (e) {
        // 获取期号信息
        getIssue();
        return true;
      });

    // 加倍
    $(document).off("keyup", ".line30 input").
      on("keyup", ".line30 input",function (e) {
        var valObj = checkTimesVal(this);
        var times = parseInt(valObj.times, 10);
        if (times != items[valObj.index].muls) {
          items[valObj.index].muls = times;
          // 重置倍数后更新数据
          toResetTimes(valObj);
        }
        return true;
      }).off("blur", ".line30 input")
      .on("blur", ".line30 input", function (e) {
        var valObj = checkTimesVal(this);
        var times = parseInt(valObj.times, 10);
        if (times != items[valObj.index].muls) {
          items[valObj.index].muls = times;
          // 重置倍数后更新数据
          toResetTimes(valObj);
        }
        return true;
      });

    // 追期数
    $(document).off("keyup", "#issueInput").
      on("keyup", "#issueInput",function (e) {
        this.value = this.value.replace(/\D/g, '');
        var $issueInput = $(this);
        count = $issueInput.val();

        if ($.trim(count) == "") {
          count = 0;
        } else {
          if ($.trim(count) != "" && (isNaN(count) || count < 1)) {
            count = 10;
            $issueInput.val(count);
          } else if (count > handleResult.leave) {
            util.toast("离截止还剩" + handleResult.leave + "期可追");
            count = handleResult.leave;
            $issueInput.val(count);
          }
        }

        return true;
      }).off("blur", "#issueInput")
      .on("blur", "#issueInput", function (e) {
        this.value = this.value.replace(/\D/g, '');
        var $issueInput = $(this);
        count = $issueInput.val();

        if ($.trim(count) == "" || isNaN(count) || count < 1) {
          count = 10;
          $issueInput.val(count);
        }
      });

    // 最小盈利率
    $(document).off("keyup", "#minRate").
      on("keyup", "#minRate",function (e) {
        this.value = this.value.replace(/\D/g, '');
        var $minRate = $(this);
        rate = $minRate.val();

        if ($.trim(rate) == "") {
          rate = 0;
        } else {
          if ($.trim(rate) != "" && (isNaN(rate) || rate < 1)) {
            rate = 30;
            $minRate.val(rate);
          } else if (rate > 1000) {
            rate = 999;
            $minRate.val(rate);
          }
        }

        return true;
      }).on("blur", function (e) {
        this.value = this.value.replace(/\D/g, '');
        var $minRate = $(this);
        rate = $minRate.val();

        if ($.trim(rate) == "" || isNaN(rate) || rate < 1) {
          rate = 30;
          $minRate.val(rate);
        }
      });

    // 最小盈利金额
    $(document).off("keyup", "#minIncome").
      on("keyup", "#minIncome",function (e) {
        this.value = this.value.replace(/\D/g, '');
        var $minIncome = $(this);
        income = $minIncome.val();

        if ($.trim(income) == "") {
          income = 0;
        } else {
          if ($.trim(income) != "" && (isNaN(income) || income < 1)) {
            income = 30;
            $minIncome.val(income);
          }
        }
        return true;
      }).on("blur", function (e) {
        this.value = this.value.replace(/\D/g, '');
        var $minIncome = $(this);
        income = $minIncome.val();

        if ($.trim(income) == "" || isNaN(income) || income < 1) {
          income = 30;
          $minIncome.val(income);
        }
      });

    // footer
    $(document).off(events.click(), "footer").
      on(events.click(), "footer", function (e) {
        var $a = $(e.target).closest("a");
        if ($a.length) {
          if ($a.hasClass("fr")) {
            // 购买
            toBuy();
          } else if ($a.hasClass("fl")) {
            if ($(".smartModBox").is(":visible")) {
              // 收起
              hideModBox();
            } else {
              // 设置
              showModBox();
            }
          }
        }
        return true;
      });
  };

  /**
   * 购买付款
   */
  var toBuy = function () {
    if (items == null || typeof items == "undefined" || items.length == 0) {
      return false;
    }
    // 参数设置
    var params = {};

    // 开始期号
    params.issueNo = issue.issueNo; // 期号
    params.lotteryType = lotConfig.lotteryId; //彩种

    // 内容
    var content = "[" + lotConfig.modes.list[opt.mode].ctxKey + "]" + opt.content;
    params.content = content.replace(/[ ]/g, "");

    // 大乐透专用，0不追加，1追加
    params.addtionSupper = "0";

    // 购买当期的详细信息
    var details = [], totalBet = 0;
    for (var i = 0, len = items.length; i < len; i++) {
      var detail = {
        amount: items[i].pay + "", // 当期金额
        muls: items[i].muls + "", // 当期倍数
        bets: opt.bet + "", // 当期注数
        issueNo: items[i].issueNo // 当期期号
      };
      totalBet += items[i].muls;
      details.push(detail);
    }

    params.detail = details;
    params.bets = opt.bet + ""; // 总注数
    params.totalIssue = opt.count + ""; // 总期数
    params.totalBet = totalBet + ""; // 总倍数
    params.stopBetting = $("#stopBetting").attr("checked") ? "1" : "0"; // 中奖后停止追号 0不停止，1停止
    params.btzh = "1"; // 高频彩，是否是倍投计算器
    params.stopCondition = "0";  // 停止追号条件

    var modeItem = lotConfig.modes.list[opt.mode];
    // 玩法类型 1 直选， 2 复式, 5 胆拖
    params.playType = modeItem.playType;
    params.betType = modeItem.betType; // 投注类型 1 直选

    // 显示遮住层
    util.showCover();
    util.showLoading();

    // 请求接口
    var request = digitService.toBuy(lotConfig.lotteryId, "1", params, opt.price, function (data) {

      // 隐藏遮住层
      util.hideCover();
      util.hideLoading();

      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            result = data;
            page.answer(
              lotConfig.name + "第 " + issue.issueNo + " 期投注成功",
              "编号:" + data.lotteryNo + "<br>" + "账号余额:" + data.userBalance + " 元",
              "查看方案",
              "确定",
              function (e) {
                page.init("number/detail", {lotteryType: lotConfig.lotteryId, requestType: "0", projectId: result.projectId, step: -2}, 0);
              },
              function (e) {
                page.go(-2);
              }
            );
            // 删除选号记录
            util.clearLocalData(lotConfig.localKey);
            util.clearLocalData(util.keyMap.LOCAL_FIVE_SMART);

          } else {
            page.codeHandler(data);
          }
        } else {
          page.toast("投注失败");
        }
      } else {
        page.toast("投注失败");
      }
    });

    util.addAjaxRequest(request);
  };

  /**
   * 检查加倍的合法性
   */
  var checkTimesVal = function (obj) {
    obj.value = obj.value.replace(/\D/g, '');
    var $times = $(obj);
    var index = parseInt($times.attr("id").split("_")[1], 10);
    var times = $times.val();

    if ($.trim(times) == "") {
      times = items[index].muls;
    } else {
      if ($.trim(times) != "" && (isNaN(times) || times < 1)) {
        times = items[index].muls;
        $times.val(times);
      } else if (times > 9999) {
        page.toast("亲，最多只能投9999倍哦");
        times = 9999;
        $times.val(9999);
      }
    }

    return {index: index, times: times};
  };

  /**
   * 重置倍数后更新数据
   * @param valObj
   */
  var toResetTimes = function (valObj) {
    items = digitService.calcPayIncome(items, handleResult);
    $(".line30 tbody tr").each(function (i, item) {
      if (i >= valObj.index) {
        $(item).find("td").each(function (j, td) {
          switch (j) {
            case 2: // 投入
              $(td).text(items[i].totalPay);
              break;
            case 3: // 盈利
              $(td).text(items[i].maxIncome > 0 ? items[i].minIncome + "~" + items[i].maxIncome : items[i].minIncome);
              break;
            case 4: // 盈利率
              $(td).text(items[i].maxRate > 0 ? items[i].minRate.toFixed(2) + "%~" + items[i].maxRate.toFixed(2) + "%" : items[i].minRate.toFixed(2) + "%");
              break;
          }
        });
      }
    });
  };

  /**
   * 显示修改条件
   */
  var showModBox = function () {
    $(".smartModBox").show();
    $("footer .fl").text("收起");
    // 显示参数值
    // 追期数
    $("#issueUnit").val(handleResult.count);
    count = handleResult.count;
    //计算方式 1：盈利率，2：盈利金额
    if (handleResult.type == 2) {
      $("#incomeMode").attr({"checked": true});
      type = 2;
    } else {
      $("#rateMode").attr({"checked": true});
      type = 1;
    }
    // 盈利率
    $("#minRate").val(handleResult.rate);
    rate = handleResult.rate;
    // 盈利金额
    $("#minIncome").val(handleResult.income);
    income = handleResult.income;
  };

  /**
   * 隐藏修改条件
   */
  var hideModBox = function () {
    $(".smartModBox").hide();
    $("footer .fl").text("设置");
    var needCal = false;
    // 追期数
    count = parseInt(count, 10);
    if (handleResult.count != count) {
      needCal = true;
    }

    //计算方式 1：盈利率，2：盈利金额
    type = $('input[name="calMode"]:checked').val() == "2" ? 2 : 1;
    if (handleResult.type != type) {
      needCal = true;
    }

    // 盈利率
    rate = parseInt(rate, 10);
    if (handleResult.rate != rate) {
      needCal = true;
    }

    // 盈利金额
    income = parseInt(income, 10);
    if (handleResult.income != income) {
      needCal = true;
    }

    if (needCal) {
      // 获取智能追号列表
      getSmartList();
    }
  };
  return {init: init};
});