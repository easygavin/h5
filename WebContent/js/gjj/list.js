/**
 * 冠军竞猜列表
 */
define(function (require, exports, module) {
  var page = require('page'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    config = require('config'),
    template = require("../../views/gjj/list.html"),
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

  // 单价
  var price = 2;

  // 购买成功后返回的结果集
  var result = {};

  // 倍数
  var timesInput = 1;

  // SP值排序后的赛事列表
  var matchList = [];

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
    page.setHistoryState({url: "gjj/list", data: params},
      "gjj/list",
      "#gjj/list" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
      canBack);

    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    if (canBack) {
      timesInput = 1;
    } else {
      $("#timesInput").val(timesInput);
    }

    // 显示投注列表
    showItems();

    // 显示title信息
    showTitle();

    // 显示截止时间
    showEndTime();
  };

  /**
   * 显示title信息
   */
  var showTitle = function () {
    $(".title").text(lotConfig.modes.list[mode].name);
  };

  /**
   * 显示投注列表
   */
  var showItems = function () {
    bets = 0;
    result = {};
    $(".line30 tbody").empty();
    // 获取本地数据
    bufferData = operateToLocal(2);

    if (bufferData != null && typeof bufferData != "undefined"
      && bufferData.matchBetList != null && typeof bufferData.matchBetList != "undefined"
      && bufferData.matchBetList.length) {
      bets = bufferData.bets;
      mode = bufferData.mode;
      var matchBetList = bufferData.matchBetList;
      for (var i = 0, len = matchBetList.length; i < len; i++) {
        addItem(i, matchBetList[i]);
      }

      // 重新排序赛事列表
      resetMatchSort();
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
    var $tr = $("<tr></tr>");
    $tr.attr("id", "m_" + item.gameId);

    item.times = timesInput;
    matchMap[item.gameId] = item;


    // 编号
    $tr.append($("<td></td>").html("编号<br>" + (item.gameId.length == 1 ? "0" + item.gameId : item.gameId)));
    // 队名
    $tr.append($("<td></td>").html(item.team));
    $tr.append($("<td></td>").html("冠军"));
    // 奖金
    $tr.append($("<td class='matchSp'></td>").html("奖金<br>" + (parseFloat(item.sp) * timesInput * price) + "元"));

    $(".line30 tbody").append($tr);
  };


  /**
   * 付款信息
   */
  var showPayInfo = function () {
    // 倍数
    $(".timesShow").text(timesInput);

    // 重置倍数
    _.each(matchMap, function (m) {
      matchMap[m.gameId].times = timesInput;
      var bonus = parseFloat(matchMap[m.gameId].sp) * matchMap[m.gameId].times * price;
      // 显示赛事奖金
      showMatchBonus(m.gameId, bonus);
    });

    // 注数
    $(".betsShow").text(bets);

    var account = bets * price * timesInput;

    // 总付款
    $(".amountShow").text(account);
  };

  /**
   * 显示赛事奖金
   * @param gameId
   * @param bonus
   */
  var showMatchBonus = function (gameId, bonus) {
    $("#m_" + gameId).find(".matchSp").html("奖金<br>" + bonus.toFixed(2));
  };

  /**
   * 显示截止时间
   */
  var showEndTime = function () {
    var issueTxt = "截止时间:" + lotConfig.modes.list[mode].endTime;
    $("#issueNo").text(issueTxt);
  };

  /**
   * 重新排序赛事列表
   */
  var resetMatchSort = function () {
    matchList = bufferData.matchBetList.sort(function (a, b) {
      return parseFloat(a.sp) > parseFloat(b.sp) ? 1 : -1;
    });
  };

  /**
   * 平均优化
   */
  var setAvgBonus = function () {
    var list = gjjService.setAvgBonus(matchList, bets * timesInput, 10000);
    if (list.length) {
      matchList = list;
      for (var i = 0, len = matchList.length; i < len; i++) {
        var m = matchList[i];
        matchMap[m.gameId].times = m.times;
        var bonus = parseFloat(matchMap[m.gameId].sp) * matchMap[m.gameId].times * price;
        // 显示赛事奖金
        showMatchBonus(m.gameId, bonus);
      }
    } else {
      page.toast("平均优化单注不能超过10000倍!");
    }
  };
  /**
   * 绑定事件
   */
  var bindEvent = function () {

    // 返回
    $(".back").on("click", function (e) {
      page.goBack();
      return true;
    });

    // 加倍
    $("#timesInput").on("keyup",function (e) {
      this.value = this.value.replace(/\D/g, '');
      var $timesInput = $(this);
      timesInput = $timesInput.val();

      if ($.trim(timesInput) == "") {
        timesInput = 0;
      } else {
        if ($.trim(timesInput) != "" && (isNaN(timesInput) || timesInput < 1)) {
          timesInput = 1;
          $timesInput.val(1);
        } else if (timesInput > 10000) {
          page.toast("亲，最多只能投10000倍哦");
          timesInput = 10000;
          $timesInput.val(10000);
        }
      }

      // 显示付款信息
      showPayInfo();
      return true;
    }).on("blur", function (e) {
        this.value = this.value.replace(/\D/g, '');

      });

    // 平均优化
    $("#avgSet").on("click", function (e) {
      if (bets * price * timesInput < 20) {
        page.toast("计划购买金额至少20元!");
        return false;
      }
      setAvgBonus();
      return true;
    });

    // 移除cover的click事件，防止重复提交订单
    $(".cover").off("click");

    // 购买
    $(".btn2").on("click", function (e) {

      // 检查值
      if (checkVal()) {
        // 购买
        toBuy();
      }
      return true;
    });

    // 购彩协议
    $(".checked").on("click", function (e) {
      page.init("protocol", {}, 1);
      return true;
    });
  };

  /**
   * 检查有效值
   */
  var checkVal = function () {

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
    if (!$("#protocol").prop("checked")) {
      page.toast("请勾选同意合买代购协议!");
      return false;
    }
    var params = getBuyParams();

    // 显示遮住层
    util.showCover();
    util.showLoading();

    // 请求接口
    var request = gjjService.toBuy(params, function (data) {
      handleBuyResult(data);
    });

    util.addAjaxRequest(request);

  };

  /**
   * 处理购买结果
   */
  var handleBuyResult = function (data) {
    // 隐藏遮住层
    util.hideCover();
    util.hideLoading();

    if (typeof data != "undefined") {
      if (typeof data.statusCode != "undefined") {
        if (data.statusCode == "0") {
          result = data;
          page.answer(
            lotConfig.modes.list[mode].name + "冠军竞猜投注成功",
            "认购金额:" + (bets * price * timesInput) + "元<br>" + "账号余额:" + data.userBalance + " 元",
            "查看方案",
            "确定",
            function (e) {
              page.init("gjj/detail", {projectno: result.projectNo}, 0);
            },
            function (e) {
              page.goBack();
            }
          );
          // 删除本地数据
          operateToLocal(3);

        } else {
          page.codeHandler(data);
        }
      } else {
        page.toast("投注失败");
      }
    } else {
      page.toast("投注失败");
    }
  };

  /**
   * 获取购买参数
   * @returns {{}}
   */
  var getBuyParams = function () {
    var project = {};
    var matchBetList = bufferData.matchBetList;
    // buysp, content, matchids
    var buySpArr = [], contentArr = [], matchidsArr = [];
    _.each(matchBetList, function (m) {
      var buySp = m.issueNo + m.event + m.gameId + ":" + m.sp + "|" + matchMap[m.gameId].times;
      // 3: 胜
      var content = m.issueNo + m.event + m.gameId + ":3";
      var matchids = m.issueNo + m.event + m.gameId;

      buySpArr.push(buySp);
      contentArr.push(content);
      matchidsArr.push(matchids);
    });

    project.buysp = buySpArr.join("/");
    project.content = contentArr.join("/");
    project.matchids = matchidsArr.join(",");

    project.promul = (bets * timesInput) + "";
    project.projectbets = bets + "";
    project.openstatus = "4";
    project.lotteryid = "50";
    project.totalcount = "1";
    project.projecttype = "0";
    project.totalamount = (bets * price * timesInput) + "";

    return project;
  };

  /**
   * 本地保存
   */
  var operateToLocal = function (opt) {
    switch (opt) {
      case 1: // 保存
        util.setLocalJson(lotConfig.localKey, bufferData);
        return true;
        break;
      case 2: // 获取
        return util.getLocalJson(lotConfig.localKey);
        break;
      case 3: // 清空
        util.clearLocalData(lotConfig.localKey);
        return true;
        break;
    }
  };
  return {init: init};
});