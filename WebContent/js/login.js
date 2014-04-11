define(function (require, exports, module) {
  var page = require('page'),
    events = require('events'),
    util = require('util'),
    $ = require('zepto'),
    _ = require('underscore'),
    template = require("../views/login.html"),
    accountService = require('services/account');
  var canBack = 1;
  // 来源
  var from = "";
  /**
   * 初始化
   */
  var init = function (data, forward) {
    canBack = forward || 0;

    // 参数设置
    from = "";
    var params = {};
    if (data !== null && typeof data != "undefined") {
      // 彩种
      if (typeof data.from != "undefined" && $.trim(data.from) !== "") {
        from = data.from;
      }
    }

    initShow();

    bindEvent();

    // 处理返回
    page.setHistoryState({url:"login", data:params},
      "login",
      "#login" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
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
   * 绑定事件
   */
  var bindEvent = function () {

    // 返回
    $(document).off(events.touchStart(), ".back, .pr0").
      on(events.touchStart(), ".back, .pr0", function (e) {
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

    // 注册
    $(document).off(events.activate(), ".pr0").
      on(events.activate(), ".pr0", function (e) {
        page.init("register", {from:"login"}, 1);
        return true;
      });

    // 登录
    $(document).off(events.click(), ".loginbtn").
      on(events.click(), ".loginbtn", function (e) {
        var name = $(".username").val();
        var password = $(".password").val();
        if ($.trim(name) === "") {
          page.toast("用户名不能为空");
          return false;
        }

        if ($.trim(password) === "") {
          page.toast("密码不能为空");
          return false;
        }

        toLogin(name, password);
        return true;
      });
  };

  /**
   * 去登录
   * @param name
   * @param password
   */
  var toLogin = function (name, password) {
    util.showLoading();
    // 进行登录请求
    var request = accountService.goLogin($.trim(name), $.trim(password), function (data) {
      util.hideLoading();
      console.log(JSON.stringify(data));
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {

            // 登录token
            util.token = new Date().getTime() + "";

            data.token = util.token;

            // 保存登录成功信息
            util.setLocalJson(util.keyMap.LOCAL_USER_INFO_KEY, data);
            page.toast("登录成功");
            if (canBack) {
              if (from === "home") {
                page.init("home", {from:"login"}, 0);
              } else {
                page.goBack();
              }
            } else {
              page.init("home", {}, 0);
            }
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          page.toast("登录失败");
        }
      } else {
        page.toast("登录失败");
      }
    });

    util.addAjaxRequest(request);
  };
  return {init:init};
});