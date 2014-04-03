/**
 * 首页
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    template = require("../views/home.html"),
    config = require('config'),
    path = require('path'),
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
  /**
   * 初始化
   */
  var init = function (data, forward) {
    canBack = forward;
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
    if (data != null && typeof data != "undefined"
      && typeof data.from != "undefined" && $.trim(data.from) != "") {
      from = data.from;
    }

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "home", data: params},
      "home",
      (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : "") + "#home",
      canBack ? 1 : 0);
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
    $(".homeTrans").removeClass("home_swipe")
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
                $("#short_alias").html(user.userName + " 余额：<i class='cf60'>" + (parseFloat(data.userBalance).toFixed(2)) + "</i>元");
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
      $(".bunner").css({"height": "8em"});
    } else {
      return false;
    }

    slider = null;
    $("#slides").empty();
    for (var i = 0, len = imageNotices.length; i < len; i++) {
      $("#slides").append("<img id='img_" + notices[i].noticeId + "' src='" + path.NOTICE_SERVER_URL + notices[i].htmlUrl + "' width='100%' class='notice' style='top:0;left:" + (i * 100) + "%;'>");
      $(".grayBg .next").append($("<dd></dd>"));
    }

    if (notices.length > 1) {
      require.async("tools/slider", function () {
        // 滑动
        slider = new Slider({items: $(".notice").toArray(), width: 100, duration: 300});
        // 轮播
        if (this.noticeTimer == null) {
          this.noticeTimer = setInterval(function () {
            $("#slides").trigger("swipeLeft");
          }, 3000);
        }
        itemFocus();
      });
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
   * 显示资讯列表
   */
  var showNoticeItems = function () {
    var tmp = $("#noticeTpl").html();

    // compile our template
    var cmp = _.template(tmp);
    var data = {};
    data.notices = notices;

    $("#main").html(cmp(data));
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    // 返回
    $(document).off(events.touchStart(), "#p_center").
      on(events.touchStart(), "#p_center", function (e) {
        page.Event.handleTapEvent(this, this, page.Event.activate(), e);
        return true;
      });

    $(document).off(events.activate(), "#p_center").
      on(events.activate(), "#p_center", function (e) {
        page.init("user/person", {}, 1);
        return true;
      });


    // 登录
    $(document).off(events.touchStart(), ".pr0").
      on(events.touchStart(), ".pr0", function (e) {
        events.handleTapEvent(e.target, e.target, events.activate(), e);
        return true;
      });

    $(document).off(events.activate(), ".pr0").
      on(events.activate(), ".pr0", function (e) {
        var id = e.target.id;
        if (id === "login") {
          page.init("login", {from: "home"}, 1);
        } else if (id === "register") {
          page.init("register", {from: "home"}, 1);
        }
        return true;
      });

    // 快捷图标
    $(document).off(events.touchStart(), ".return").
      on(events.touchStart(), ".return", function (e) {
        events.handleTapEvent(this, this, events.activate(), e);
        return true;
      });

    $(document).off(events.activate(), ".return").
      on(events.activate(), ".return", function (e) {
        var $html = $("html"),
          $slide = $(".side"),
          $home = $(".homeTrans");

        if ($html.hasClass("mm-opened")) {
          $home.removeClass("home_swipe").
            off("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd").
            on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function () {
              $html.removeClass("mm-opened");
              $(".side").hide();
            });
        } else {
          $html.addClass("mm-opened");
          $slide.show();
          $home.addClass("home_swipe").
            off("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd");
          showShortCutItems();
        }

        return true;
      });

    // 菜单点击
    $(document).off(events.tap(), "nav").
      on(events.tap(), "nav", function (e) {
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
        return true;
      });

    $(document).off(events.tap(), ".index").
      on(events.tap(), ".index", function (e) {
        var $target = $(e.target);
        var $a = $target.closest("a");
        var $gmButton = $target.closest(".gmButton");
        var $xq = $target.closest(".xq");
        if ($a.length || $gmButton.length) {
          // 进入彩种选号
          var $li = $target.closest("li");
          if ($li.length) {
            var key = $li.attr("id");
            switch (key) {
              case "ssq": // 双色球
              case "dlt": // 大乐透
              case "f3d": // 福彩3D
              case "pl3": // 排列三
              case "syx": // 十一选5
              case "syy": // 十一运夺金
                // 彩种配置
                var lotConfig = config.lotteryMap[key];
                util.clearLocalData(lotConfig.localKey);
                page.init(lotConfig.paths["ball"].js, {lot: lotConfig.key}, 1);
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

    // 显示未登录或无定制彩种
    $(document).off(events.tap(), ".czdz").
      on(events.tap(), ".czdz", function (e) {
        if (hasLogin) {
          // 去定制彩种页面
          page.init("cusLott", {}, 1);
        } else {
          // 登录
          page.init("login", {}, 1);
        }
        return true;
      });

    // 显示未登录或无定制彩种
    $(document).off(events.tap(), "#toLogin").
      on(events.tap(), "#toLogin", function (e) {
        // 登录
        page.init("login", {}, 1);
        return true;
      });

    // 快捷链接
    $(document).off(events.tap(), ".side").
      on(events.tap(), ".side", function (e) {
        var $li = $(e.target).closest("li");
        if ($li.length) {
          var key = $li.attr("id").split("_")[1];
          switch (key) {
            case "center": // 个人中心

              break;
            case "record": // 购彩记录

              break;
            case "recharge": // 充值

              break;
            case "custom": // 我的定制
              // 去定制彩种页面
              page.init("cusLott", {}, 1);
              break;
            case "digit": // 数字彩
            case "freq": // 高频彩
            case "athletics": // 竞彩
              var $ul = $li.find("ul");
              if ($ul.is(":visible")) {
                $ul.hide();
                $li.find("a").addClass("down").html("&#xf004;");
              } else {
                $ul.show();
                $li.find("a").addClass("up").html("&#xf005;");
              }
              break;
            case "ssq": // 双色球
            case "dlt": // 大乐透
            case "f3d": // 福彩3D
            case "pl3": // 排列三
            case "syy": // 十一运夺金
            case "syx": // 十一选五
              // 彩种配置
              var lotConfig = config.lotteryMap[key];
              util.clearLocalData(lotConfig.localKey);
              page.init(lotConfig.paths["ball"].js, {lot: lotConfig.key}, 1);
              break;
            case "gjj": // 冠军竞猜
            case "jcz": // 竞彩足球
            case "jcl": // 竞彩篮球

              break;
            case "info": // 资讯

              break;
            case "award": // 开奖信息
              page.init("openAll", {}, 1);
              break;
          }
        }
      });

    // 收起公告图片
    $(document).off(events.tap(), ".close").
      on(events.tap(), ".close", function (e) {
        clearInterval(this.noticeTimer);
        $(".bunner").css({"height": "0"});
        return true;
      });

    // 滑动公告
    $(document).off("swipeLeft", "#slides").
      on("swipeLeft", "#slides", function (e) {
        if (slider != null) {
          slider.next();
          itemFocus();
        }
        return true;
      });

    $(document).off("swipeRight", "#slides").
      on("swipeRight", "#slides", function (e) {
        if (slider != null) {
          slider.preview();
          itemFocus();
        }
        return true;
      });

    // 公告图片点击
    $(document).off(events.tap(), "#slides").
      on(events.tap(), "#slides", function (e) {
        var $img = $(e.target).closest("img");
        if ($img.length) {
          var noticeId = $img.attr("id").split("_")[1];
          if (typeof noticeId != "undefined" && $.trim(noticeId) != "") {
            page.init("notice/detail", {noticeId: noticeId}, 1);
          }
        }
        return true;
      });

    // 公告列表点击
    $(document).off(events.tap(), ".line30").
      on(events.tap(), ".line30", function (e) {
        var $tr = $(e.target).closest("tr");
        if ($tr.length) {
          var noticeId = $tr.attr("id").split("_")[1];
          if (typeof noticeId != "undefined" && $.trim(noticeId) != "") {
            page.init("notice/detail", {noticeId: noticeId}, 1);
          }
        }
        return true;
      });
  };
  module.exports = {init: init};
});