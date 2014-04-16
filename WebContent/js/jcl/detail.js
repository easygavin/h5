/**
 * 竞彩篮球历史开奖信息详情
 */
define(function (require, exports, module) {
  var view = require('/views/athletics/jcl/detail.html'),
    page = require('page'),
    _ = require('underscore'),
    service = require('services/jcl'),
    fastClick = require('fastclick'),
    util = require('util');
  // 赛事开奖结果
  var matchResult = {};
  /**
   * 初始化
   */
  var init = function (data, forward) {
    // 加载模板内容
    $("#container").html(view);
    // 赛事开奖结果
    matchResult = _.isEmpty(data) ? JSON.parse(util.unParam(location.search.substring(1)).data).matchResult : data;
    // 参数设置
    var params = {};
    if (matchResult != "undefined") {
      params.matchResult = matchResult;
    }
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }
    // 显示赛事信息
    var teams = matchResult.playAgainst.split("|");
    $(".match").html(teams[0] + "&nbsp;<b>" + matchResult.goalscore + "</b>&nbsp;" + teams[1]);
    // 开奖结果
    var result = matchResult.result;
    // 胜负
    var sf = result[0].sf;
    if (sf == "主胜") {
      $("#sf_1").addClass("rs_s");
    }else {
      $("#sf_0").addClass("rs_f");
    }
    // 让分胜负
    var rfsf = result[1].rfsf;
    if (rfsf == "主胜") {
      $("#rfsf_1").addClass("rs_s");
    }else {
      $("#rfsf_0").addClass("rs_f");
    }
    // 大小分
    var dxf = result[3].dxf;
    if (dxf == "大分") {
      $("#dxf_1").addClass("rs_s");
    }else {
      $("#dxf_0").addClass("rs_f");
    }
    // 胜分差
    var sfc = result[2].sfc;
    $(".sfc_tab").find('td[data-text^='+sfc+']').addClass("rs_s");
    // 请求数据
    getDetail();
    // 绑定事件
    bindEvent();
    // 处理返回
    page.setHistoryState(
      {url: "jcl/detail", data: params},
      "jcl/detail",
        (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#jcl/detail",
      forward ? 1 : 0);

  };


  /**
   * 获取历史开奖信息详情
   */
  var getDetail = function () {
    // 请求数据
    service.getAwardDetailSP(matchResult.matchId, function (data) {
      // 隐藏加载标示
      util.hideLoading();
      if (data.statusCode == "0") {
        var spData = data.spDatas;
        // 胜负
        var sf = spData.sf.split(",");
        $(".sf_tab span").each(function (i, span) {
          $(span).text(sf[i]);
        });
        // 让分胜负
        var rfsf = spData.rfsf.split(",");
        $(".rfsf_tab span").each(function (i, span) {
          $(span).text(rfsf[i]);
        });
        // 大小分
        var dxf = spData.dxf.split(",");
        $(".dxf_tab span").each(function (i, span) {
          $(span).text(dxf[i]);
        });
        // 胜分差
        var sfc = spData.sfc.split(",");
        $(".sfc_tab span").each(function (i, span) {
          $(span).text(sfc[i]);
        });
      }
    });
  };
  /**
   * 绑定事件
   */
  var bindEvent = function () {
    //fastclick events
    fastClick.attach(document);
    // 返回
    $('.back').on('click', page.goBack);
    // 去投注
    $('.tzBox').on('click', function (e) {
      page.init("jcl/bet", {}, 1);
    });
  };
  return {init: init};
});