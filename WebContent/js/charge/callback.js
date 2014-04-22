/**
 * 充值响应页面.
 */
define(function (require, exports, module) {

  var page = require('page'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      config = require('config'),
      digitService = require('services/digit'),
      template = require("/views/charge/callback.html");

  var canBack = 1;

  //服务器跳转传递来的参数,用来判断是哪种充值方式.{0:支付宝,1:财付通}

  var type = '';

  //结果{1:成功,0:失败}

  var result;

  //所有的充值方式汇总.

  var allChargeType = {};

  //token--充值页面保存,当前页面获取.

  var userInfo;

  // 是否登录
  var hasLogin = false;

  // 上期开奖Map
  var openLotMap = {};

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward;

    // 参数设置
    var params = {};

    //从后台,通过Response.sendRedirect(#charge/callback?type=1&result=1)方法传递.
    var browserParams = window.location.href;
    var obj1 = browserParams.match(/\Wtype=([a-zA-Z0-9]+)/);
    var obj2 = browserParams.match(/\Wresult=([a-zA-Z0-9]+)/);
    if (obj1 != null && obj1[1] != 'undefined' && obj2 != null && obj2[1] != 'undefined') {
      type = obj1[1];
      result = obj2[1];
      params.type = type;
      params.result = result;
    } else {
      //当刷新页面后,type,result保存在data对象中.
      var param = browserParams.split('?')[1];
      var obj3 = JSON.parse((util.unParam(decodeURIComponent(param))).data);
      if (obj3 != null && typeof obj3.type != 'undefined' && typeof obj3.result != 'undefined') {
        type = obj3.type;
        result = obj3.result;
        params.type = type;
        params.result = result;
      }
    }

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    if (userInfo.token) {
      params.token = userInfo.token;
      hasLogin = true;
    } else {
      hasLogin = false;
    }

    initShow();

    bindEvent();

    page.setHistoryState({url: "charge/callback", data: params},
        "charge/callback",
            "#charge/callback" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack ? 1 : 0);

    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    $("#container").html(template);

    displayResult();

    showCustomLott();

  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    // 返回
    $('.back,#toIndex_s,#toIndex_e').on('click', function (e) {
      //后退
      page.init('home', {"token": userInfo.token}, 0);
      return true;
    });

    $('.index').on('click',function (e) {
      var $target = $(e.target);
      var $a = $target.closest("a");
      var $gmButton = $target.closest(".gmButton");
      var $xq = $target.closest(".xq");
      if ($a.length || $gmButton.length) {
        // 进入彩种选号
        var $li = $target.closest("li");
        if ($li.length) {
          var key = $li.attr("id");
          // 进入二级页面
          goSubPage(key);
        }
      } else if ($xq.length) {
        // 上期开奖详情
        var $li = $target.closest("li");
        if ($li.length) {
          var key = $li.attr("id");
          showLottOpenInfo(key);
        }
      }
      return true;
    });

    //查看余额.
    $('#getBalance').on('click',function () {
      page.init('user/person', {"token":userInfo.token,"type":type,"result":result}, 1);
      return true;
    });

    //重新充值.

    $('#recharge').on('click', function (e) {
      page.init('charge/index', {"token": userInfo.token,"type":type,"result":result}, 1);
      return true;
    });
  };

  /**
   * 进入二级页面
   * @param key
   */
  var goSubPage = function (key) {
    switch (key) {
      case "login": // 登录
        page.init("login", {from: "home"}, 1);
        break;
      case "register": // 注册
        page.init("register", {from: "home"}, 1);
        break;
      case "center": // 个人中心
        page.init("user/person", {token: userInfo.token}, 1);
        break;
      case "record": // 购彩记录

        break;
      case "recharge": // 充值

        break;
      case "custom": // 我的定制
        // 去定制彩种页面
        page.init("cusLott", {token: userInfo.token}, 1);
        break;
      case "award": // 开奖信息
        page.init("openAll", {token: userInfo.token}, 1);
        break;
      case "hmHal": // 合买大厅

        break;
      case "ssq": // 双色球
      case "dlt": // 大乐透
      case "f3d": // 福彩3D
      case "pl3": // 排列三
      case "syx": // 11选5
      case "syy": // 十一运夺金
        // 彩种配置
        var lotConfig = config.lotteryMap[key];
        util.clearLocalData(lotConfig.localKey);//注意传0
        page.init(lotConfig.paths["ball"].js, {lot: lotConfig.key, token: userInfo.token},0);
        break;
      case "gjj": // 冠军竞猜
        var lotConfig = config.lotteryMap[key];
        util.clearLocalData(lotConfig.localKey);
        page.init("gjj/bet", {token: userInfo.token}, 0);
        break;
      case "jcl": // 竞彩篮球
        util.clearLocalData(util.keyMap.LOCAL_JCL);
        page.init('jcl/bet', {token: userInfo.token}, 0);
        break;
      case "jcz": // 竞彩足球
        util.clearLocalData(util.keyMap.LOCAL_JCZ);
        page.init('jcz/mix_bet', {token: userInfo.token}, 0);
        break;
    }
  };

  /**
   * 显示上期开奖信息
   * @param lot
   */
  var showLottOpenInfo = function (lot) {
    if (openLotMap[lot] !== null && typeof openLotMap[lot] != "undefined") {
      var $li = $("#" + lot), $openLot = $li.find(".openLot");

      // 已经存在，并在显示的状态，隐藏显示
      if ($openLot.length && $openLot.is(":visible")) {
        $openLot.hide();
        return false;
      }

      var data = openLotMap[lot];
      var lotteryId = data.lotteryId;
      var numbers = (data.winnumber != null && typeof data.winnumber != "undefined") ? data.winnumber.split(",") : [];
      var reds = [], blues = [];
      switch (lotteryId) {
        case "11": // 双色球
          if (numbers.length > 6) {
            reds = numbers.slice(0, 6);
            blues = numbers.slice(6, 7);
          } else {
            reds = numbers;
          }
          break;
        case "13": // 大乐透
          if (numbers.length > 6) {
            reds = numbers.slice(0, 5);
            blues = numbers.slice(5, 7);
          } else {
            reds = numbers;
          }
          break;
        case "12": // 福彩3D
          reds = numbers;
          break;
        case "4": // 排列3
          reds = numbers;
          break;
        case "34": // 11选5
          data.issueNo = data.issueNo.substring(8);
          reds = numbers;
          break;
        case "31": // 十一运夺金
          data.issueNo = data.issueNo.substring(8);
          reds = numbers;
          break;
      }
      data.reds = reds;
      data.blues = blues;

      // 删除原有已经存在的开奖信息
      $openLot.remove();
      // 创建节点
      var tmp = $("#openLotTpl").html();
      // compile our template
      var cmp = _.template(tmp);
      var $dl = $("<dl class='openLot tl'></dl>");

      $li.append($dl.html(cmp(data)));

      var lotConfig = config.lotteryMap[lot];
      if (lotConfig.hasLevels) {
        // 获取开奖等级信息
        getLottOpenLevel(lotteryId);
      }
    }
  };

  /**
   * 获取开奖等级信息
   * @param lotteryId
   */
  var getLottOpenLevel = function (lotteryId) {
    var request = digitService.getLotteryLevelByLotteryId(lotteryId, function (data) {
      if (typeof data != "undefined" && data != "" &&
          typeof data.lotteryId != "undefined" && data.lotteryId != "") {
        var key = config.lotteryIdToStr[data.lotteryId];
        var $openLot = $("#" + key).find(".openLot");
        if ($openLot.length) {
          var levels = data.data;
          if (typeof levels != "undefined" && levels.length) {
            var str = "";
            for (var i = 0; i < levels.length; i++) {
              var level = levels[i];
              str += "<p>" + level.awardtype + ": "
                  + level.awardbetnum + " 注" +
                  "&nbsp;&nbsp;&nbsp;&nbsp;" +
                  "<i class='cf60'>" + level.awardmoney + "元</i></p>";
            }
            $openLot.find(".min").html(str);
          }
        }
      }
    });
  };

  /**
   * 显示成功失败.
   */
  var displayResult = function () {
    var subItem = allChargeType[type];
    if (subItem != null && subItem != 'undefined') {
      if (result != 'undefined' && result != '') {
        if (result == '1') {
          $('#success').show();
        } else if (result == '0') {
          $('#error').show();
        }
      }
    }

  };

  /**
   * 显示定制彩种
   */
  var showCustomLott = function () {
    if (!hasLogin) {
      //showNoCustomLott(); show nothing
    } else {
      var customLott = util.getLocalString(util.keyMap.LOCAL_CUSTOM);
      if (customLott !== null && typeof customLott != "undefined" && $.trim(customLott) !== "") {
        var cusArr = []; // 定制列表
        var localArr = customLott.split(",");
        var lottMap = config.lotteryMap, lotsInfo = [];
        for (var i = 0; i < localArr.length; i++) {
          var item = lottMap[localArr[i]];
          cusArr.push(item);
          // 收集需要获取截止时间，奖池的彩种编号
          if (item.type === "digit" || item.type === "freq") {
            lotsInfo.push(item.lotteryId);
          }
        }
        // 显示定制彩种列表
        showLots(cusArr);

        // 数字彩还需要去获取截止时间，奖池
        if (lotsInfo.length) {
          getLotteryInfoByIds(lotsInfo);
        }
      } else {
        // showNoCustomLott();
      }
    }
  };

  /**
   * 获取彩票信息集合
   * @param arr
   */
  var getLotteryInfoByIds = function (arr) {
    var lotteryTypeArray = arr.join("|");
    var request = digitService.getLotteryInfoByLotteryIds(lotteryTypeArray, function (data) {
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode === "0") {
            var items = data.data;
            if (typeof items != "undefined" && items.length > 0) {
              for (var i = 0; i < items.length; i++) {
                var key = config.lotteryIdToStr[items[i].lotteryId];
                openLotMap[key] = items[i];

                var pool = 0, endTime = "";
                // 奖池
                if (items[i].bonuspoolAmount != null && typeof items[i].bonuspoolAmount != "undefined" &&
                    items[i].bonuspoolAmount != "") {
                  pool = items[i].bonuspoolAmount;
                }

                // 截止时间
                if (items[i].endTime != null && typeof items[i].endTime != "undefined" &&
                    items[i].endTime != "") {
                  endTime = items[i].endTime;
                }

                var $li = $("#" + key);
                $li.find(".pool").text(pool);
                $li.find(".endTime").text(endTime);
              }
            }
          }
        }
      }
    });
    util.addAjaxRequest(request);
  };

  /**
   * 显示彩种列表
   */
  var showLots = function (lots) {
    var tmp = $("#lotTpl").html();
    var cmp = _.template(tmp);
    var data = {};
    data.lots = lots;
    $("#main").html(cmp(data));
  };

  /**
   * 显示未登录或无定制彩种
   */
  var showNoCustomLott = function () {

    var tmp = $("#customNTpl").html();
    var cmp = _.template(tmp);

    var data = {};
    data.hasLogin = hasLogin;
    $("#main").html(cmp(data));

  };
  allChargeType = {
    "0": {"title": "支付宝WAP充值"},
    "1": {"title": "财付通WAP充值"}
  };

  return {init: init};

});