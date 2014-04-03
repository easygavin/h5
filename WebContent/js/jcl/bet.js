/**
 * 竞彩篮球选场
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('zepto'),
    _ = require('underscore'),
    util = require('util'),
    page = require('page'),
    pageEvent = require('events'),
    config = require('config'),
    service = require('services/jcl'),
    view = require('/views/athletics/jcl/bet.html');
  // 处理返回参数
  var canBack = 0;
  // 彩种
  var lotteryType = "36";
  // 对阵列表数据
  var betList = {};
  // match Map值
  var matchMap = {};
  // 缓存的数据
  var bufferData = null;
  // 消费金额
  var pay = 0;
  // 注数
  var total = 0;
  // 显示期号
  var issueNo = "";
  // 赛事分类
  var leagueMap = {};
  // 初始焦点元素
  var initEles = null;
  /**
   * 初始化
   */
  var init = function (data, forward) {
    canBack = forward ? 1 : 0;
    // 加载模板内容
    $("#container").html(view);
    // 参数设置
    var params = {};
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }
    // 初始化显示
    initShow(canBack);

    // 绑定事件
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "jcl/bet", data: params},
      "jcl/bet",
        (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#jcl/bet",
      canBack);
  };

  /**
   * 初始化显示
   */
  var initShow = function (forward) {

    if (forward) {
      getBetList();
    } else {
      // 根据缓存数据判断是否需要重新拉取列表
      // 缓存的数据
      bufferData = util.getLocalJson(util.keyMap.LOCAL_JCL);
      if (bufferData && betList && betList && betList.datas) {
        // 处理对阵列表
        handleBetList();
        // 显示缓存数据
        showBuffer();
      } else {
        // 获取对阵列表
        getBetList();
      }
    }

    unitTotal();
  };
  /**
   * 获取对阵列表
   */
  var getBetList = function () {
    betList = {}, matchMap = {}, issueNo = "", leagueMap = {};
    service.getJCLQBetList(lotteryType, function (data) {
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            betList = data;
            // 处理对阵列表
            handleBetList();
          } else {
            page.toast(data.errorMsg);
          }
        }
      }
    });
  };

  /**
   * 处理对阵列表
   */
  var handleBetList = function () {
    // 隐藏加载标示
    util.hideLoading();
    var matchLen = 0;
    for(var i = 0, len = betList.datas.length; i < len; i++) {
      matchLen += betList.datas[i].matchArray.length;
    }
    // 显示期号
    showIssueNo(matchLen);
    // 显示赛事列表
    showMatchItems();
    addLeagueItems();
  };

  /**
   * 显示期号
   */
  var showIssueNo = function (matchLen) {
    issueNo = betList.datas[0].issueNo;
    $("#JMIssueNo").text(issueNo + "期，共" + matchLen + "场比赛可投注");
  };

  /**
   * 显示赛事列表
   */
  var showMatchItems = function () {
    var htmlStr = '', tpl = require('/tpl/athletics/jcl/match');
    for(var i = 0, iLen = betList.datas.length; i < iLen; i++) {
      var matchArr = betList.datas[i].matchArray;
      for(var j = 0, jLen = matchArr.length; j < jLen; j++) {
        var item = matchArr[j],
          len = 1;
        matchMap[item.matchId] = item;
        if (typeof leagueMap[item.leagueMatch]) {
          len = ~~leagueMap[item.leagueMatch] + len;
        }
        leagueMap[item.leagueMatch] = len;
        htmlStr += tpl(item);
      }
    }
    $(".balls").append(htmlStr);
  };
  /**
   * 添加赛事种类列表
   */
  var addLeagueItems = function () {
    for(var l in leagueMap) {
      $(".leagueBox .icon").append($("<li class='click'>" + l + "[<span>" + leagueMap[l] + "</span>]场</li>"));
    }
    showLeagueMatchLen();
  };
  /**
   * 显示选择赛事类型中的场数
   */
  var showLeagueMatchLen = function () {
    var matchLen = 0;
    $(".leagueBox .icon .click").each(function (i, li) {
      var $span = $(li).find("span");
      if ($span.length) {
        matchLen += +$span.text();
      }
    });
    $(".bar .red").text(matchLen);
  };

  /**
   * 显示缓存数据
   */
  var showBuffer = function () {
    var matchBetList = bufferData.matchBetList;
    for(var i = 0, len = matchBetList.length; i < len; i++) {
      var item = matchBetList[i];
      var matchId = item.matchId;
      var sfIds = item.sfIds,
        rfsfIds = item.rfsfIds,
        dxfIds = item.dxfIds,
        sfcIds = item.sfcIds;

      if (rfsfIds.length > 0 || dxfIds.length > 0 || sfcIds.length > 0) {
        // 显示SP层
        showSPOptions(matchId);
      }

      // 胜负
      for(var j = 0, jLen = sfIds.length; j < jLen; j++) {
        $("#" + sfIds[j] + "-" + matchId).addClass("click");
      }

      // 让分胜负
      for(var k = 0, kLen = rfsfIds.length; k < kLen; k++) {
        $("#" + rfsfIds[k] + "-" + matchId).addClass("click");
      }

      // 大小分
      for(var d = 0, dLen = dxfIds.length; d < dLen; d++) {
        $("#" + dxfIds[d] + "-" + matchId).addClass("click");
      }

      // 胜负差
      for(var c = 0, cLen = sfcIds.length; c < cLen; c++) {
        $("#" + sfcIds[c] + "-" + matchId).addClass("click");
      }

      if (sfIds.length > 0 || rfsfIds.length > 0 || dxfIds.length > 0 || sfcIds.length > 0) {
        // 焦点样式
        switchArrow(matchId, 0);
      }
    }
  };

  /**
   * 箭头转换样式
   * @param matchId 赛事id
   * @param flag 1:切换，0:焦点
   */
  var switchArrow = function (matchId, flag) {
    var $contain = $("#" + matchId);
    // 焦点样式
    if ($contain.find(".click").length) {
      $contain.find(".arr").addClass('f07e04');
    } else {
      $contain.find(".arr").removeClass('f07e04');
    }
  };
  /**
   * 显示SP选择项
   * @param matchId
   */
  var showSPOptions = function (e) {
    var $tar = $(e.target),
      $match = $tar.closest('div'),
      matchId = $match.data('matchId'),
      data = matchMap[matchId];
    require.async('/tpl/athletics/jcl/more_odds', function (tpl) {
      if ($match.find('.showhide').length == 0) {
        $match.toggleClass('on_show').append(tpl(data));
      } else {
        $match.toggleClass('on_show').find('.showhide').toggle();
      }
    });
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    // 返回
    $(".back").on(pageEvent.touchStart(), function (e) {
      pageEvent.handleTapEvent(this, this, pageEvent.activate(), e);
      return true;
    });

    $(".back").on(pageEvent.activate(), function (e) {
      if (canBack) {
        page.goBack();
      } else {
        page.init("home", {}, 1);
      }
      return true;
    });

    // 右菜单
    $(".menu").on(pageEvent.touchStart(), function (e) {
      pageEvent.handleTapEvent(this, this, pageEvent.activate(), e);
      return false;
    });

    $(".menu").on(pageEvent.activate(), function (e) {
      $(".popup").show();
      util.showCover();
      return false;
    });

    // 筛选
    $("#filterBtn").on(pageEvent.touchStart(), function (e) {
      pageEvent.handleTapEvent(this, this, pageEvent.activate(), e);
      return true;
    });

    $("#filterBtn").on(pageEvent.activate(), function (e) {
      showLeagueBox();
      return true;
    });

    // 购彩记录
    $("#gc_menu").on(pageEvent.click(), function (e) {
      util.hideCover();
      if (!util.checkLogin(null)) {
        // 尚未登录，弹出提示框
        page.answer("", "您还未登录，请先登录", "登录", "取消",
          function (e) {
            page.init("login", {}, 1);
          },
          function (e) {
            $(".popup").hide();
          }
        );
        return false;
      }
      page.init("user/buyRecord", {lotteryId: 36}, 1);
      return false;
    });

    // 开奖信息
    $("#kj_menu").on(pageEvent.click(), function (e) {
      util.hideCover();
      page.init("jcl/lottery_list", {lotteryType: 36}, 1);
    });

    // 玩法介绍
    $("#wf_menu").on(pageEvent.click(), function (e) {
      util.hideCover();
      page.init("jcl/intro", {}, 1);
    });

    // 关闭显示框
    $(".cover").on(pageEvent.click(), function (e) {
      $(".popup").hide();
      if ($(".leagueBox").is(":visible")) {
        hideLeagueBox();
        $(".leagueBox .icon li").removeClass("click");
        initEles.each(function (i, item) {
          $(item).addClass("click");
        });
        showLeagueMatchLen();
      }
      util.hideCover();
      return true;
    });

    $(".balls").on(pageEvent.tap(), function (e) {
      var $target = $(e.target);
      // SP切换
      var $bordernone = $target.closest(".bordernone");
      // more 跳转
      var $more = $target.closest(".jcMore");
      // 胜负
      var $sf = $target.closest(".footballTz");
      // 让分
      var $rfsf = $target.closest(".lYTable");
      // 大小分
      var $dxf = $target.closest(".lBTable");
      // 胜负差
      var $sfc = $target.closest(".lRTable");

      if ($bordernone.length) {
        // 切换SP显示
        showSPOptions(e);
      } else if ($more.length) {
        // more 跳转
      } else if ($sf.length && !$target.hasClass("tab")) {
        // 获取matchId
        var matchId = $target.closest('div').data('matchId');

        if ($target.hasClass("click")) {
          $target.removeClass("click");
        } else {
          if (getMatchFocus(matchId)) {
            $target.addClass("click");
          } else {
            if (total == 10) {
              page.toast("最多选择10场比赛");
            } else {
              $target.addClass("click");
            }
          }
        }

        if ($.trim(matchId) != "") {
          switchArrow(matchId, 0);
        }

        // 赛事场数
        unitTotal();
      } else if (($rfsf.length || $dxf.length || $sfc.length) && !$target.hasClass("tab")) {
        // 让分, 大小分, 胜负差
        var $td = $target.closest("td");
        // 获取matchId
        var matchId = $target.closest('div').data('matchId');
        if ($td.hasClass("click")) {
          $td.removeClass("click");
        } else {
          if (getMatchFocus(matchId)) {
            $td.addClass("click");
          } else {
            if (total == 10) {
              page.toast("最多选择10场比赛");
            } else {
              $td.addClass("click");
            }
          }
        }
        if ($.trim(matchId) != "") {
          switchArrow(matchId, 0);
        }
        // 赛事场数
        unitTotal();
      }
      return true;
    });

    // 清除选中号
    $(".btn1").on(pageEvent.touchStart(), function (e) {
      pageEvent.handleTapEvent(this, this, pageEvent.activate(), e);
      return true;
    });

    $(".btn1").on(pageEvent.activate(), function (e) {
      clear();
      unitTotal();
      return true;
    });

    // 确认
    $("footer .btn2").on(pageEvent.touchStart(), function (e) {
      pageEvent.handleTapEvent(this, this, pageEvent.activate(), e);
      return true;
    });

    $("footer .btn2").on(pageEvent.activate(), function (e) {
      if (typeof betList && typeof betList.datas && betList.datas.length) {
        if (total > 1) {
          // 赛事数据
          bufferData = {};
          // 期号
          bufferData.issueNo = issueNo;
          // 标题对象
          var titleMap = {};
          // 赛事对阵列表
          var matchBetList = [];
          $(".betContain").each(function (i, item) {
            var $item = $(item);
            if ($item.find(".click").length) {
              var data = {};// 每场赛事数据
              var matchId = $item.closest('.betContain').data('matchId');// 获取matchId
              data.matchId = matchId;
              data.match = matchMap[matchId];
              if (matchId) {
                // 胜负
                var sfIds = [];
                var $sf = $item.find(".footballTz .click");
                if ($sf.length) {
                  $sf.each(function (j, sf) {
                    var sfId = $(sf).attr("id").split("-")[0];
                    sfIds.push(sfId);
                  });
                  titleMap["sf"] = "1";
                }
                data.sfIds = sfIds;
                // 让分
                var rfsfIds = [];
                var $rfsf = $item.find(".lYTable .click");
                if ($rfsf.length) {
                  $rfsf.each(function (k, rfsf) {
                    var rfsfId = $(rfsf).attr("id").split("-")[0];
                    rfsfIds.push(rfsfId);
                  });
                  titleMap["rfsf"] = "1";
                }
                data.rfsfIds = rfsfIds;
                // 大小分
                var dxfIds = [];
                var $dxf = $item.find(".lBTable .click");
                if ($dxf.length) {
                  $dxf.each(function (d, dxf) {
                    var dxfId = $(dxf).attr("id").split("-")[0];
                    dxfIds.push(dxfId);
                  });
                  titleMap["dxf"] = "1";
                }
                data.dxfIds = dxfIds;
                // 胜负差
                var sfcIds = [];
                var $sfc = $item.find(".lRTable .click");
                if ($sfc.length) {
                  $sfc.each(function (c, sfc) {
                    var sfcId = $(sfc).attr("id").split("-")[0];
                    sfcIds.push(sfcId);
                  });
                  titleMap["sfc"] = "1";
                }
                data.sfcIds = sfcIds;
                matchBetList.push(data);
              }
            }
          });
          bufferData.matchBetList = matchBetList;
          bufferData.titleMap = titleMap;
          util.setLocalJson(util.keyMap.LOCAL_JCL, bufferData);
          util.getLocalJson(util.keyMap.LOCAL_JCL);
          page.init("jcl/list", {}, 1);
        } else {
          page.toast("至少选择2场比赛");
        }
      } else {
        page.toast("无法获取期号");
        return false;
      }
      return true;
    });

    // 赛事种类筛选
    $(".leagueBox .icon").on(pageEvent.tap(), function (e) {
      var $li = $(e.target).closest("li");
      if ($li.length) {
        if ($li.hasClass("click")) {
          $li.removeClass("click");
          $("#leagueOpt").text('全选');
        } else {
          $li.addClass("click");
          if ($(".leagueBox .icon .click").length == $(".leagueBox .icon li").length) {
            $("#leagueOpt").text('全不选');
          }
        }
        showLeagueMatchLen();
      }
    });
    $("#leagueOpt").on(pageEvent.tap(), function (e) {
      // 全选，全不选
      var $btn = $("#leagueOpt");
      if ('全不选' == $btn.text()) {
        // 全不选
        $(".leagueBox .icon li").removeClass("click");
        $btn.removeClass('click').text("全选");
      } else {
        // 全选
        $(".leagueBox .icon li").addClass("click");
        $btn.text("全不选");
      }
      showLeagueMatchLen();
    });
    $(".bar .confirm").on(pageEvent.tap(), function (e) {
      var $clicks = $(".leagueBox .icon .click");
      if (!$clicks.length) {
        page.toast("请至少选择1种赛事");
        return false;
      }
      var matchLen = 0;
      var $leagueAll = $("#leagueOpt");
      if ('全选' == $leagueAll.text()) {
        // 全选
        $(".betContain").show();
        matchLen = +$(".bar .red").text();
      } else {
        $(".betContain").hide();
        $clicks.each(function (i, li) {
          var text = $(li).text();
          var leagueName = text.substring(0, text.indexOf("["));
          $(".leagueT").each(function (i, t) {
            var $t = $(t);
            if (leagueName == $t.text()) {
              matchLen++;
              $t.closest(".betContain").show();
            }
          });
        });
      }
      showIssueNo(matchLen);
      hideLeagueBox();
    });
  };

  /**
   * 显示赛事种类层
   */
  var showLeagueBox = function () {
    if ($(".leagueBox .icon").length) {
      initEles = $(".leagueBox .icon .click");
      $(".leagueBox").show();
      util.showCover();
    }
  };

  /**
   * 隐藏赛事种类层
   */
  var hideLeagueBox = function () {
    $(".leagueBox").hide();
    util.hideCover();
  };

  /**
   * 清除
   */
  var clear = function () {
    $(".balls").find(".click").removeClass("click");
    $('.arr').removeClass('f07e04');
  };

  /**
   * 获取赛事是否选中
   * @param matchId
   */
  var getMatchFocus = function (matchId) {
    if ($("#" + matchId).find(".click").length) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * 统计赛事场数
   */
  var unitTotal = function () {
    total = 0;
    $(".betContain").each(function (i, item) {
      if ($(item).find(".click").length) {
        total++;
      }
    });
    $("#total").text(total);
  };

  return {init: init};
});