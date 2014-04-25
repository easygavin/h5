/**
 * 合买大厅首页
 */
define(function (require, exports, module) {
  var page = require('page');
  var util = require('util');
  var $ = require('zepto');
  var _ = require('underscore');
  var hm = require('services/hm');
  var config = require('config');
  var template = require('/views/hm/index.html');

  var canBack = 1;

  //所有合买彩种.
  //1_胜负彩,4_排列3,5_任选9场,6_排列5,8_七星彩,11_双色球,12_福彩3D,13_大乐透,46_竞彩足球胜平负
  //47_竞彩足球比分,48_竞彩足球总进球,49_竞彩足球半全场,52_竞彩足球混投,56_竞彩足球让球胜平负
  //36_竞彩篮球胜负,37_竞彩篮球让分胜负,38_竞彩篮球胜分差,39_竞彩篮球大小分,53_竞彩蓝球混投
  //89_北单让球胜平负,92_北单比分

  //H5现支持彩种.
  var lotteryTypeArray = '4|6|8|11|12|13|46|47|48|49|52|56|36|37|38|39|53';

  // 请求彩种列表
  var typeArr = "";

  //页行数.
  var pagesize = 20;

  //查询方式｛percent:百分比,totalAmount:总金额｝
  var orderByName = 'percent';

  //排序方式{desc:升序,asc:降序}
  var orderBy = 'desc'; //默认desc

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

    params.lotteryTypeArray = typeArr;

    $("#container").html(template);

    bindEvent();

    //初始化数据查询.
    initQuery();

    // 处理返回
    page.setHistoryState({url : "hm/index", data : params}, "hm/index", "#hm/index" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""), canBack);
    // 隐藏加载标示
    util.hideLoading();
  };


  /**
   *初始化配置.
   */
  var initQuery = function () {

    requestPage = "1";

    showTitle();

    clearItems();

    getHmList();

  };

  /**
   * 获取合买列表.
   */
  var getHmList = function () {
    // 总页数重置
    pages = 0;
    // 显示加载图标
    loadingShow(1);
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
      //隐藏加载图标
      loadingShow(0);
    });
    util.addAjaxRequest(request)
  };

  var addItem = function (dataList) {
    pages = parseInt((parseInt(dataList.totalCount) + pagesize - 1) / pagesize, 10);
    if (parseInt(requestPage, 10) < pages) {
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
      } else if (cupCount == 0 && sunCount == 0 && starCount == 0 && silverCupCount == 0 && silverSunCount == 0 && silverStarCount == 0) {
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
   * 模版加载数据.
   * @param dataList
   */

  var addItem = function (dataList) {
    pages = parseInt((parseInt(dataList.totalCount) + pagesize - 1) / pagesize, 10);
    if (requestPage < pages) {
      $(".loadText").text("查看更多");
    } else {
      $(".loadText").text("");
    }
    require.async('/tpl/hm/hm_list',function(tpl){
      $(".bb1").html($('.bb1').html() + tpl({
        honour : honour,
        map : config.lotteryIdReflectStr,
        data : dataList
      }));
    });
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
      $(".loadIcon").css({"visibility" : "visible"});
    } else {
      $(".loadIcon").css({"visibility" : "hidden"});
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
      default :
        prepend ="全部";
        break;
    }
    $("#hmTitle").html(prepend);
  };

  /**
   * 下拉选项.
   */

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    $('.back').on('click', function () {
      offBind();
      page.goBack();
    });
    // 排序方式.
    $('.jltab li').on('click', function () {
      var targetId = $(this).attr("id");
      switch (targetId) {
        case "byPercent":
          orderByName = 'percent';
          orderBy = 'asc';
          break;
        case "byTotalAmount":
          orderByName = 'totalAmount';
          orderBy='desc';
          break;
      }
      requestPage = "1";
      clearItems();
      initQuery();
    });

    $('.bb1').on('click', 'tr', function () {
      offBind();
      var $target = $(this);
      var id = $target.find('a').attr('id').split('_');
      //{lotteryType-彩种id,projectId-方案id,requestType-查询类型{0购彩方案详情，1合买方案详情}}
      var lotteryType = id[1], projectId = id[2];
      page.init('hm/hmdetail', {"lotteryType" : lotteryType, "projectId" : projectId, "requestType" : "1"}, 1);
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

  return {init : init};
});