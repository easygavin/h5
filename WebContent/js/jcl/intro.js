define(function (require, exports, module) {
  var page = require('page');
  var fastClick = require('fastclick');
  var util = require('util');
  var $ = require('zepto');
  var canBack = 1;
  var flag = "intro";
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
    }
    require.async('/views/athletics/jcl/intro.html', function (tpl) {
      //初始化显示
      $("#container").html(tpl);
      flag = "intro";
      showZone();
      bindEvent();
      // 处理返回
      page.setHistoryState({url: "jcl/intro", data: params}, "jcl/intro", '#jcl/intro' + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""), canBack ? 1 : 0);
      // 隐藏加载标示
      util.hideLoading();
    });
  };

  //显示区域
  var showZone = function () {
    $("#m_" + flag).addClass("click");
    $("#" + flag).show();
  };
  /**
   * 隐藏区域
   */
  var hideZone = function () {
    $("#m_" + flag).removeClass("click");
    $("#" + flag).hide();
  };
  /**
   * 绑定事件
   */
  var bindEvent = function () {
    fastClick.attach(document.body);
    // 返回
    $('.back').on('click', page.goBack);
    // 菜单切换
    $('.jsBox').on('click', function (e) {
      var $target = $(e.target);
      var $a = null;
      if (e.target.tagName.toLocaleLowerCase() === "a") {
        $a = $target;
      } else {
        $a = $target.find("a");
      }
      if ($a.length && !$a.hasClass("click")) {
        hideZone();
        flag = $a.attr("id").split("_")[1];
        showZone();
      }
    });
  };
  return {init: init};
});