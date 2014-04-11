/**
 * 定制彩种
 */
define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    template = require("../views/cusLott.html"),
    config = require('config');

  var canBack = 1;

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
    } else {
      // 未登录状态
      page.init("home", {}, 0);
    }

    initShow();
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "cusLott", data: params},
      "cusLott",
      "#cusLott" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
      canBack);

    // 隐藏加载标示
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {
    $("#container").html(template);

    var cusArr = []; // 定制列表
    var noCusArr = []; // 非定制列表

    var customLott = util.getLocalString(util.keyMap.LOCAL_CUSTOM);
    var localArr = [];
    if (customLott !== null && typeof customLott != "undefined" && $.trim(customLott) !== "") {
      localArr = customLott.split(",");
    }

    var lottMap = config.lotteryMap;
    for (var i = 0; i < localArr.length; i++ ) {
      cusArr.push(lottMap[localArr[i]]);
    }

    for(var l in lottMap) {
      console.log("key:" + lottMap[l].key);
      var isContains = _.contains(localArr, lottMap[l].key);
      if (!isContains) {
        noCusArr.push(lottMap[l]);
      }
    }

    if (cusArr.length) {
      for(var i = 0, iLen = cusArr.length; i < iLen; i++) {
        showCusLott(cusArr[i]);
      }
    }

    if (noCusArr.length) {
      for(var j = 0, jLen = noCusArr.length; j < jLen; j++) {
        showNoCusLott(noCusArr[j]);
      }
    }

  };

  /**
   * 显示定制彩种
   * @param item
   */
  var showCusLott = function (item) {
    var str = "";
    str += "<div class='cabox'><img src='" + item.logo + "'/></div>";
    str += "<p>" + item.name + "</p>";

    var $li = $("<li></li>").attr("id", "c_" + item.key).html(str);

    $("#custom_lott").append($li);
  };

  /**
   * 显示非定制彩种
   * @param item
   */
  var showNoCusLott = function (item) {
    var $a = $("<a></a>").attr("id", "n_" + item.key).html(item.name);
    $("#no_custom_lott").append($a);
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    // 返回
    $(document).off(events.touchStart(), ".back").
      on(events.touchStart(), ".back", function (e) {
        events.handleTapEvent(this, this, events.activate(), e);
        return true;
      });

    $(document).off(events.activate(), ".back").
      on(events.activate(), ".back", function (e) {
        if (canBack) {
          page.goBack();
        } else {
          page.init("home", {}, 0);
        }
        return true;
      });

    // 删除
    $(document).off(events.tap(), "#custom_lott").
      on(events.tap(), "#custom_lott", function (e) {
        var $li = $(e.target).closest("li");
        if ($li.length) {
          var key = $li.attr("id").split("_")[1];
          var itemMap = config.lotteryMap[key];

          // 删除
          $li.remove();

          // 添加
          showNoCusLott(itemMap);

          // 保存用户定制彩种
          saveCustomLott();
        }
        return true;
      });

    // 添加
    $(document).off(events.tap(), "#no_custom_lott").
      on(events.tap(), "#no_custom_lott", function (e) {
        var $a = $(e.target).closest("a");
        if ($a.length) {
          var key = $a.attr("id").split("_")[1];
          var itemMap = config.lotteryMap[key];

          // 删除
          $a.remove();

          // 添加
          showCusLott(itemMap);

          // 保存用户定制彩种
          saveCustomLott();
        }
        return true;
      });
  };

  /**
   * 保存用户定制彩种
   */
  var saveCustomLott = function () {
    var lottArr = [];
    $("#custom_lott li").each(function (index, item) {
      var key = item.id.split("_")[1];
      lottArr.push(key);
    });

    util.setLocalString(util.keyMap.LOCAL_CUSTOM, lottArr.length > 0 ? lottArr.toString() : "");
  };

  return {init: init};
});