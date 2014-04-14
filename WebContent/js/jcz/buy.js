/*
 * @role page
 * @member jcz
 * @describe 竞彩足球下单购买页面
 * */
define(function (require, exports, module) {
  var view = require('/views/athletics/buy.html'), page = require('page'), util = require('util'), _ = require('underscore'), fastClick = require('fastclick'), events = require('events'), service = require('services/jcz');
  var canBack = 1;
  var title = "竞足";
  // 彩种
  var lotteryType = "46";
  // 玩法 默认2，奖金优化10，上下盘12
  var playType = '2';
  // 显示投注列表
  var bufferData = null;
  // 倍数
  var timesUnit = 1;
  // 注数
  var totals = 0;
  // 总付款
  var pays = 0;
  // 单价
  var price = 2;
  // 购买成功后返回的结果集
  var result = {};
  // 标题类型标示
  var titleFlag = "mix";
  // 投注方式列表
  var types = []; //spf,rqspf,zjq,bqc,bf
  // 普通过关
  var normalWays = [];
  // 多串过关
  var manyWays = [];
  // 赛事数据
  var optArr = {};
  // SP值对象数组
  var spArr = {};
  // 混投计算需要
  var agcg = {};
  //最大最小奖金
  var prizes = {};
  //默认选择的胆码
  var selectedDan = [];
  /**
   * 初始化
   */
  var init = function (data, forward) {
    // 加载模板内容
    $("#container").html(view);
    canBack = forward || 0;
    // 参数设置
    var params = {};
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }
    var currPlayName = sessionStorage.getItem('jcz_curr_play_name');
    if ('uad_bet' == currPlayName) {
      playType = 12;
    }

    // 初始化显示
    initShow(data, forward);
    // 绑定事件
    bindEvent();
    // 处理返回
    page.setHistoryState({url: "jcz/buy", data: {}}, "jcz/buy", "#jcz/buy" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""), canBack);

    // 隐藏加载标示
    util.hideLoading();
  };
  /**
   * 初始化显示
   */
  var initShow = function (data, forward) {
    if (forward) {
      timesUnit = 1;
    } else {
      $("#timesUnit").val(timesUnit);
    }
    // 显示投注列表
    bufferData = util.getLocalJson(util.keyMap.LOCAL_JCZ);
    // 显示标题
    showTitle();
    // 显示投注列表
    showItems();
    // 获取过关方式
    getCrossWayArr();
    // 初始化显示文本
    initShowTxt();
    // 获取总注数,包括最大最小奖金
    getTotalBet();
    // 获取最小最大奖金
    getMinMaxPrize();
    // 显示付款信息
    showPayInfo();
    //初始化显示选择的胆码
    getSelectedDan();
  };
  /**
   * 显示投注列表
   */
  var showItems = function () {
    optArr = {}, spArr = {};
    totals = 0, pays = 0, result = {}, price = 2;
    if (bufferData != null && typeof bufferData != "undefined" && bufferData.matchBetList != null && typeof bufferData.matchBetList != "undefined" && bufferData.matchBetList.length) {
      var matchBetList = bufferData.matchBetList;
      for (var i = 0, len = matchBetList.length; i < len; i++) {
        addItem(i, matchBetList[i]);
      }
    }
  };


  /**
   * 添加一项数据
   * @param index
   * @param item
   */
  var addItem = function (index, item) {
    var matchId = item.matchId;
    var match = item.match;
    var teams = match.playAgainst.split("|");
    var str = '<tr id="m_' + matchId + '" align="left"><td>' + match.number + '&nbsp;&nbsp;' + teams[0] + '&nbsp;&nbsp; VS &nbsp;&nbsp;' + teams[1] + '<p class="cf60">';
    // 胜负, 让分胜负, 大小分, 胜负差
    var spfIds = item.spfIds, rqspfIds = item.rqspfIds, zjqIds = item.zjqIds, bqcIds = item.bqcIds, bfIds = item.bfIds, uadIds = item.uadIds, spCount = 0;
    // 收集SP值数组
    var itemSPArr = [];
    var agcgArr = [];
    //根据选择的胜平负赛事,得到对应的SP值..
    if (spfIds.length) {
      spCount += spfIds.length;
      for (var i = 0, len = spfIds.length; i < len; i++) {
        var sp = handleSPValue(spfIds[i], match);
        itemSPArr.push(sp);
        agcgArr.push(1);
        var mode = spModeMap[spfIds[i]];
        str += '<span class="bet-rs" id="' + matchId + '_spf_' + mode.flag + '_' + sp + '_' + item.match.transfer + '">' + mode.title + '</span>&nbsp;&nbsp;';
      }
    }
    if (rqspfIds.length) {
      spCount += rqspfIds.length;
      for (var i = 0, len = rqspfIds.length; i < len; i++) {
        var sp = handleSPValue(rqspfIds[i], match);
        itemSPArr.push(sp);
        agcgArr.push(2);
        var mode = spModeMap[rqspfIds[i]];
        str += '<span class="bet-rs" id="' + matchId + '_rqspf_' + mode.flag + '_' + sp + '_' + item.match.transfer + '">' + mode.title + '</span>&nbsp;&nbsp;';
      }
    }
    if (zjqIds.length) {
      spCount += zjqIds.length;
      for (var i = 0, len = zjqIds.length; i < len; i++) {
        var sp = handleSPValue(zjqIds[i], match);
        itemSPArr.push(sp);
        agcgArr.push(3);
        var mode = spModeMap[zjqIds[i]];
        str += '<span class="bet-rs" id="' + matchId + '_zjq_' + mode.flag + '_' + sp + '_' + item.match.transfer + '">' + mode.title + '</span>&nbsp;&nbsp;';
      }
    }
    if (bqcIds.length) {
      spCount += bqcIds.length;
      for (var i = 0, len = bqcIds.length; i < len; i++) {
        var sp = handleSPValue(bqcIds[i], match);
        itemSPArr.push(sp);
        agcgArr.push(4);
        var mode = spModeMap[bqcIds[i]];
        str += '<span class="bet-rs" id="' + matchId + '_bqc_' + mode.flag + '_' + sp + '_' + item.match.transfer + '">' + mode.title + '</span>&nbsp;&nbsp;';
      }
    }

    if (bfIds.length) {
      spCount += bfIds.length;
      for (var i = 0, len = bfIds.length; i < len; i++) {
        var sp = handleSPValue(bfIds[i], match);
        itemSPArr.push(sp);
        agcgArr.push(5);
        var mode = spModeMap[bfIds[i]];
        str += '<span class="bet-rs" id="' + matchId + '_bf_' + mode.flag + '_' + sp + '_' + item.match.transfer + '">' + mode.title + '</span>&nbsp;&nbsp;';
      }
    }

    if (uadIds.length) {
      spCount += uadIds.length;
      for (var i = 0, len = uadIds.length; i < len; i++) {
        var infoList = uadIds[i].split('_');
        agcgArr.push(6);
        itemSPArr.push(infoList[3]);
        str += '<span class="bet-rs" id="' + matchId + '_' + infoList[0] + '_' + infoList[1] + '_' + infoList[3] + '_' + item.match.transfer + '">' + infoList[2] + '</span>&nbsp;&nbsp;';
      }
    }

    // 赛事数据
    optArr[matchId] = spCount; //某场比赛,选了多少sp值.....
    agcg[matchId] = agcgArr;   //暂未确定...

    // SP值排序
    itemSPArr.sort(service.asc);
    // 保存SP数组
    spArr[matchId] = itemSPArr;
    str += "</p></td><td>";
    // 竞彩足球混投无胆
    str += (titleFlag == "mix" ? "&nbsp;" : "<span id='t_" + matchId + "' class='dan fr'>胆</span>");
    str += "</td></tr>";
    $(".zckjTab tbody").append(str);
  };

  /**
   * 通过mixed页面所选项处理SP值
   * @param spWayIndex 如spf_0,代表match.spDatas.spf 第一个下标.
   * @param match
   */
  var handleSPValue = function (spWayIndex, match) {
    var spWayIndexArr = spWayIndex.split("_");
    var sp = "0";
    if (spWayIndexArr.length > 1) {
      var spWay = spWayIndexArr[0];// spway=spf
      var index = +spWayIndexArr[1]; //index=0
      var spDatas = match.spDatas;
      switch (spWay) {
        case "spf": // 胜平负
          var spf = spDatas.spf.split(",");
          sp = spf[index];
          break;
        case "rqspf": // 让分胜负
          var rqspf = spDatas.rqspf.split(",");
          sp = rqspf[index];
          break;
        case "zjq": // 大小分
          var zjq = spDatas.zjq.split(",");
          sp = zjq[index];
          break;
        case "bqc": // 半全场
          var bqc = spDatas.bqc.split(",");
          sp = bqc[index];
          break;
        case "bf": // 比分
          var bf = spDatas.bf.split(",");
          sp = bf[index];
          break;
        case 'uad': //上下盘
          var uad = spDatas.footwall.split('|');
          sp = uad[index].split('_')[1];
          break;
      }
    }
    return sp;
  };

  /**
   * 显示标题
   */
  var showTitle = function () {
    title = '竟足'
    types = [];
    var count = 0;
    if (!_.isEmpty(bufferData) && bufferData.matchBetList.length) {
      for (var t in bufferData.titleMap) {
        count++;
        titleFlag = t;
        types.push(t);
      }
      if (count == 1) {
        switch (titleFlag) {
          case "spf":
            title += "胜平负";
            break;
          case "rqspf":
            title += "让球胜平负";
            break;
          case "zjq":
            title += "总进球";
            break;
          case "bqc":
            title += "半全场";
            break;
          case "bf":
            title += "比分";
            break;
          case 'uad':
            title += '上下盘';
            break;
        }
      } else {
        title += "混投";
        titleFlag = "mix";
      }
    }

    $("#title").text(title);
  };

  /**
   * 获取过关方式
   */
  var getCrossWayArr = function () {
    normalWays = [], manyWays = [];
    if (!_.isEmpty(bufferData) && bufferData.matchBetList && bufferData.matchBetList.length) {
      // 胆数
      var danCount = $(".zckjTab .click").length;
      // 场数
      var matchLen = bufferData.matchBetList.length;
      // 普通过关
      normalWays = service.getNormalWays(matchLen, danCount, types);
      if (normalWays.length > 0) {
        for (var i = 0, len = normalWays.length; i < len; i++) {
          $("#way_0").append("<a id='" + normalWays[i] + "'>" + normalWays[i].replace('-', '串') + "</a>");
        }
      }
      // 多串过关
      manyWays = service.getManyWay(matchLen, types);
      if (manyWays.length > 0) {
        for (var i = 0, len = manyWays.length; i < len; i++) {
          $("#way_1").append("<a id='" + manyWays[i] + "'>" + manyWays[i].replace('-', '串') + "</a>");
        }
        $("#tab_1").show();
      }
    }
  };
  /**
   * 初始化显示文本
   */
  var initShowTxt = function () {
    // 初始过关方式
    var initWay = normalWays[normalWays.length - 1];
    $("#" + initWay).addClass("click");
    $("#way_0").show();
    showCrossTxt();
  };
  /**
   * 显示过关方式文本
   */
  var showCrossTxt = function () {
    var txt = "", clicks = $(".ggbox .tabcontent .click");
    if (clicks.length) {
      clicks.each(function (i, item) {
        if (i != 0) {
          txt += ",";
        }
        txt += $(item).attr('id');
      });
    } else {
      txt = "";
    }
    $(".ggbox").data('passType', txt);
  };

  /**
   * 获取总注数
   */
  var getTotalBet = function () {
    totals = 0;
    var type = $(".ggbox").data('passType').split(",");
    if ('' != type) {
      // 胆数据
      var danNOs = {};
      var danBtn = $(".zckjTab .click");
      if (danBtn.length) {
        danBtn.each(function (i, item) {
          var matchId = $(item).closest("tr").attr("id").split("_")[1];
          danNOs[matchId] = matchId;
        });
      }
      var result = service.getBetsRelate(true, type, spArr, danNOs, timesUnit);
      //总注数
      totals = result.count;
      //最大奖金范围
      prizes.max = (result.max).toFixed(2);
      //最小奖金范围
      prizes.min = (result.min).toFixed(2);
    } else {
      //如果为选择过关方式,则清空最大最小金额
      prizes.max = "0.0";
      prizes.min = "0.0";
    }
  };

  /**
   * 获取最小最大奖金
   */
  var getMinMaxPrize = function () {
    $("#guessBonus").html(prizes.min + "~" + (prizes.max > 100000 ? "<br>" : "") + prizes.max);
  };

  /**
   * 胆显示
   * @param flag
   */
  var showDan = function (flag) {
    $(".zckjTab .dan").toggle(flag);
  };

  /**
   * 付款信息
   */
  var showPayInfo = function () {
    // 倍数
    $("#times").text(timesUnit);
    // 注数
    $("#totals").text(totals);

    pays = totals * price * timesUnit;
    // 总付款
    $("#pays").text(pays);
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    var $page = $('#wrapper');
    //fastclick events
    fastClick.attach(document);
    // 返回
    $page.on('click', '.back', function () {
      page.goBack();
    });
    // 协议
    $page.on('click', '.checked', function (e) {
      //获取选择的胆码..
      storeSelectedDan();
      page.init("protocol", {}, 1);
      return true;
    });
    // 胆
    $(".zckjTab").on('click', '.dan', function (e) {
      var $dan = $(e.currentTarget);
      // 最大胆数
      var danCount = $(".zckjTab").find('.click').length;
      var ways = $('.ggbox').data('passType').split(",");
      var prev = ways[0].split("-")[0];

      if (danCount == prev - 1 && !$dan.hasClass('click')) {
        page.toast("当前最多只能设" + danCount + "个胆");
      } else {
        $dan.toggleClass("click");
        if ($('#tab_0').hasClass("click")) {
          // 普通投注，需要过滤小于胆数的过关方式
          $("#way_0 a").show();
          var danCount = $(".dan.click").length;
          for (var i = 2; i < danCount + 1; i++) {
            $("#way_0 a[id^='" + i + "-']").hide();
          }
        }
        // 获取总注数
        getTotalBet();
        // 获取最小最大奖金
        getMinMaxPrize();
        // 显示付款信息
        showPayInfo();
      }
      return true;
    });

    // 倍数
    $("#timesUnit").on("keyup change", function (e) {
      this.value = this.value.replace(/\D/g, '');
      var $timesUnit = $(this);
      timesUnit = $timesUnit.val();
      if ($.trim(timesUnit) == "") {
        timesUnit = 0;
      } else {
        if ($.trim(timesUnit) != "" && (isNaN(timesUnit) || timesUnit < 1)) {
          timesUnit = 1;
          $timesUnit.val(1);
        } else if (timesUnit > 10000) {
          page.toast("亲，最多只能投10000倍哦");
          timesUnit = 10000;
          $timesUnit.val(10000);
        }
      }
      getTotalBet();
      // 获取最小最大奖金
      getMinMaxPrize();
      // 显示付款信息
      showPayInfo();
      return true;
    }).on("blur", function (e) {
      this.value = this.value.replace(/\D/g, '');
    });

    // 普通过关点击
    $('#way_0').on('click', 'a', function (e) {
      var $tar = $(e.currentTarget);
      if ($tar.hasClass("click")) {
        $tar.removeClass("click");
      } else {
        // 最多只能选5种过关方式
        var wayLen = $("#way_0 a.click").length;
        if (wayLen == 5) {
          page.toast("组合过关的方式最多选5种");
        } else {
          $tar.addClass("click");
        }
      }
      showCrossTxt();
      // 获取总注数
      getTotalBet();
      // 获取最小最大奖金
      getMinMaxPrize();
      // 显示付款信息
      showPayInfo();
    });

    // 多串过关点击
    $('#way_1').on('click', 'a', function (e) {
      var $tar = $(e.currentTarget);
      if ($tar.hasClass("click")) {
        $tar.removeClass("click");
      } else {
        $tar.addClass("click");
      }
      $tar.siblings().removeClass("click");
      showCrossTxt();
      // 获取总注数
      getTotalBet();
      // 获取最小最大奖金
      getMinMaxPrize();
      // 显示付款信息
      showPayInfo();

    });
    // tab 切换
    $('.tabopition').on('click', "span:not(.click)", function (e) {
      var $span = $(e.currentTarget);
      var tabId = $span.attr("id").split("_")[1];
      $span.addClass('click').siblings().removeClass('click');
      if (tabId == "0") {
        // 普通过关
        showDan(1);
        $("#way_0").show().next('div').hide();
      } else {
        // 多串过关
        showDan(0);
        $("#way_1").show().prev('div').hide();
      }
      $(".tabcontent a.click").removeClass("click");
      totals = 0;
      prizes.min = prizes.max = 0;
      showCrossTxt();
      // 获取最小最大奖金
      getMinMaxPrize();
      // 显示付款信息
      showPayInfo();
    });
    // 合买
    $("footer").on('click', '.btn1', function () {
      // 检查值
      !_.isEmpty(bufferData) && bufferData.matchBetList.length && checkVal() && toBuy();
      return true;
    });
    // 付款
    $("footer").on('click', '.btn2', function () {
      // 检查值
      !_.isEmpty(bufferData) && bufferData.matchBetList.length && checkVal() && toBuy();
      return true;
    });
  };

  /**
   * 检查有效值
   */
  var checkVal = function () {

    // 倍数
    var $timesUnit = $("#timesUnit");
    timesUnit = $timesUnit.val();

    if ($.trim(timesUnit) == "" || isNaN(timesUnit) || timesUnit < 1) {
      timesUnit = 0;
      page.toast("请至少选择 1 注");

      // 显示付款信息
      showPayInfo();
      return false;
    }

    var ways = $("#crossTxt").text();

    if (ways == "过关方式") {
      page.toast("请至少选择 1 注");
      return false;
    }
    return true;
  };

  /**
   * 获取购买参数
   */
  var getBuyParams = function () {
    var detailArr = [], matchArr = [], buySPArr = [], danArr = [];
    $(".zckjTab tr").each(function (i, item) {
      var $item = $(item);
      var mid = $item.attr("id").split("_");
      if (mid.length > 1) {
        // 赛事ID
        var matchId = mid[1];
        // SP 标示
        var spf = [], rqspf = [], zjq = [], bqc = [], bf = [], uad = [];
        // SP 值
        var spfV = [], rqspfV = [], zjqV = [], bqcV = [], bfV = [], uadV = [];
        $item.find(".bet-rs").each(function (j, p) {
          var spFlagV = $(p).attr("id").split("_");
          var spText = $(p).text();
          // li red id 格式..F20140305002_spf_3_1.81_-1
          if (spFlagV.length > 1) {
            switch (spFlagV[1]) {
              case "spf": // 胜负
                spf.push(spFlagV[2]); //3.1.0
                spfV.push(spFlagV[3]);//sp值..
                break;
              case "rqspf": // 让球胜负
                rqspf.push(spFlagV[2]);
                rqspfV.push(spFlagV[3]);
                break;
              case "zjq": // 大小分
                zjq.push(spFlagV[2]);
                zjqV.push(spFlagV[3]);
                break;
              case "bqc": // 胜分差
                bqc.push(spFlagV[2]);
                bqcV.push(spFlagV[3]);
                break;
              case  "bf":   //比分..
                bf.push(spFlagV[2]);
                bfV.push(spFlagV[3]);
                break;
              case 'uad'://上下盘
                uad.push(spFlagV[2] + '_' + spText);
                uadV.push(spFlagV[3]);
                break;
            }
          }
        });
        // 赛事编号
        matchArr.push(matchId);
        // 详情，SP值
        switch (titleFlag) {
          case "spf": // 胜负
            detailArr.push(matchId + ":" + spf.join(","));
            buySPArr.push(matchId + ":" + spf.join(","));
            break;
          case "rqspf": // 让球胜平负.
            detailArr.push(matchId + ":" + rqspf.join(","));
            buySPArr.push(matchId + ":" + rqspfV.join(","));
            break;
          case "zjq": // 总进球
            detailArr.push(matchId + ":" + zjq.join(","));
            buySPArr.push(matchId + ":" + zjqV.join(","));
            break;
          case "bqc": // 半全场
            detailArr.push(matchId + ":" + bqc.join(","));
            buySPArr.push(matchId + ":" + bfV.join(","));
            break;
          case "bf":   //  比分.
            detailArr.push(matchId + ":" + bf.join(","));
            buySPArr.push(matchId + ":" + bfV.join(","));
            break;
          case 'uad':
            var _spfOdds = '', _rqspfOdds = '', _spfResCode = '', _rqspfResCode = '';
            for (var i = 0, l = uad.length; i < l; i++) {
              if (-1 != uad[i].indexOf('让')) {
                _rqspfOdds = uadV[i];
                _rqspfResCode = -1 != uad[i].indexOf('胜') ? 3 : 0;
              } else {
                _spfOdds = uadV[i];
                _spfResCode = -1 != uad[i].indexOf('胜') ? 3 : 0;
              }
            }
            detailArr.push(matchId + ':' + _spfResCode + '||||' + _rqspfResCode);
            buySPArr.push(matchId + ':' + _spfOdds + '||||' + _rqspfOdds);
            break;
          case "mix": //   混投。
            detailArr.push(matchId + ":" + spf.join(",") + "|" + bf.join(",") + "|" + zjq.join(",") + "|" + bqc.join(",") + "|" + rqspf.join(","));
            buySPArr.push(matchId + ":" + spfV.join(",") + "|" + bfV.join(",") + "|" + zjqV.join(",") + "|" + bqcV.join(",") + "|" + rqspfV.join(","));
            break;
        }

        // 混投不能设胆
        if (titleFlag != "mix") {
          // 胆
          if ($item.find(".click").length) {
            danArr.push(matchId)
          }
        }
      }
    });
    // 投注方式
    return {
      detail: detailArr.join("\/"),
      matchIds: matchArr.join(","),
      buySP: buySPArr.join("\/"),
      danCount: danArr.length + "",
      dan: danArr.join(","),
      passway: $(".ggbox").data('passType')
    };
  };

  /**
   * 购买付款
   */
  var toBuy = function () {
    // 参数设置
    var params = {};
    params.issueNo = bufferData.issueNo; // 期号
    params.lotteryType = lotteryMap[titleFlag].lotteryId; //彩种
    // 获取投注参数
    var buyParams = getBuyParams();
    // 购买当期的详细信息
    params.detail = buyParams.detail;
    // 胆数
    params.danCount = buyParams.danCount;
    // 胆赛事ID
    params.dan = buyParams.dan;
    // 赛事ID
    params.matchIds = buyParams.matchIds;
    // SP值
    params.buySP = buyParams.buySP;
    // 过关方式
    params.passway = buyParams.passway;
    // 1 竞彩，2 单场
    params.passType = "1";

    params.playType = playType;
    // 理论最大奖金
    params.prevMoney = prizes.max;
    // 客户端默认1
    params.betType = "1";

    params.totalBet = totals + ""; // 总注数
    params.totalBei = timesUnit + ""; // 总倍数
    // 显示遮住层
    util.showCover();
    util.showLoading();
    // 请求接口
    service.toBuy("1", params, price, function (data) {
      // 隐藏遮住层
      util.hideCover();
      util.hideLoading();
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            result = data;
            page.answer($("#title").text() + " 投注成功", "编号:" + data.lotteryNo + "<br>" + "账号余额:" + data.userBalance + " 元", "查看方案", "确定", function () {
              page.init("jcz/result", {lotteryType: lotteryType, requestType: "0", projectId: result.projectId}, 0);
            }, function () {
              page.goBack();
            });
            // 删除选号记录
            util.clearLocalData(util.keyMap.LOCAL_JCZ);
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
  };
  /**
   * 进入合买页面
   */
  var goHm = function () {
    var params = getBuyParams();
    params.title = title;
    params.mode = mode;
    params.eachMoney = 1;
    params.issueNo = bufferData.issueNo; // 期号
    params.lotteryId = lotteryMap[titleFlag].lotteryId; //彩种
    // 1 竞彩，2 单场
    params.passType = "1";
    // 默认2，奖金优化10，上下盘12
    params.playType = playType;
    // 理论最大奖金
    params.prevMoney = prizes.max;
    // 客户端默认1
    params.betType = "1";

    params.totalBet = totals.toString(); // 总注数
    params.totalBei = timesUnit; // 总倍数
    params.projectCount = +totals * +timesUnit * +price;//方案总金额
    params.totalAmount = params.projectCount;
    console.log('-----', params.totalBei);
    util.setLocalJson(util.keyMap.LOCAL_TO_HM, params);
    page.init("jcl/hm", {}, 1);
  };
  /**
   * 显示遮盖层
   */
  var showLCover = function () {
    var bodyHeight = Math.max(document.documentElement.clientHeight, document.body.offsetHeight);
    var headerH = $(".iheader").height();
    $(".lCover").css({"height": (bodyHeight - headerH) + "px"}).show();
  };
  /**
   * 隐藏遮盖层
   */
  var hideLCover = function () {
    $(".lCover").hide();
  };
  /**
   * 模式映射
   * @type {Object}
   */
  var spModeMap = {
    // 胜平负
    "spf_0": {title: "胜", flag: "3"},
    "spf_1": {title: "平", flag: "1"},
    "spf_2": {title: "负", flag: "0"},

    //让球胜平负.
    "rqspf_1": {title: "让胜", flag: "3"},
    "rqspf_2": {title: "让平", flag: "1"},
    "rqspf_3": {title: "让负", flag: "0"},

    //总进球
    "zjq_0": {title: "0球", flag: "0"},
    "zjq_1": {title: "1球", flag: "1"},
    "zjq_2": {title: "2球", flag: "2"},
    "zjq_3": {title: "3球", flag: "3"},
    "zjq_4": {title: "4球", flag: "4"},
    "zjq_5": {title: "5球", flag: "5"},
    "zjq_6": {title: "6球", flag: "6"},
    "zjq_7": {title: "7球", flag: "7"},

    //半全场.
    "bqc_0": {title: "胜胜", flag: "s-s"},
    "bqc_1": {title: "胜平", flag: "s-p"},
    "bqc_2": {title: "胜负", flag: "s-f"},
    "bqc_3": {title: "平胜", flag: "p-s"},
    "bqc_4": {title: "平平", flag: "p-p"},
    "bqc_5": {title: "平负", flag: "p-f"},
    "bqc_6": {title: "负胜", flag: "f-s"},
    "bqc_7": {title: "负平", flag: "f-p"},
    "bqc_8": {title: "负负", flag: "f-f"},

    //比分
    "bf_0": {title: "1:0", flag: "1-0"},
    "bf_1": {title: "2:0", flag: "2-0"},
    "bf_2": {title: "2:1", flag: "2-1"},
    "bf_3": {title: "3:0", flag: "3-0"},
    "bf_4": {title: "3:1", flag: "3-1"},
    "bf_5": {title: "3:2", flag: "3-2"},
    "bf_6": {title: "4:0", flag: "4-0"},
    "bf_7": {title: "4:1", flag: "4-1"},
    "bf_8": {title: "4:2", flag: "4-2"},
    "bf_9": {title: "5:0", flag: "5-0"},
    "bf_10": {title: "5:1", flag: "5-1"},
    "bf_11": {title: "5:2", flag: "5-2"},
    "bf_12": {title: "胜其他", flag: "s-s"},//胜其他
    "bf_13": {title: "0:0", flag: "0-0"},
    "bf_14": {title: "1:1", flag: "1-1"},
    "bf_15": {title: "2:2", flag: "2-2"},
    "bf_16": {title: "3:3", flag: "3-3"},
    "bf_17": {title: "平其他", flag: "p-p"},//平其他
    "bf_18": {title: "0:1", flag: "0-1"},
    "bf_19": {title: "0:2", flag: "0-2"},
    "bf_20": {title: "1:2", flag: "1-2"},
    "bf_21": {title: "0:3", flag: "0-3"},
    "bf_22": {title: "1:3", flag: "1-3"},
    "bf_23": {title: "2:3", flag: "2-3"},
    "bf_24": {title: "0:4", flag: "0-4"},
    "bf_25": {title: "1:4", flag: "1-4"},
    "bf_26": {title: "2:4", flag: "2-4"},
    "bf_27": {title: "0:5", flag: "0-5"},
    "bf_28": {title: "1:5", flag: "1-5"},
    "bf_29": {title: "2:5", flag: "2-5"},
    "bf_30": {title: "负其他", flag: "f-f"} //负其他
  };

  /**
   * 不同投注方式对于的彩种
   * @type {Object}
   */
  var lotteryMap = {
    uad: {lotteryId: "52"},
    "spf": {lotteryId: "46"},    // 胜负
    "bf": {lotteryId: "47"},     // 比分
    "zjq": {lotteryId: "48"},   // 总进球
    "bqc": {lotteryId: "49"},   // 半全场
    "mix": {lotteryId: "52"},   //  混投
    "rqspf": {lotteryId: "56"}  // 让球胜平负
  };

  /**
   * 得到点击阅读协议之前选择的胆码,保存.
   */
  var storeSelectedDan = function () {
    selectedDan = [];
    var dan = $(".zckjTab .click");
    dan.each(function (i, item) {
      var targetId = $(item).closest(".dan").attr("id");
      selectedDan[targetId] = targetId;
    });
  };

  var getSelectedDan = function () {
    for (var v in selectedDan) {
      $("#" + v).addClass("click");
    }
  };
  return {init: init};
});