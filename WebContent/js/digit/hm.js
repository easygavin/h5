/**
 * 数字彩合买
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    template = require("../../views/digit/hm.html"),
    config = require('config'),
    digitService = require('services/digit');
  var canBack = 1;

  // 彩种配置
  var lotConfig = {};
  // 单价
  var price = 2;
  // 合买参数
  var params = {};
  // 认购金额
  var projectBuy = 1;
  // 方案保底份数
  var projectHold = 0;
  // 合买方案提成
  var projectCommissions = "5%";
  // 方案公开方式
  var projectOpenState = "2";
  // 最小购买份数
  var minBuy = 1;
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

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "digit/hm", data: params},
      "digit/hm",
      (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#digit/hm",
      canBack ? 1 : 0);

    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").html(template);

    setDefault();
    showHMDetail();
  };

  /**
   * 设置默认参数
   */
  var setDefault = function () {
    if (canBack) {
      lotConfig = {}, params = {}, projectBuy = 1,
        projectHold = 0, projectCommissions = "5%",
        projectOpenState = "2";
      minBuy = 1;
    }
  };

  /**
   * 显示合买详情
   */
  var showHMDetail = function () {

    params = util.getLocalJson(util.keyMap.LOCAL_TO_HM);

    if (params !== null && typeof params != "undefined") {

      lotConfig = config.lotteryMap[params.lot];

      $(".title").text(lotConfig.name + "合买");

      var playMode = lotConfig.modes.list[params.mode].name;

      $("#projectCount").text(params.projectCount + "元");
      $("#eachMoney").text(params.eachMoney + "元");
      $("#playMode").text(playMode);

      // 预期购买
      var expectBuy = parseInt(params.projectCount, 10) * 0.05;
      if (expectBuy > projectBuy) {
        minBuy = expectBuy;
        projectBuy = minBuy;
      }

      $("#projectBuy").val(projectBuy);
      $("#projectHold").val(projectHold);
      $("#showPer").text(projectCommissions);

      showOpenState();

      showPayInfo();
    }
  };

  /**
   * 显示购买信息
   */
  var showPayInfo = function () {
    $("#projectCountShow").text(params.projectCount);
    $("#projectBuyShow").text(projectBuy);
    $("#projectHoldShow").text(projectHold);
  };

  /**
   * 显示公开方式
   */
  var showOpenState = function () {
    $(".gmchose a").removeClass("click");
    $("#openState_" + projectOpenState).addClass("click");
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

    // 提成百分比
    $(document).off("change", "#selectPer").
      on("change", "#selectPer", function (e) {
        projectCommissions = $(this).find("option:selected").text();
        $("#showPer").text(projectCommissions);
        return true;
      });

    // 公开方式
    $(document).off(events.tap(), ".gmchose").
      on(events.tap(), ".gmchose", function (e) {
        var $a = $(e.target).closest("a");
        if ($a.length) {
          projectOpenState = $a.attr("id").split("_")[1];
          showOpenState();
        }
        return true;
      });

    // 购买金额
    $(document).off("keyup", "#projectBuy").
      on("keyup", "#projectBuy",function (e) {
        this.value = this.value.replace(/\D/g, '');
        var $projectBuy = $(this);
        projectBuy = $projectBuy.val();

        if ($.trim(projectBuy) == "") {
          projectBuy = 0;
        } else {
          if ($.trim(projectBuy) != "" && (isNaN(projectBuy) || projectBuy < 1)) {
            projectBuy = 1;
            $projectBuy.val(1);
          } else if (projectBuy > params.projectCount) {
            page.toast("认购金额不能超过总金额");
            projectBuy = params.projectCount;
            $projectBuy.val(projectBuy);
          }
        }

        // 显示付款信息
        showPayInfo();
        return true;
      }).off("blur", "#projectBuy")
      .on("blur", "#projectBuy", function (e) {
        this.value = this.value.replace(/\D/g, '');
        // 显示付款信息
        showPayInfo();
      });

    // 保底金额
    $(document).off("keyup", "#projectHold").
      on("keyup", "#projectHold",function (e) {
        this.value = this.value.replace(/\D/g, '');
        var $projectHold = $(this);
        projectHold = $projectHold.val();

        if ($.trim(projectHold) == "") {
          projectHold = 0;
        } else {
          if ($.trim(projectHold) != "" && (isNaN(projectHold) || projectHold < 1)) {
            projectHold = 0;
            $projectHold.val(0);
          } else if ((projectHold + projectBuy) > params.projectCount) {
            page.toast("保底金额+认购金额不能大于总金额");
            projectHold = params.projectCount - projectBuy;
            $projectHold.val(projectHold);
          }
        }

        // 显示付款信息
        showPayInfo();
        return true;
      }).off("blur", "#projectHold")
      .on("blur", "#projectHold", function (e) {
        this.value = this.value.replace(/\D/g, '');
        // 显示付款信息
        showPayInfo();
      });

    // footer
    $(document).off(events.click(), "footer").
      on(events.click(), "footer", function (e) {
        var $a = $(e.target).closest("a");
        if ($a.length) {
          if ($a.hasClass("fr")) {
            // 检查值
            if (checkVal()) {
              // 购买
              toBuy();
            }
          }
        }
      });
  };

  /**
   * 检查有效值
   */
  var checkVal = function () {
    // 购买金额
    var $projectBuy = $("#projectBuy");
    projectBuy = $projectBuy.val();

    if ($.trim(projectBuy) == "" || isNaN(projectBuy) || projectBuy < minBuy) {
      projectBuy = 0;
      page.toast("认购金额不能低于总金额的5%");

      // 显示付款信息
      showPayInfo();
      return false;
    }

    // 保底金额
    var $projectHold = $("#projectHold");
    projectHold = $projectHold.val();

    if ($.trim(projectHold) == "" || isNaN(projectHold) || projectHold < 0) {
      projectHold = 0;

      // 显示付款信息
      showPayInfo();
      return false;
    }
    return true;
  };

  /**
   * 购买付款
   */
  var toBuy = function () {
    params.projectHold = projectHold;
    params.projectOpenState = projectOpenState;
    params.projectBuy = projectBuy;
    params.projectCommissions = parseInt(projectCommissions, 10) + "";

    // 显示遮住层
    util.showCover();
    util.showLoading();

    // 请求接口
    var request = digitService.toBuy(lotConfig.lotteryId, "2", params, price, function (data) {

      // 隐藏遮住层
      util.hideCover();
      util.hideLoading();

      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            result = data;
            page.answer(
              "双色球 第 " + params.issueNo + " 期发起合买成功",
              "编号:" + data.lotteryNo + "<br>" + "账号余额:" + data.userBalance + " 元",
              "查看方案",
              "确定",
              function (e) {
                page.init("digit/detail", {lotteryType: lotConfig.lotteryId, requestType: "0", projectId: result.projectId, step: -2}, 0);
              },
              function (e) {
                page.go(-2);
              }
            );
            // 删除选号记录
            util.clearLocalData(util.keyMap.LOCAL_SSQ);
            util.clearLocalData(util.keyMap.LOCAL_TO_HM);

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

  return {init: init};
})
;