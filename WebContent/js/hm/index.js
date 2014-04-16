/**
 * 合买大厅首页
 */
define(function (require, exports, module) {

  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      hm = require('services/hm'),
      config = require('config'),
      fastClick = require('fastclick'),
      template = require("../../views/hm/index.html");

  var canBack = 1;

  //双色球(11)|福彩3D(12)|大乐透(13)|竞彩足球-胜平负(46)|竞彩足球-比分(47)|竞彩足球-总进球(48)
  //竞彩足球-半全场(49)|竞彩足球-混投(52)|竞彩足球-让球胜平负(56)|竞彩篮球-胜负(36)|竞彩篮球-让分胜负(37)
  //竞彩篮球-胜分差(38)|竞彩篮球-大小分(39)|竞彩篮球混投(53)|北单-让球胜平负(89)|北单-比分(92)
  // 暂时未有北单玩法.
  //11|12|13|46|47|48|49|52|56|36|37|38|39|53|89|92
  var lotteryTypeArray = '11|12|13|46|47|48|49|52|56|36|37|38|39|53';

  // 请求彩种列表
  var typeArr = "";

  //页行数.
  var pagesize = '20';

  //查询方式｛percent:百分比,money:总金额｝
  var orderByName = 'percent';

  //排序方式{desc:升序,asc:降序}
  var orderBy = 'desc';

  //请求页数
  var requestPage = 1;

  //数据列表.

  var dataList = {};

  //总页数.
  var pages = 0;

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward || 0;
    // 参数设置
    var params = {};
    // 彩种列表
    typeArr = data.lotteryTypeArray || lotteryTypeArray;
    // 返回后的Tab焦点与数据加载参数
    if (forward) {
      requestPage = "1";
    }
    params.lotteryTypeArray = typeArr;

    initShow();

    bindEvent();

    //初始化数据查询.
    initQuery();

    // 处理返回
    page.setHistoryState({url: "hm/index", data: params},
        "hm/index",
            "#hm/index" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack);

    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    $("#container").html(template);

  };

  /**
   *初始化配置.
   */
  var initQuery = function () {

    showTitle();

    clearItems();

    getHmList();

  };

  /**
   * 获取合买列表.
   */
  var getHmList = function () {
    // 显示加载图标
    loadingShow(1);
    console.log('requestPage: '+requestPage);
    var request = hm.getHmInfo(pagesize, orderBy, orderByName, typeArr, requestPage, function (data) {
      if (!_.isEmpty(data)) {
        if (typeof data.statusCode != 'undefined' && data.statusCode == '0') {
          dataList = data;
          addItem(dataList);
        } else {
          page.toast(data.errorMsg);
        }
      } else {
        page.toast('获取合买列表失败,请稍后重试');
      }
    });

    //隐藏加载图标
    loadingShow(0);

    util.addAjaxRequest(request);
  };

  /**
   * 模版加载数据.
   * @param dataList
   */

  var addItem = function (dataList) {
    console.log('totalCount: '+dataList.totalCount);
    pages = parseInt((parseInt(dataList.totalCount) + pagesize - 1) / pagesize);
    console.log('pages: '+pages);
    if (requestPage < pages) {
      $(".loadText").text("查看更多");
    } else {
      $(".loadText").text("");
    }
    var hm_list = require('/tpl/hm/hm_list');
    var list = $('.bb1').html();
    $(".bb1").html(list + hm_list({
      honour: honour,
      map: config.lotteryIdReflectStr,
      data: dataList
    }));
  };


  /**
   * 清空列表
   */
  var clearItems = function () {
    $(".bb1").empty();
  };

  /**
   * 加载图片的显示
   */
  var loadingShow = function (flag) {
    if (flag) {
      $(".loadIcon").css({"visibility":"visible"});
    } else {
      $(".loadIcon").css({"visibility":"hidden"});
    }
  };

  /**
   * 显示title信息
   */
  var showTitle = function () {
    var prepend = "";
    switch (typeArr) {
      case "11": // 双色球
        prepend = "双色球";
        break;
      case "13": // 大乐透
        prepend = "大乐透";
        break;
      case "12": // 福彩3D
        prepend = "福彩3D";
        break;
      case "14": // 幸运赛车
        prepend = "幸运赛车";
        break;
      case "46": // 竞彩足球胜平负
        prepend = "竞彩足球胜平负";
        break;
      case "47": // 竞彩足球比分
        prepend = "竞彩足球比分";
        break;
      case "48": // 竞彩足球总进球
        prepend = "竞彩足球总进球";
        break;
      case "49": // 竞彩足球半全场
        prepend = "竞彩足球半全场";
        break;
      case "52": // 竞彩足球混投
        prepend = "竞彩足球混投";
        break;
      case "56": // 竞彩足球让球胜平负
        prepend = "竞彩足球让球胜平负";
        break;
      case "36": // 竞彩蓝球胜负
        prepend = "竞彩蓝球胜负";
        break;
      case "37": // 竞彩蓝球让分胜负
        prepend = "竞彩蓝球让分胜负";
        break;
      case "38": // 竞彩蓝球胜分差
        prepend = "竞彩蓝球胜分差";
        break;
      case "39": // 竞彩蓝球大小分
        prepend = "竞彩蓝球大小分";
        break;
      case "53": // 竞彩蓝球混投
        prepend = "竞彩蓝球混投";
        break;
    }
    $("#hmTitle").html(prepend);
  };

  /**
   * 战绩
   * @param goldStarNum    金星数量.
   * @param silverstarnum  银星数量.
   */
  var honour = function (goldStarNum, silverstarnum) {
    var imgStr = '';
    var tmp = 0;
    if (parseInt(goldStarNum / 75) > 0) {
      // 皇冠
      imgStr = '<img style="width:7%" src="../../images/lm_1.png">';
    } else {
      // 得到直通杯
      var cupCount = parseInt(goldStarNum / 25);
      goldStarNum = goldStarNum % 25;
      // 得到金太阳
      var sunCount = parseInt(goldStarNum / 5);
      goldStarNum = goldStarNum % 5;
      // 得到金星
      var starCount = goldStarNum;
      // 得到银直通杯
      var silverCupCount = parseInt(silverstarnum / 25);
      silverstarnum = silverstarnum % 25;
      // 得到银太阳
      var silverSunCount = parseInt(silverstarnum / 5);
      silverstarnum = silverstarnum % 5;
      // 得到银星
      var silverStarCount = silverstarnum;
      if (cupCount > 0) {
        for (var a = 0; a < cupCount; a++) {
          // 添加直通杯
          if (tmp < 5) {
            imgStr += '<img  style="width:7%" src="../../images/lm_2.png">';
            tmp++;
          }
        }
      }
      if (sunCount > 0) {
        for (var b = 0; b < sunCount; b++) {
          // 添加金太阳
          if (tmp < 5) {
            imgStr += '<img  style="width:7%" src="../../images/lm_3.png">';
            tmp++;
          }
        }
      }

      if (starCount > 0) {
        for (var c = 0; c < starCount; c++) {
          // 添加金星
          if (tmp < 5) {
            imgStr += '<img style="width:7%" src="../../images/lm_4.png">';
            tmp++;
          }
        }
      } else if (cupCount == 0 && sunCount == 0 && starCount == 0
          && silverCupCount == 0 && silverSunCount == 0
          && silverStarCount == 0) {
        // 没有战绩
      }
      if (silverCupCount > 0) {
        for (var d = 0; d < silverCupCount; d++) {
          // 添加银直通杯
          if (tmp < 5) {
            imgStr += '<img style="width:7%" src="../../images/lm_2s.png">';
            tmp++;
          }
        }
      }
      if (silverSunCount > 0) {
        for (var e = 0; e < silverSunCount; e++) {
          // 添加银太阳
          if (tmp < 5) {
            imgStr += '<img style="width:7%" src="../../images/lm_3s.png">';
            tmp++;
          }
        }
      }
      if (silverStarCount > 0) {
        for (var f = 0; f < silverStarCount; f++) {
          // 添加银星
          if (tmp < 5) {
            imgStr += '<img style="width:7%" src="../../images/lm_4s.png">';
            tmp++;
          }
        }
      }
    }
    return imgStr;
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    fastClick.attach(document);

    $('.back').on('click', function () {
      offBind();
      page.goBack();
      return true;
    });

    // 排序方式.
    $('.jltab li').on('click', function () {
      var targetId = $(this).attr("id");
      switch (targetId) {
        case "byPercent":
          orderByName = 'percent';
          break;
        case "byMoney":
          orderByName = 'money';
          break;
      }

      requestPage ="1";

      clearItems();

      initQuery();

      return true;
    });

    $('.bb1 tr').on('click', function () {

      return true;
    });


    var timer = 0;
    $(window).on("scroll", function () {
      if (!timer) {
        timer = setTimeout(function () {
          checkScrollPosition();
          timer = 0;
        }, 250);
      }
    });
  };

  /**
   * 检查滚动的位置
   */
  var checkScrollPosition = function () {
    var distance = $(window).scrollTop() + $(window).height();
    if ($("#hmIndex").height() <= distance) {
      var intRequestPage = parseInt(requestPage, 10);
      if (intRequestPage < pages) {
        requestPage = (intRequestPage + 1) + "";
        getHmList();
      }
    }
  };

  /**
   * 解除绑定
   */
  var offBind = function () {
    $(window).off("scroll");
  };

  return {init: init};
});