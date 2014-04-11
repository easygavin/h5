/**
 * 数字彩方案详情
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    template = require("../../views/number/detail.html"),
    digitService = require('services/digit');
  var canBack = 1;
  // 返回step
  var step = -1;
  // 彩种
  var lotteryType = "";
  // 请求方式
  var requestType = "";
  // 方案编号
  var projectId = "";
  // 有无追期
  var hasWithdraw = 0;
  // 追期列表
  var allIssue = [];
  /**
   * 初始化
   */
  var init = function (data, forward) {
    canBack = forward || 0;
    step = -1;

    // 参数设置
    var params = {};
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    if (data != null && typeof data != "undefined") {
      // 返回几步
      if (typeof data.step != "undefined" && $.trim(data.step) != "") {
        step = data.step;
        params.step = step;
      }

      // 彩种
      if (typeof data.lotteryType != "undefined" && $.trim(data.lotteryType) != "") {
        lotteryType = data.lotteryType;
        params.lotteryType = lotteryType;
      }

      // 请求方式
      if (typeof data.requestType != "undefined" && $.trim(data.requestType) != "") {
        requestType = data.requestType;
        params.requestType = requestType;
      }

      // 方案编号
      if (typeof data.projectId != "undefined" && $.trim(data.projectId) != "") {
        projectId = data.projectId;
        params.projectId = projectId;
      }
    }

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url:"number/detail", data:params},
      "number/detail",
      "#number/detail" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
      canBack);
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").html(template);
    hasWithdraw = 0, allIssue = [];
    // 获取方案详情
    getDetails();
  };

  /**
   * 获取方案详情
   */
  var getDetails = function () {
    var request = digitService.getProjectDetails(lotteryType, requestType, projectId, function (data) {
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

    util.addAjaxRequest(request);
  };

  /**
   * 获取方案详情
   */
  var getAllIssue = function () {
    util.showLoading();
    var request = digitService.getProjectAllIssue(lotteryType, projectId, function (data) {
      util.hideLoading();
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            allIssue = data.projectIssues;
            showAllIssue();
          } else {
            page.codeHandler(data);
          }
        }
      }
    });

    util.addAjaxRequest(request);
  };

  /**
   * 显示详情
   * @param data
   */
  var showDetails = function (data) {

    var isWithdraw = 0, // 可追期数
      past = 0, // 已追期数
      witdraw = 0; // 撤单期数

    if (data.isWithdraw != null && typeof data.isWithdraw != "undefined"
      && $.trim(data.isWithdraw) != "") {
      isWithdraw = parseInt(data.isWithdraw, 10);
    }

    if (data.past != null && typeof data.past != "undefined"
      && $.trim(data.past) != "") {
      past = parseInt(data.past, 10);
    }

    if (data.witdraw != null && typeof data.witdraw != "undefined"
      && $.trim(data.witdraw) != "") {
      witdraw = parseInt(data.witdraw, 10);
    }

    hasWithdraw = isWithdraw + past + witdraw;
    data.hasWithdraw = hasWithdraw;

    var title = data.title.replace('自购', '&nbsp;&nbsp;').replace('追号', '期可追');
    data.title = title;

    var detail = data.detail;

    var detail = detail.replace(/{/g, '<span class="cdd1049">')
      .replace(/}/g, '</span>')
      .replace(/#/g, '<br>');
    data.detail = detail;

    if ($.trim(data.openNumber) != "") {
      var openNumbers = data.openNumber.split("+");
      data.reds = openNumbers[0];
      if (openNumbers.length > 1) {
        data.blues = openNumbers[1];
      }
    }

    var detailTpl = require('/tpl/number/detail');

    $(".detailBox").html(detailTpl(data));

    if (hasWithdraw < 2) {
      $("footer").show();
    }
  };

  /**
   * 显示追期列表
   * @param data
   */
  var showAllIssue = function () {
    var data = {};
    data.issues = allIssue;

    var detailIssueTpl = require('/tpl/number/detail_issue');

    $("#allIssueList").html(detailIssueTpl(data)).show();

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
        if (step < -1) {
          // 返回多步
          page.go(step);
        } else {
          page.goBack();
        }
        return true;
      });

    // 下拉图标
    $(document).off(events.tap(), "#pullBtn").
      on(events.tap(), "#pullBtn", function (e) {
        if ($(this).hasClass("down")) {
          $(this).removeClass("down").addClass("up").html("&#xf060;");
          if (allIssue != null && typeof allIssue != "undefined"
            && allIssue.length) {
            $("#allIssueList").show();
          } else {
            getAllIssue();
          }
        } else {
          $(this).removeClass("up").addClass("down").html("&#xf003;");
          $("#allIssueList").hide();
        }
      });

    // 查看本单合买
    $(document).off(events.tap(), "#hmOrder").
      on(events.tap(), "#hmOrder", function (e) {
        // 三个参数 lotteryType,requestType,projectId

        return true;
      });

    // 复活追号
    $(document).off(events.click(), "#appendPrj").
      on(events.click(), "#appendPrj", function (e) {
        if ($.trim(projectId) == "") {
          page.toast("方案无效");
          return false;
        }
        page.answer(
          "温馨提示",
          "以本方案投注内容再次购买当前期彩种？",
          "取消",
          "确定",
          function (e) {
          },
          function (e) {
            // 复活请求
            var request = digitService.addBuyDigit(lotteryType, projectId + "", function (data) {
              if (typeof data != "undefined") {
                if (typeof data.statusCode != "undefined") {
                  if (data.statusCode == "0") {
                    page.dialog(
                      "",
                      "复活追号成功，您的账号余额为" + data.userBalance + "元",
                      "确定",
                      function (e) {
                      }
                    );
                  } else {
                    page.codeHandler(data);
                  }
                }
              }
            });

            util.addAjaxRequest(request);
          }
        );
        return true;
      });
  };

  return {init: init};
});