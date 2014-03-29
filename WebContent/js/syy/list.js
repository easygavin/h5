/**
 * 十一运夺金列表
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    template = require('../../views/syy/list.html'),
    config = require('config'),
    digitService = require('services/digit');
  var canBack = 1;
  // 标示符
  var lot = "syy";

  // 彩种配置
  var lotConfig = {};

  // 初始化显示模式
  var mode = "4";

  // 期号
  var issue = {};

  // 缓存的数据
  var bufferData = null;

  // 注数
  var bets = 0;

  // 单价
  var price = 2;

  // 购买成功后返回的结果集
  var result = {};

  // 追期数
  var issueInput = 1;

  // 倍数
  var timesInput = 1;

  // 计时秒
  var seconds = 0;

  // 倒计时定时器
  var secondInterval = null;

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

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: lot + "/list", data: params},
      lot + "/list",
      (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#" + lot + "/list",
      canBack ? 1 : 0);
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    // 彩种配置
    lotConfig = config.lotteryMap[lot];

    $("#container").html(template);

    if (canBack) {
      issueInput = 1, timesInput = 1;
    } else {
      $("#issueInput").val(issueInput);
      $("#timesInput").val(timesInput);
    }

    // 显示投注列表
    showItems();

    // 随机按钮的显示
    showRandomBtn();

    // 获取期号
    getIssue();
  };

  /**
   * 显示投注列表
   */
  var showItems = function () {
    bets = 0;
    result = {};
    $(".line30 tbody").empty();
    // 显示投注列表
    bufferData = util.getLocalJson(util.keyMap.LOCAL_SYY);

    if (bufferData !== null && typeof bufferData != "undefined" && bufferData.length > 0) {
      mode = bufferData[0].mode;
      for (var i = 0, len = bufferData.length; i < len; i++) {
        addItem(i, bufferData[i]);
        bets = bets + bufferData[i].bets;
      }
    }

    // 显示付款信息
    showPayInfo();
  };

  /**
   * 添加一项数据
   * @param index
   * @param item
   */
  var addItem = function (index, item) {
    var text = "";
    var $tr = $("<tr></tr>");
    text += "<span class='cdd1049'>";
    if (item.arr0.length) {
      text += item.arr0.toString();
    }
    if (item.arr1.length) {
      text += ";" + item.arr1.toString();
    }
    if (item.arr2.length) {
      text += ";" + item.arr2.toString();
    }
    text += "</span>";

    $tr.append($("<td></td>").html("<p>" + text + "</p>"));
    $tr.append($("<td></td>").html(item.bets + "注"));
    $tr.append($("<td></td>").html("<a class='delete' id='del_" + index + "'>&times;</a>"));

    $(".line30 tbody").append($tr);
  };


  /**
   * 付款信息
   */
  var showPayInfo = function () {
    // 追期
    $(".issueShow").text(issueInput);

    // 倍数
    $(".timesShow").text(timesInput);

    // 注数
    $(".betsShow").text(bets);

    var account = bets * price * issueInput * timesInput;

    // 总付款
    $(".amountShow").text(account);
  };

  /**
   * 随机按钮的显示
   */
  var showRandomBtn = function () {
    if (lotConfig.modes.list[mode].rdm) {
      $(".gmchose").show();
    } else {
      $(".gmchose").hide();
    }
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
          page.dialog(
            "",
            issue.issueNo + "期已截止",
            "确定",
            function (e) {
            }
          );

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

    // 删除
    $(document).off(events.tap(), ".gmList").
      on(events.tap(), ".gmList", function (e) {
        var $target = $(e.target);
        if ($target.hasClass("delete")) {
          // 删除
          var index = parseInt($target.attr("id").split("_")[1], 10);
          if (bufferData !== null && typeof bufferData != "undefined"
            && bufferData.length > 0 && !isNaN(index)) {

            bufferData.splice(index, 1);
            util.setLocalJson(util.keyMap.LOCAL_SYY, bufferData);

            // 显示投注列表
            showItems();
          }
        }
        return true;
      });

    // 追期
    $(document).off("keyup", "#issueInput").
      on("keyup", "#issueInput",function (e) {
        this.value = this.value.replace(/\D/g, '');
        var $issueInput = $(this);
        issueInput = $issueInput.val();

        if ($.trim(issueInput) == "") {
          issueInput = 0;
        } else {
          if ($.trim(issueInput) != "" && (isNaN(issueInput) || issueInput < 1)) {
            issueInput = 1;
            $issueInput.val(1);
          } else if (issueInput > 50) {
            page.toast("亲，最多只能追50期哦");
            issueInput = 50;
            $issueInput.val(50);
          }
        }

        // 显示付款信息
        showPayInfo();
        return true;
      }).off("blur", "#issueInput")
      .on("blur", "#issueInput", function (e) {
        this.value = this.value.replace(/\D/g, '');
        // 显示付款信息
        showPayInfo();
      });

    // 加倍
    $(document).off("keyup", "#timesInput").
      on("keyup", "#timesInput",function (e) {
        this.value = this.value.replace(/\D/g, '');
        var $timesInput = $(this);
        timesInput = $timesInput.val();

        if ($.trim(timesInput) == "") {
          timesInput = 0;
        } else {
          if ($.trim(timesInput) != "" && (isNaN(timesInput) || timesInput < 1)) {
            timesInput = 1;
            $timesInput.val(1);
          } else if (timesInput > 9999) {
            page.toast("亲，最多只能投9999倍哦");
            timesInput = 9999;
            $timesInput.val(9999);
          }
        }

        // 显示付款信息
        showPayInfo();
        return true;
      }).off("blur", "#timesInput")
      .on("blur", "#timesInput", function (e) {
        this.value = this.value.replace(/\D/g, '');
        // 显示付款信息
        showPayInfo();
      });

    // 机选一注
    $(document).off(events.tap(), "#random0").
      on(events.tap(), "#random0", function (e) {
        $(".gmchose a").removeClass("click");
        $(this).addClass("click");

        getRandom(1);
        return true;
      });

    // 机选5注
    $(document).off(events.tap(), "#random1").
      on(events.tap(), "#random1", function (e) {
        $(".gmchose a").removeClass("click");
        $(this).addClass("click");

        getRandom(5);
        return true;
      });

    // 全部删除
    $(document).off(events.tap(), "#clearAll").
      on(events.tap(), "#clearAll", function (e) {
        if (bufferData !== null && typeof bufferData != "undefined"
          && bufferData.length > 0) {

          bufferData = [];
          util.setLocalJson(util.keyMap.LOCAL_SYY, bufferData);

          // 显示投注列表
          showItems();
        }
        return true;
      });

    // 移除cover的click事件，防止重复提交订单
    $(".cover").off(events.click());

    // footer
    $(document).off(events.click(), "footer").
      on(events.click(), "footer", function (e) {
        var $a = $(e.target).closest("a");
        if ($a.length) {
          if ($a.hasClass("fr")) {
            // 购买
            if (typeof issue.issueNo == "undefined") {
              page.toast("无法获取到彩票期号");
              return false;
            }

            // 检查值
            if (checkVal()) {
              // 购买
              toBuy();
            }
          } else if ($a.hasClass("fl")) {
            // 发起合买
            if (typeof issue.issueNo == "undefined") {
              page.toast("无法获取到彩票期号");
              return false;
            }

            // 检查值
            if (checkVal()) {
              // 追号

            }
          }
        }
      });
  };

  /**
   * 检查有效值
   */
  var checkVal = function () {
    // 追期
    var $issueInput = $("#issueInput");
    issueInput = $issueInput.val();

    if ($.trim(issueInput) == "" || isNaN(issueInput) || issueInput < 1) {
      issueInput = 0;
      page.toast("请至少选择 1 注");

      // 显示付款信息
      showPayInfo();
      return false;
    }

    // 倍数
    var $timesInput = $("#timesInput");
    timesInput = $timesInput.val();

    if ($.trim(timesInput) == "" || isNaN(timesInput) || timesInput < 1) {
      timesInput = 0;
      page.toast("请至少选择 1 注");

      // 显示付款信息
      showPayInfo();
      return false;
    }

    if (!bets) {
      page.toast("请至少选择 1 注");
      return false;
    }
    return true;
  };

  /**
   * 购买付款
   */
  var toBuy = function () {
    var params = getBuyParams();

    // 显示遮住层
    util.showCover();
    util.showLoading();

    // 请求接口
    var request = digitService.toBuy(lotConfig.lotteryId, "1", params, price, function (data) {

      // 隐藏遮住层
      util.hideCover();
      util.hideLoading();

      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            result = data;
            page.answer(
              lotConfig.name + " 第 " + issue.issueNo + " 期投注成功",
              "编号:" + data.lotteryNo + "<br>" + "账号余额:" + data.userBalance + " 元",
              "查看方案",
              "确定",
              function (e) {
                page.init("digit/detail", {lotteryType: lotConfig.lotteryId, requestType: "0", projectId: result.projectId}, 0);
              },
              function (e) {
                page.goBack();
              }
            );
            // 删除选号记录
            util.clearLocalData(util.keyMap.LOCAL_SYY);

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
   * 进入合买页面
   */
  var toHm = function () {
    var params = getBuyParams();
    params.lot = lot;
    params.mode = mode;
    params.projectCount = bets * price;
    params.eachMoney = 1;

    util.setLocalJson(util.keyMap.LOCAL_TO_HM, params);

    page.init("digit/hm", {}, 1);
  };

  /**
   * 获取购买参数
   * @returns {{}}
   */
  var getBuyParams = function () {
    // 参数设置
    var params = {};
    params.issueNo = issue.issueNo; // 期号
    params.lotteryType = lotConfig.lotteryId; //彩种

    // 内容
    var content = "";
    $(".line30 p").each(function (i, item) {
      if (i > 0) {
        content += "/";
      }
      content += "[" + lotConfig.modes.list[mode].ctxKey + "]" + $(item).text();
    });
    params.content = content.replace(/[ ]/g, "");

    /// 大乐透专用，0不追加，1追加
    params.addtionSupper = "0";

    // 购买当期的详细信息
    var detail = [
      {
        amount: (bets * timesInput * price) + "", // 当期金额
        muls: timesInput + "", // 当期倍数
        bets: bets + "", // 当期注数
        issueNo: issue.issueNo // 当期期号
      }
    ];
    params.detail = detail;
    params.bets = bets + ""; // 总注数
    params.totalIssue = issueInput + ""; // 总期数
    params.totalBet = (timesInput * issueInput) + ""; // 总倍数
    params.stopBetting = $("#stopBetting").attr("checked") ? "1" : "0"; // 中奖后停止追号 0不停止，1停止
    params.btzh = "0"; // 高频彩，是否是倍投计算器
    params.stopCondition = "8";  // 停止追号条件

    var modeItem = lotConfig.modes.list[mode];
    // 玩法类型 2 复式, 5 胆拖
    params.playType = modeItem.playType;
    params.betType = modeItem.betType; // 投注类型 1 直选

    return params;
  };

  /**
   * 机选注数
   * @param bet
   */
  var getRandom = function (bet) {
    for (var i = 0; i < bet; i++) {
      showRdmNo();
    }

    showItems();
  };

  /**
   * 显示随机一注
   */
  var showRdmNo = function () {

    // 缓存的数据
    bufferData = (bufferData === null || typeof bufferData == "undefined" || bufferData.length === 0) ? [] : bufferData;

    // 保存数据
    var data = {};
    // 投注模式
    data.mode = mode;
    data.bets = 1;

    var arr0 = [], arr1 = [], arr2 = [];
    switch (mode) {
      case "0": // 任一
        arr0 = attachZero(util.getSrand(1, 11, 1));
        break;
      case "1": // 任二
        arr0 = attachZero(util.getSrand(1, 11, 2));
        break;
      case "2": // 任三
        arr0 = attachZero(util.getSrand(1, 11, 3));
        break;
      case "3": // 任四
        arr0 = attachZero(util.getSrand(1, 11, 4));
        break;
      case "4": // 任五
        arr0 = attachZero(util.getSrand(1, 11, 5));
        break;
      case "5": // 任六
        arr0 = attachZero(util.getSrand(1, 11, 6));
        break;
      case "6": // 任七
        arr0 = attachZero(util.getSrand(1, 11, 7));
        break;
      case "7": // 任八
        arr0 = attachZero(util.getSrand(1, 11, 8));
        break;
      case "8": // 前三直选
        var randoms = attachZero(util.getSrand(1, 11, 3));
        arr0.push(randoms[0]);
        arr1.push(randoms[1]);
        arr2.push(randoms[2]);
        break;
      case "9": // 前三组选
        arr0 = attachZero(util.getSrand(1, 11, 3));
        break;
      case "10": // 前二直选
        var randoms = attachZero(util.getSrand(1, 11, 2));
        arr0.push(randoms[0]);
        arr1.push(randoms[1]);
        break;
      case "11": // 前二组选
        arr0 = attachZero(util.getSrand(1, 11, 2));
        break;
    }

    data.arr0 = arr0;
    data.arr1 = arr1;
    data.arr2 = arr2;

    bufferData.push(data);
    util.setLocalJson(util.keyMap.LOCAL_SYY, bufferData);

    addItem(bufferData.length - 1, data);

  };

  /**
   * 补0操作
   * @param arr
   */
  var attachZero = function (arr) {
    return _.map(arr, function (num) {
      return num < 10 ? "0" + num : num;
    });
  };

  return {init: init};
});