/**
 * 竞彩足球历史开奖信息详情
 */
define(function (require, exports, module) {
  var view = require('/views/athletics/jcz/detail.html'), page = require('page'), _ = require('underscore'), service = require('services/jcz'), util = require('util');
  // 赛事开奖结果
  var matchResult = {};
  /**
   * 初始化
   */
  var init = function (data, forward) {
    // 加载模板内容
    $("#container").html(view);
    // 赛事开奖结果
    matchResult = _.isEmpty(data) ? JSON.parse(util.unParam(location.hash.substring(1).split("?")[1]).data).matchResult : data;
    // 参数设置
    var params = $.extend(true, {} , matchResult);
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }
    // 显示赛事信息
    var teams = matchResult.playAgainst.split("|");
    $(".match").html(teams[0] + "&nbsp;<b>" + matchResult.goalscore + "</b>&nbsp;" + teams[1]);
    // 开奖结果
    var result = matchResult.result;
    // 胜平负
    var spf = result[0].spf;
    if (spf == "胜") {
      $("#spf_3").addClass("rs_s");
    } else if (spf == "平") {
      $("#spf_1").addClass("rs_s");
    } else if (spf == "负") {
      $("#spf_0").addClass("rs_s");
    }
    // 比分
    var bf = result[1].bf;
    var isColon = bf.indexOf(":");
    if (isColon) {
      bf = bf.replace(':', '-');
      $("#bf_" + bf).addClass("rs_s");
    } else {
      if (bf == "胜其他") {
        $("#bf_s").addClass("rs_s");
      } else if (bf == "平其他") {
        $("#bf_p").addClass("rs_s");
      } else if (bf == "负其他") {
        $("#bf_s").addClass("rs_s");
      }
    }

    // 总进球
    var zjq = result[2].zjq;
    if (parseInt(zjq, 10) > 6) {
      $("#zjq_7").addClass("rs_s");
    } else {
      $("#zjq_" + zjq).addClass("rs_s");
    }

    // 半全场
    var bqc = result[3].bqc;
    bqc = bqc.replace(/胜/g, 's').replace(/平/g, 'p').replace(/负/g, 'f');
    $("#bqc_" + bqc).addClass("rs_s");

    // 让球胜平负
    var rqspf = result[4].rqspf;
    if (rqspf == "让胜") {
      $("#rqspf_3").addClass("rs_s");
    } else if (rqspf == "让平") {
      $("#rqspf_1").addClass("rs_s");
    } else if (rqspf == "让负") {
      $("#rqspf_0").addClass("rs_s");
    }
    // 请求数据
    getDetail();
    // 绑定事件
    bindEvent();

    // 处理返回
    page.setHistoryState({url : "jcz/detail", data : params}, "jcz/detail", "#jcz/detail" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""), forward ? 1 : 0);

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
        // 胜平负
        var spf = spData.spf.split(",");
        $(".contain span").each(function (i, span) {
          $(span).text(spf[i]);
        });
        // 让球胜平负
        var rqspf = spData.rqspf.split(",");
        $(".lYTable tbody td").each(function (i, td) {
          var $td = $(td);
          if (!$td.hasClass("tab")) {
            $td.find('span').text(rqspf[i - 1]);
          }
        });
        $(".lYTable").find(".rqs").text(matchResult.transfer);
        // 半全场
        var bqc = spData.bqc.split(",");
        $(".lBTable span").each(function (i, span) {
          $(span).text(bqc[i]);
        });
        // 总进球
        var zjq = spData.zjq.split(",");
        $(".dYTable span").each(function (i, span) {
          $(span).text(zjq[i]);
        });

        // 比分
        var bf = spData.bf.split(",");
        $(".lRTable span").each(function (i, span) {
          $(span).text(bf[i]);
        });
      }
    });
  };
  /**
   * 绑定事件
   */
  var bindEvent = function () {
    // 返回
    $('.back').on('click', page.goBack);
    // 去投注
    $('.tzBox').on('click', function (e) {
      page.init("jcz/mix_bet", {}, 1);
    });
  };
  return {init : init};
});