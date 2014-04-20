/**
 * 竞彩足球彩合买
 */
define(function (require, exports, module) {
  var page = require('page'), util = require('util'), $ = require('zepto'), _ = require('underscore'), fastClick = require('fastclick'), views = require("/views/athletics/hm.html"), config = require('config'), servers = require('services/jcz');
  var canBack = 1;
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
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url : "jcz/hm", data : params}, "jcz/hm", "#jcz/hm" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""), canBack ? 1 : 0);
    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").html(views);
    setDefault();
    showHMDetail();
  };

  /**
   * 设置默认参数
   */
  var setDefault = function () {
    if (canBack) {
      params = {};
      projectBuy = 1;
      projectHold = 0;
      projectCommissions = "5%";
      projectOpenState = "2";
      minBuy = 1;
    }
  };

  /**
   * 显示合买详情
   */
  var showHMDetail = function () {
    params = util.getLocalJson(util.keyMap.LOCAL_TO_HM);
    console.log(params);
    if (params !== null && typeof params != "undefined") {

      $(".title").text(params.title + "合买");
      $("#projectCount").text(params.projectCount + "元");
      $("#eachMoney").text(params.eachMoney + "元");

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
    fastClick.attach(document.body);
    // 返回
    $('.back').on('click', page.goBack);
    // 提成百分比
    $('#selectPer').on('change', function () {
      projectCommissions = $(this).find("option:selected").text();
      $("#showPer").text(projectCommissions);
    });

    // 公开方式
    $('.gmchose').on('click', function (e) {
      var $a = $(e.target).closest("a");
      if ($a.length) {
        projectOpenState = $a.attr("id").split("_")[1];
        showOpenState();
      }
    });

    // 购买金额
    $('#projectBuy').on('keyup', function (e) {
      e.value = this.value.replace(/\D/g, '');
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
    }).on('blur', function () {
      this.value = this.value.replace(/\D/g, '');
      // 显示付款信息
      showPayInfo();
    });
    // 保底金额
    $('#projectHold').on('keyup', function (e) {
      e.value = this.value.replace(/\D/g, '');
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
    }).on("blur", function (e) {
      e.value = this.value.replace(/\D/g, '');
      // 显示付款信息
      showPayInfo();
    });
    // footer
    $('footer').on('click', '.btn2', function () {
      checkVal() && toBuy();
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
    params.projectCommissions = projectCommissions.replace('%','');
    // 显示遮住层
    util.showCover();
    util.showLoading();
    // 请求接口
    var request = servers.toBuy("2", params, price, function (data) {
      // 隐藏遮住层
      util.hideCover();
      util.hideLoading();
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            result = data;
            page.answer("发起合买成功", "编号:" + data.lotteryNo + "<br>" + "账号余额:" + data.userBalance + " 元", "查看方案", "确定", function (e) {
              page.init("jcz/result", {lotteryType : params.lotteryId, requestType : "0", projectId : result.projectId, step : -2}, 0);
            }, function (e) {
              page.go(-2);
            });
            // 删除选号记录
            util.clearLocalData(util.keyMap.LOCAL_JCL);
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

  return {init : init};
});