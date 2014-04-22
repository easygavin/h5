/**
 * 首页
 */
define(function (require, exports, module) {
  var page = require('page'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    template = require("/views/home.html"),
    config = require('config'), path = require('path'),
    digitService = require('services/digit');

  var canBack = 1;
  // 是否登录
  var hasLogin = false;
  // 资讯列表
  var notices = [];
  // 图片资讯列表
  var imageNotices = [];
  // 图片滑动控件
  var slider = null;
  // 公告图片轮播定时器
  var noticeTimer = null;
  // 焦点菜单
  var menuId = "";
  // 登录返回
  var from = "";
  // 上期开奖Map
  var openLotMap = {};
  // 公告开关
  var noticeSwitch = 1;
  /**
   * 初始化
   */
  var init = function (data, forward) {
    canBack = forward || 0;
    // 参数设置
    var params = {};
    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
      hasLogin = true;
    } else {
      hasLogin = false;
    }

    // 来源
    if (data != null && typeof data != "undefined" && typeof data.from != "undefined" && $.trim(data.from) != "") {
      from = data.from;
    }

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "home", data: params}, "home", "#home" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""), canBack);
    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").html(template);

    // 功能栏初始化
    slideInit();
    // 显示工具条
    showBar();
    // 显示菜单
    showMenu();
    // 显示焦点菜单内容
    showMenuContent();
    // 获取资讯信息
    getNotices();
  };

  /**
   * 功能栏初始化
   */
  var slideInit = function () {
    $("html").removeClass("mm-opened");
    $(".homeTrans").removeClass("home_swipe");
  };

  /**
   * 显示工具条
   */
  var showBar = function () {
    var tmp = $("#barTpl").html();
    // compile our template
    var cmp = _.template(tmp);
    var data = {};
    // 登录状态
    data.hasLogin = hasLogin;
    $(".pr0").html(cmp(data));
  };

  /**
   * 显示菜单
   */
  var showMenu = function () {
    var tmp = $("#menuTpl").html();
    // compile our template
    var cmp = _.template(tmp);
    var data = {};
    data.menus = config.menus;
    // 焦点菜单
    if (from === "login") {
      data.menus.def = "custom";
    } else if (menuId !== "") {
      data.menus.def = menuId;
    }
    $("nav ul").html(cmp(data));
  };

  /**
   * 显示焦点菜单内容
   */
  var showMenuContent = function () {
    // 焦点菜单
    menuId = $("nav .focus").closest("li").attr("id");
    if (menuId === "digit" || menuId === "athletics" || menuId === "freq") {
      // 彩票
      var menusLottery = config.menusLottery[menuId];
      var lots = [], lotsInfo = [];
      for (var i = 0; i < menusLottery.length; i++) {
        var item = config.lotteryMap[menusLottery[i]];
        lots.push(item);

        // 收集需要获取截止时间，奖池的彩种编号
        if (item.type === "digit" || item.type === "freq") {
          lotsInfo.push(item.lotteryId);
        }
      }
      // 显示彩种列表
      showLots(lots);

      // 数字彩还需要去获取截止时间，奖池
      if (lotsInfo.length) {
        getLotteryInfoByIds(lotsInfo);
      }
    } else if (menuId === "custom") {
      // 定制
      showCustomLott();
    } else if (menuId === "info") {
      // 资讯
      showNoticeItems();
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
                if (items[i].bonuspoolAmount != null && typeof items[i].bonuspoolAmount != "undefined" && items[i].bonuspoolAmount != "") {
                  pool = items[i].bonuspoolAmount;
                }

                // 截止时间
                if (items[i].endTime != null && typeof items[i].endTime != "undefined" && items[i].endTime != "") {
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
   * 显示上期开奖信息
   * @param lot
   */
  var showLottOpenInfo = function (lot) {
    var data = openLotMap[lot];
    if (data !== null && typeof data != "undefined") {
      var $li = $("#" + lot), $openLot = $li.find(".openLot");

      // 已经存在，并在显示的状态，隐藏显示
      if ($openLot.length && $openLot.is(":visible")) {
        $openLot.hide();
        return false;
      }

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
          data.issueNo = data.issueNo.length > 8 ? data.issueNo.substring(8) : data.issueNo;
          reds = numbers;
          break;
        case "31": // 十一运夺金
          data.issueNo = data.issueNo.length > 8 ? data.issueNo.substring(8) : data.issueNo;
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
      if (typeof data != "undefined" && data != "" && typeof data.lotteryId != "undefined" && data.lotteryId != "") {
        var key = config.lotteryIdToStr[data.lotteryId];
        var $openLot = $("#" + key).find(".openLot");
        if ($openLot.length) {
          var levels = data.data;
          if (typeof levels != "undefined" && levels.length) {
            var str = "";
            for (var i = 0; i < levels.length; i++) {
              var level = levels[i];
              str += "<p>" + level.awardtype + ": " + level.awardbetnum + " 注" + "&nbsp;&nbsp;&nbsp;&nbsp;" + "<i class='cf60'>" + level.awardmoney + "元</i></p>";
            }
            $openLot.find(".min").html(str);
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
    // compile our template
    var cmp = _.template(tmp);
    var data = {};
    data.lots = lots;
    $("#main").html(cmp(data));
  };

  /**
   * 显示定制彩种
   */
  var showCustomLott = function () {
    if (!hasLogin) {
      showNoCustomLott();
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
        showNoCustomLott();
      }
    }
  };

  /**
   * 显示未登录或无定制彩种
   */
  var showNoCustomLott = function () {
    var tmp = $("#customNTpl").html();
    // compile our template
    var cmp = _.template(tmp);
    var data = {};
    data.hasLogin = hasLogin;
    $("#main").html(cmp(data));
  };

  /**
   * 快捷方式的初始显示
   */
  var showShortCutItems = function () {
    if (util.checkLogin(null)) {
      // 登录状态
      $(".hidden").show();

      // 保存登录成功信息
      var user = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

      // 查询余额
      require.async("services/account", function (accountService) {
        var request = accountService.getUserBalance("0", user.userId, user.userKey, function (data) {
          if (typeof data != "undefined") {
            if (typeof data.statusCode != "undefined") {
              if (data.statusCode == "0") {
                $("#short_alias").html(user.userName + " <br>余额：<i class='cf60'>" + (parseFloat(data.userBalance).toFixed(2)) + "</i>元");
              }
            }
          }
        });
        util.addAjaxRequest(request);
      });
      $("#short_alias").html(user.userName);
    } else {
      $(".hidden").hide();
    }
  };

  /**
   * 获取资讯信息
   */
  var getNotices = function () {
    // 查询余额
    require.async("services/notice", function (noticeService) {
      var request = noticeService.getNoticeList(function (data) {
        if (typeof data != "undefined") {
          if (typeof data.statusCode != "undefined") {
            if (data.statusCode == "0") {
              showNoticeImages(data.noticeArray);
            }
          }
        }
      });
      util.addAjaxRequest(request);
    });
  };

  /**
   * 显示公告列表
   * @param data
   */
  var showNoticeImages = function (data) {
    notices = [], imageNotices = [];
    for (var i = 0, len = data.length; i < len; i++) {
      if ($.trim(data[i].htmlUrl) != "") {
        imageNotices.push(data[i]);
      }
      notices.push(data[i]);
    }

    if (imageNotices.length) {
      handleSlider();
    }
  };

  /**
   * 处理图片滑动
   */
  var handleSlider = function () {
    slider = null;
    $("#slides").empty();
    for (var i = 0, len = imageNotices.length; i < len; i++) {
      $("#slides").append("<img id='img_" + notices[i].noticeId + "' src='" + path.NOTICE_SERVER_URL + notices[i].htmlUrl + "' width='100%' class='notice' style='top:0;left:" + (i * 100) + "%;'>");
    }

    if (imageNotices.length > 1) {
      require.async("tools/slider", function () {
        // 滑动
        slider = new Slider({items: $(".notice").toArray(), width: 100, duration: 300});
        switchFlashShow();
        itemFocus();
      });
    }
  }

  /**
   * 开关公告显示
   */
  var switchFlashShow = function () {
    if (noticeSwitch) {
      // 开启
      $(".close").html("&#xf005;");
      if (imageNotices.length) {
        $(".bunner").css({"height": "8em"});
        if (imageNotices.length > 1) {
          // 轮播
          if (this.noticeTimer == null) {
            this.noticeTimer = setInterval(function () {
              $("#slides").trigger("swipeLeft");
            }, 3000);
          }
        }
      }
    } else {
      // 关闭
      $(".close").html("&#xf004;");
      if (imageNotices.length) {
        $(".bunner").css({"height": "1.5em"});
        if (this.noticeTimer != null) {
          clearInterval(this.noticeTimer);
          this.noticeTimer = null;
        }
      }
    }
  };

  /**
   * 图片焦点小按钮
   */
  var itemFocus = function () {
    var index = slider == null ? 0 : slider.getIndex();
    $(".grayBg .title").text(imageNotices[index].title);
  };

  /**
   * 滑动图片的详情
   */
  var toFlashDetail = function () {
    var index = slider == null ? 0 : slider.getIndex();
    if (imageNotices.length) {
      var noticeId = imageNotices[index].noticeId;

      if (typeof noticeId != "undefined" && $.trim(noticeId) != "") {
        page.init("notice/detail", {noticeId: noticeId}, 1);
      }
    }
  };

  /**
   * 显示资讯列表
   */
  var showNoticeItems = function () {
    var tmp = $("#noticeTpl").html();
    // compile our template
    var cmp = _.template(tmp);
    var data = {};
    data.notices = notices;
    // 设置文字显示内容
    for (var i = 0, len = data.notices.length; i < len; i++) {
      if (typeof data.notices[i].lotteryId != "undefined" && data.notices[i].lotteryId != "") {
        var lottId = data.notices[i].lotteryId, key = config.lotteryIdToStr[lottId];
        var lotConfig = config.lotteryMap[key];
        data.notices[i].lottName = lotConfig.name;
        switch (lotConfig.type) {
          case "digit":
            data.notices[i].type = "数字彩";
            break;
          case "freq":
            data.notices[i].type = "高频彩";
            break;
          case "jc":
            data.notices[i].type = "竞彩";
            break;
        }
      } else {
        data.notices[i].lottName = "资讯";
        data.notices[i].type = "资讯";
      }
    }
    $("#main").html(cmp(data));
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
        page.init("user/person", {}, 1);
        break;
      case "record": // 购彩记录
        page.init("user/buyRecord", {}, 1);
        break;
      case "recharge": // 充值
        page.init("charge/index", {}, 1);
        break;
      case "custom": // 我的定制
        // 去定制彩种页面
        page.init("cusLott", {}, 1);
        break;
      case "award": // 开奖信息
        page.init("openAll", {}, 1);
        break;
      case "hmHal": // 合买大厅
        page.init("hm/index", {}, 1);
        break;
      case "ssq": // 双色球
      case "dlt": // 大乐透
      case "f3d": // 福彩3D
      case "pl3": // 排列三
      case "syx": // 11选5
      case "syy": // 十一运夺金
        // 彩种配置
        var lotConfig = config.lotteryMap[key];
        util.clearLocalData(lotConfig.localKey);
        page.init(lotConfig.paths["ball"].js, {lot: lotConfig.key}, 1);
        break;
      case "gjj": // 冠军竞猜
        var lotConfig = config.lotteryMap[key];
        util.clearLocalData(lotConfig.localKey);
        page.init("gjj/bet", {}, 1);
        break;
      case "jcl": // 竞彩篮球
        util.clearLocalData(util.keyMap.LOCAL_JCL);
        page.init('jcl/bet', {}, 1);
        break;
      case "jcz": // 竞彩足球
        util.clearLocalData(util.keyMap.LOCAL_JCZ);
        page.init('jcz/mix_bet', {}, 1);
        break;
    }
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    // 个人中心
    $("#p_center").on('click', function () {
      goSubPage("center");
    });
    // 登录
    $("#login").on('click', function () {
      goSubPage("login");
    });
    // 注册
    $("#register").on('click', function () {
      goSubPage("register");
    });
    // 快捷图标
    $(".return").on('click', function () {
      var $html = $("html"), $slide = $(".side"), $home = $(".homeTrans");
      if ($html.hasClass("mm-opened")) {
        $home.removeClass("home_swipe").off("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function () {
          $html.removeClass("mm-opened");
          $(".side").hide();
        });
      } else {
        $html.addClass("mm-opened");
        $slide.show();
        $home.addClass("home_swipe").off("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd");
        showShortCutItems();
      }
    });

    // 菜单点击
    $("nav").on('click', function (e) {
      var $li = $(e.target).closest("li");
      if ($li.length) {
        var $a = $li.find("a");
        if (!$a.hasClass("focus")) {
          $("nav a").removeClass("focus");
          $a.addClass("focus");
          // 显示焦点菜单内容
          showMenuContent();
        }
      }
    });

    $('#main').on('click', ".index", function (e) {
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
    });
    // 显示未登录或无定制彩种
    $('#main').on('click', ".czdz", function () {
      goSubPage(hasLogin ? 'custom' : 'login');
    });

    // 显示未登录或无定制彩种
    $('#main').on('click', "#toLogin", function () {
      // 登录
      goSubPage("login");
    });

    // 快捷链接
    $(".side").on('click', function (e) {
      var $li = $(e.target).closest("li");
      if ($li.length) {
        var key = $li.attr("id").split("_")[1];
        if (key == "digit" || key == "freq" || key == "athletics") {
          var $ul = $li.find("ul");
          if ($ul.is(":visible")) {
            $ul.hide();
            $li.find("a").addClass("down").html("&#xf004;");
          } else {
            $ul.show();
            $li.find("a").addClass("up").html("&#xf005;");
          }
        } else {
          // 进入二级页面
          goSubPage(key);
        }
      }
    });

    // 收起公告图片
    $(".grayBg").on('click', function (e) {
      var $target = $(e.target);
      if ($target.hasClass("close")) {
        noticeSwitch = noticeSwitch ? 0 : 1;
        switchFlashShow();
      } else {
        toFlashDetail();
      }
    });

    // 滑动公告
    $("#slides").on("swipeLeft", function () {
      if (slider != null) {
        slider.next();
        itemFocus();
      }
    });

    $("#slides").on("swipeRight", function () {
      if (slider != null) {
        slider.preview();
        itemFocus();
      }
    });

    // 公告图片点击
    $("#slides").on('click', function (e) {
      toFlashDetail();
    });

    // 公告列表点击
    $('#main').on('click', ".zx_list", function (e) {
      var $li = $(e.target).closest("li");
      if ($li.length) {
        var noticeId = $li.attr("id").split("_")[1];
        if (typeof noticeId != "undefined" && $.trim(noticeId) != "") {
          page.init("notice/detail", {noticeId: noticeId}, 1);
        }
      }
    });
  };
  module.exports = {init: init};
});