define(function (require, exports, module) {
  var page = require('page'),
    util = require('util'),
    $ = require('zepto'),
    template = require('../views/register.html'),
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
    page.setHistoryState({url: "register", data: params},
      "register",
      "#register" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
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
    $(".back").on("click", function (e) {
      if (canBack) {
        page.goBack();
      } else {
        page.init("home", {}, 0);
      }
      return true;
    });

    // 登录
    $(".pr0").on("click", function (e) {
      if (canBack && from == "login") {
        page.goBack();
      } else {
        page.init("login", {}, 1);
      }
      return true;
    });

    // 购彩协议
    $(".checked").on("click", function (e) {
      page.init("protocol", {}, 1);
      return true;
    });

    // 注册
    $(".loginbtn").on("click", function (e) {
      var username = $(".username").val();
      var password = $(".password").val();
      var nextpad = $(".nextpad").val();
      var checkbox = $(".checkbox").prop("checked");

      if (!checkbox) {
        page.toast("请同意直通车购彩协议");
        return false;
      }

      if ($.trim(username) === "") {
        page.toast("用户名不能为空");
        return false;
      }

      if ($.trim(username).length < 4 || $.trim(username).length > 50) {
        page.toast("用户名长度为4~50位字符");
        return false;
      }

      if ($.trim(password) === "") {
        page.toast("密码不能为空");
        return false;
      }

      if ($.trim(password).length < 6 || $.trim(password).length > 15) {
        page.toast("密码长度为6~15位字符");
        return false;
      }

      if ($.trim(nextpad) === "") {
        page.toast("确认密码不能为空");
        return false;
      }

      if ($.trim(password) != $.trim(nextpad)) {
        page.toast("确认密码与密码不一致");
        return false;
      }

      toRegister(username, password);
      return true;
    });
  };

  /**
   * 去注册
   * @param name
   * @param password
   */
  var toRegister = function (name, password) {
    util.showLoading();
    // 进行注册请求
    var request = accountService.goRegister($.trim(name), $.trim(password), function (data) {
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

            page.toast("注册成功");

            switch (from) {
              case "home":
                page.goBack();
                break;
              case "login":
                page.go(-2);
                break;
              case "":
                page.init("user/bindMobile", {}, 0);
                break;
            }
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          page.toast("注册失败");
        }
      } else {
        page.toast("注册失败");
      }
    });

    util.addAjaxRequest(request);
  };
  return {init: init};
});