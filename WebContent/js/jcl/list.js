/**
 * 竞彩篮球列表
 */
define(function (require, exports, module) {
  var view = require('/views/athletics/buy.html');
  var page = require('page');
  var util = require('util');
  var fastClick = require('fastclick');
  var service = require('services/jcl');

  // 彩种
  var lotteryType = "36";
  var title = "竞篮";
  var mode = '0';
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
  var types = [];

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

  // 奖金
  var prizes = null;
  /**
   * 初始化
   */
  var init = function (data, forward) {
    // 加载模板内容
    $("#container").html(view);

    // 参数设置
    var params = {};
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    // 初始化显示
    initShow(data, forward);

    // 绑定事件
    bindEvent();

    // 处理返回
    page.setHistoryState({url : "jcl/list", data : {}}, "jcl/list", (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#jcl/list", forward ? 1 : 0);

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
    bufferData = util.getLocalJson(util.keyMap.LOCAL_JCL);
    showTitle();
    // 显示投注列表
    showItems();

    // 获取过关方式
    getCrossWayArr();

    // 初始化显示文本
    initShowTxt();

    // 获取总注数
    getTotalBet();

    // 获取最小最大奖金
    getMinMaxPrize();

    // 显示付款信息
    showPayInfo();
  };
  /**
   * 显示标题
   */
  var showTitle = function () {
    types = [];
    var count = 0;
    titleFlag = "";
    var _title = '竞篮'
    if (bufferData != null && typeof bufferData != "undefined" && bufferData.matchBetList != null && typeof bufferData.matchBetList != "undefined" && bufferData.matchBetList.length) {
      for (var t in bufferData.titleMap) {
        count++;
        titleFlag = t;
        types.push(t);
      }
      if (count == 1) {
        switch (titleFlag) {
          case "sf":
            _title += "胜负";
            break;
          case "rfsf":
            _title += "让分胜负";
            break;
          case "dxf":
            _title += "大小分";
            break;
          case "sfc":
            _title += "胜分差";
            break;
        }
      } else {
        _title += "混合投注";
        titleFlag = "mix";
      }
    }
    $("#title").text(_title);
  };
  /**
   * 显示投注列表
   */
  var showItems = function () {
    optArr = {}, spArr = {};
    totals = 0, pays = 0, result = {}, price = 2;
    $(".zckjTab tbody").empty();
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
    var $tr = $('<tr id="m_' + matchId + '" align="left"></tr>');
    var str = "";
    var teams = match.playAgainst.split("|");
    str += "<td>" + match.number + "&nbsp;&nbsp;" + teams[0] + "&nbsp;&nbsp;" + match.spDatas.rfsf.split(',')[0] + "&nbsp;&nbsp;" + teams[1] + "<p class='cf60'>";
    // 胜负, 让分胜负, 大小分, 胜负差
    var sfIds = item.sfIds, rfsfIds = item.rfsfIds, dxfIds = item.dxfIds, sfcIds = item.sfcIds, spCount = 0;
    // 收集SP值数组
    var itemSPArr = [];
    var agcgArr = [];
    if (sfIds.length) {
      spCount += sfIds.length;
      for (var i = 0, len = sfIds.length; i < len; i++) {
        var sp = handleSPValue(sfIds[i], match);
        itemSPArr.push(sp);
        agcgArr.push(1);
        mode = spModeMap[sfIds[i]];
        str += "<span id='sf_" + mode.flag + "|" + sp + "'>" + mode.title + "</span>&nbsp;&nbsp;";
      }
    }
    if (rfsfIds.length) {
      spCount += rfsfIds.length;
      for (var i = 0, len = rfsfIds.length; i < len; i++) {

        var sp = handleSPValue(rfsfIds[i], match);
        itemSPArr.push(sp);
        agcgArr.push(2);

        mode = spModeMap[rfsfIds[i]];
        str += "<span id='rfsf_" + mode.flag + "|" + sp + "'>" + mode.title + "</span>&nbsp;&nbsp;";
      }
    }

    if (dxfIds.length) {
      spCount += dxfIds.length;
      for (var i = 0, len = dxfIds.length; i < len; i++) {

        var sp = handleSPValue(dxfIds[i], match);
        itemSPArr.push(sp);
        agcgArr.push(3);

        mode = spModeMap[dxfIds[i]];
        str += "<span id='dxf_" + mode.flag + "|" + sp + "'>" + mode.title + "</span>&nbsp;&nbsp;";
      }
    }

    if (sfcIds.length) {
      spCount += sfcIds.length;
      for (var i = 0, len = sfcIds.length; i < len; i++) {
        var sp = handleSPValue(sfcIds[i], match);
        itemSPArr.push(sp);
        agcgArr.push(4);
        mode = spModeMap[sfcIds[i]];
        str += "<span id='sfc_" + mode.flag + "|" + sp + "'>" + mode.title + "</span>&nbsp;&nbsp;";
      }
    }

    // 赛事数据
    optArr[matchId] = spCount;
    agcg[matchId] = agcgArr;

    // SP值排序
    itemSPArr.sort(service.asc);
    // 保存SP数组
    spArr[matchId] = itemSPArr;
    str += "</p></td>";
    // 竞彩篮球混投无胆
    str += "<td>";
    str += (titleFlag != "mix" ? "<a class='dan'>胆</a>" : "&nbsp;");
    str += "</td>";
    $tr.html(str);
    $(".zckjTab tbody").append($tr);
  };

  /**
   * 处理SP值
   * @param spWayIndex
   * @param match
   */
  var handleSPValue = function (spWayIndex, match) {
    var spWayIndexArr = spWayIndex.split("_");
    var sp = "0";
    if (spWayIndexArr.length > 1) {
      var spWay = spWayIndexArr[0];
      var index = parseInt(spWayIndexArr[1], 10);
      var spDatas = match.spDatas;
      switch (spWay) {
        case "sf": // 胜负
          var sf = spDatas.sf.split(",");
          sp = sf[index];
          break;
        case "rfsf": // 让分胜负
          var rfsf = spDatas.rfsf.split(",");
          sp = rfsf[index];
          break;
        case "dxf": // 大小分
          var dxf = spDatas.dxf.split(",");
          sp = dxf[index];
          break;
        case "sfc": // 胜负差
          var sfc = spDatas.sfc.split(",");
          sp = sfc[index];
          break;
      }
    }
    return sp;
  };
  /**
   * 获取过关方式
   */
  var getCrossWayArr = function () {
    normalWays = [] , manyWays = [];
    if (bufferData != null && typeof bufferData != "undefined" && bufferData.matchBetList != null && typeof bufferData.matchBetList != "undefined" && bufferData.matchBetList.length) {
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
      if (titleFlag != "mix") {
        // 多串过关
        manyWays = service.getManyWay(matchLen, types);
        if (manyWays.length > 0) {
          for (var i = 0, len = manyWays.length; i < len; i++) {
            $("#way_1").append("<a id='" + manyWays[i] + "'>" + manyWays[i].replace('-', '串') + "</a>");
          }
          $('#tab_1').show();
        }
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
        txt += $(item).text().replace(/串/g, '-');
      });
    } else {
      txt = "过关方式";
    }
    $(".ggbox").data('passType', txt);
  };

  /**
   * 获取总注数
   */
  var getTotalBet = function () {
    totals = 0;
    var type = $(".ggbox").data('passType').split(",");
    // 胆数据
    var danNOs = {};
    var danBtn = $(".zckjTab .click");
    if (danBtn.length) {
      danBtn.each(function (i, item) {
        var matchId = $(item).closest("tr").attr("id").split("_")[1];
        danNOs[matchId] = matchId;
      });
    }
    totals = service.getBetByCrossWay(type, optArr, danNOs);
  };

  /**
   * 获取最小最大奖金
   */
  var getMinMaxPrize = function () {
    var type = $(".ggbox").data('passType').split(",");
    console.log(type.toString());

    prizes = {
      min : "0.00",
      max : "0.00"
    };

    if (type != "过关方式") {
      // 胆数据
      var danNOs = {};
      var danBtn = $(".zckjTab .click");
      if (danBtn.length) {
        danBtn.each(function (i, item) {
          var matchId = $(item).closest("tr").attr("id").split("_")[1];
          danNOs[matchId] = matchId;
        });
      }
      if (titleFlag == "mix") {
        prizes = service.getMixMinMaxPrize(type, optArr, spArr, agcg, timesUnit);
      } else {
        prizes = service.getMinMaxPrize(type, optArr, danNOs, spArr, timesUnit);
      }
    }
    $("#guessBonus").html("奖金:" + prizes.min + "~" + (prizes.max > 10000 ? "<br>" : "") + prizes.max);
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


  var hideCrossBox = function () {
    $(".ggbox").hide();
    hideLCover();
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    fastClick.attach(document.body);
    // 返回
    $('.back').on('click', page.goBack);
    // 购彩协议
    $('.checked').on('click', function () {
      page.init('protocol', {}, 1);
    });
    // 胆
    $('.dan').on('click', function (e) {
      var $dan = $(e.currentTarget);
      // 最大胆数
      var danCount = $(".dan.click").length;
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
    });
    // 倍数
    $('#timesUnit').on('change keyup', function () {
      $(this).value = this.value.replace(/\D/g, '');
      var $timesUnit = $(this);
      timesUnit = $timesUnit.val();
      if ($.trim(timesUnit) == "") {
        timesUnit = 0;
      } else {
        if ($.trim(timesUnit) != "" && (isNaN(timesUnit) || timesUnit < 1)) {
          timesUnit = 1;
          $timesUnit.val(1);
        } else if (timesUnit > 999) {
          page.toast("亲，最多只能投999倍哦");
          timesUnit = 999;
          $timesUnit.val(999);
        }
      }
      // 获取最小最大奖金
      getMinMaxPrize();
      // 显示付款信息
      showPayInfo();
      return true;
    });

    // 关闭显示层
    $('.lCover').on('click', hideCrossBox);

    // tab 切换
    $('.tabopition').on('click', 'span:not(.click)', function (e) {
      var $span = $(e.currentTarget);
      var tabId = $span.attr("id").split("_")[1];
      $span.addClass('click').siblings().removeClass('click');
      if (tabId == "0") {
        // 普通过关
        showDan(1);
        $("#way_0").show().next('div').hide();
        // 清除多串过关焦点
        $("#way_1 a").removeClass("click");
      } else {
        // 多串过关
        showDan(0);
        $("#way_1").show().prev('div').hide();
        // 清除普通过关焦点
        $("#way_0 a").removeClass("click");
      }
      showCrossTxt();
      // 获取总注数
      getTotalBet();
      // 获取最小最大奖金
      getMinMaxPrize();
      // 显示付款信息
      showPayInfo();
    });

    // 普通过关点击
    $("#way_0").on('click', function (e) {
      var $passType = $(e.target).closest("a");
      if ($passType.length) {
        if ($passType.hasClass("click")) {
          $passType.removeClass("click");
        } else {
          // 最多只能选5种过关方式
          var wayLen = $("#way_0 .click").length;
          if (wayLen == 5) {
            util.toast("组合过关的方式最多选5种");
          } else {
            $passType.addClass("click");
          }
        }
        showCrossTxt();
        // 获取总注数
        getTotalBet();
        // 获取最小最大奖金
        getMinMaxPrize();
        // 显示付款信息
        showPayInfo();
      }
      return true;
    });
    // 多串过关点击
    $("#way_1").on('click', function (e) {
      var $passType = $(e.target).closest("a");
      if ($passType.length) {
        if ($passType.hasClass("click")) {
          $passType.removeClass("click");
        } else {
          $passType.addClass("click");
        }
        $passType.siblings().removeClass("click");
        showCrossTxt();
        // 获取总注数
        getTotalBet();
        // 获取最小最大奖金
        getMinMaxPrize();
        // 显示付款信息
        showPayInfo();
      }
      return true;
    });
    //合买
    $('.btn1').on('click', function () {
      // 检查值
      if (bufferData != null && typeof bufferData != "undefined" && bufferData.matchBetList != null && typeof bufferData.matchBetList != "undefined" && bufferData.matchBetList.length && checkVal()) {
        // 合买
        goHm();
      }
    });
    // 付款
    $('.btn2').on('click', function () {
      // 检查值
      if (bufferData != null && typeof bufferData != "undefined" && bufferData.matchBetList != null && typeof bufferData.matchBetList != "undefined" && bufferData.matchBetList.length && checkVal()) {
        // 购买
        toBuy();
      }
    });
  };

  /**
   * 检查有效值
   */
  var checkVal = function () {
    if (!$("#protocol").attr("checked")) {
      page.toast("请勾选同意合买代购协议!");
      return false;
    }
    // 倍数
    var $timesUnit = $("#timesUnit");
    timesUnit = $timesUnit.val();
    if ($.trim(timesUnit) == "" || isNaN(timesUnit) || timesUnit < 1) {
      timesUnit = 0;
      util.toast("请至少选择 1 注");

      // 获取最小最大奖金
      getMinMaxPrize();
      // 显示付款信息
      showPayInfo();
      return false;
    }
    var ways = $('.ggbox').data('passType');
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
        var sf = [], rfsf = [], sfc = [], dxf = [];
        // SP 值
        var sfV = [], rfsfV = [], sfcV = [], dxfV = [];
        $item.find("span").each(function (j, p) {
          var spFlagV = $(p).attr("id").split("_");
          if (spFlagV.length > 1) {
            var flagV = spFlagV[1].split("|");
            switch (spFlagV[0]) {
              case "sf": // 胜负
                sf.push(flagV[0]);
                sfV.push(flagV[1]);
                break;
              case "rfsf": // 让分胜负
                rfsf.push(flagV[0]);
                rfsfV.push(flagV[1]);
                break;
              case "dxf": // 大小分
                dxf.push(flagV[0]);
                dxfV.push(flagV[1]);
                break;
              case "sfc": // 胜分差
                sfc.push(flagV[0]);
                sfcV.push(flagV[1]);
                break;
            }
          }
        });

        // 赛事编号
        matchArr.push(matchId);
        // 详情，SP值
        switch (titleFlag) {
          case "sf": // 胜负
            detailArr.push(matchId + ":" + sf.join(","));
            buySPArr.push(matchId + ":" + sfV.join(","));
            break;
          case "rfsf": // 让分胜负
            detailArr.push(matchId + ":" + rfsf.join(","));
            buySPArr.push(matchId + ":" + rfsfV.join(","));
            break;
          case "dxf": // 大小分
            detailArr.push(matchId + ":" + dxf.join(","));
            buySPArr.push(matchId + ":" + dxfV.join(","));
            break;
          case "sfc": // 胜分差
            detailArr.push(matchId + ":" + sfc.join(","));
            buySPArr.push(matchId + ":" + sfcV.join(","));
            break;
          case "mix": // 混投
            detailArr.push(matchId + ":" + sf.join(",") + "|" + rfsf.join(",") + "|" + sfc.join(",") + "|" + dxf.join(","));
            buySPArr.push(matchId + ":" + sfV.join(",") + "|" + rfsfV.join(",") + "|" + sfcV.join(",") + "|" + dxfV.join(","));
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
    var passway = $('.ggbox').data('passType');
    return {
      detail : detailArr.join("\/"),
      matchIds : matchArr.join(","),
      buySP : buySPArr.join("\/"),
      danCount : danArr.length + "",
      dan : danArr.join(","),
      passway : passway
    };
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

    params.lotteryType = lotteryMap[titleFlag].lotteryId; //彩种
    // 1 竞彩，2 单场
    params.passType = "1";
    // 默认2，奖金优化10，上下盘12
    params.playType = "2";
    // 理论最大奖金
    params.prevMoney = prizes.max;
    // 客户端默认1
    params.betType = "1";

    params.totalBet = totals.toString(); // 总注数
    params.totalBei = timesUnit; // 总倍数
    params.projectCount = +totals * +timesUnit * +price;//方案总金额
    params.totalAmount = params.projectCount.toString();
    util.setLocalJson(util.keyMap.LOCAL_TO_HM, params);
    page.init("jcl/hm", {}, 1);
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
    // 默认2，奖金优化10，上下盘12
    params.playType = "2";
    // 理论最大奖金
    params.prevMoney = prizes.max;
    // 客户端默认1
    params.betType = "1";

    params.totalBet = totals + ""; // 总注数
    params.totalBei = timesUnit + ""; // 总倍数
    params.totalAmount = totals * timesUnit * price;//方案总金额
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
          if (data.statusCode == 0) {
            result = data;
            page.answer($("#title").text() + " 投注成功", "编号:" + data.lotteryNo + "<br>" + "账号余额:" + data.userBalance + " 元", "查看方案", "确定", function () {
              page.init("jcl/result", { lotteryType : lotteryType, requestType : "0", projectId : result.projectId}, 0);
            }, function (e) {
              page.goBack();
            });
            // 删除选号记录
            util.clearLocalData(util.keyMap.LOCAL_JCL);

          } else {
            page.codeHandler(data);
          }
        } else {
          util.toast("投注失败");
        }
      } else {
        util.toast("投注失败");
      }
    });
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
    "sf_0" : {title : "主胜", flag : "3"},
    "sf_1" : {title : "客胜", flag : "0"},
    "rfsf_1" : {title : "让分主胜", flag : "3"},
    "rfsf_2" : {title : "让分客胜", flag : "0"},
    "dxf_1" : {title : "大分", flag : "3"},
    "dxf_2" : {title : "小分", flag : "0"},
    "sfc_0" : {title : "主胜1-5分", flag : "h1-5"},
    "sfc_1" : {title : "主胜6-10分", flag : "h6-10"},
    "sfc_2" : {title : "主胜11-15分", flag : "h11-15"},
    "sfc_3" : {title : "主胜16-20分", flag : "h16-20"},
    "sfc_4" : {title : "主胜21-25分", flag : "h21-25"},
    "sfc_5" : {title : "主胜26+分", flag : "h26"},
    "sfc_6" : {title : "客胜1-5分", flag : "v1-5"},
    "sfc_7" : {title : "客胜6-10分", flag : "v6-10"},
    "sfc_8" : {title : "客胜11-15分", flag : "v11-15"},
    "sfc_9" : {title : "客胜16-20分", flag : "v16-20"},
    "sfc_10" : {title : "客胜21-25分", flag : "v21-25"},
    "sfc_11" : {title : "客胜26+分", flag : "v26"}
  };

  /**
   * 不同投注方式对于的彩种
   * @type {Object}
   */
  var lotteryMap = {
    "sf" : {lotteryId : "36"}, // 胜负
    "rfsf" : {lotteryId : "37"}, // 让分胜负
    "sfc" : {lotteryId : "38"}, // 胜分差
    "dxf" : {lotteryId : "39"}, // 大小分
    "mix" : {lotteryId : "53"} // 混投
  };

  return {init : init};
});