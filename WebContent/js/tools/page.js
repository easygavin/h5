/**
 * page 页面处理
 */
define(function (require, exports, module) {
  var $ = require('zepto'),
    util = require('util'),
    events = require('events');
  var Page = {
    pages: []
  };
  // toast 定时器
  var TOAST_TIMER = null;

  /**
   * 启动页面
   * @param url js 加载文件地址
   * @param data 初始化页面数据
   * @param forward 1:重新进入页面，0:替换当前页面
   */
  Page.init = function (url, data, forward) {
    util.showLoading();
    require.async(url, function (page) {
      // 隐藏残留层
      util.hideCover();
      $(".dialog").hide();
      $(".prompt").hide();
      // 清除上一页面的所有Ajax请求处理
      util.clearAjaxRequests();
      page.init(data, forward);
      // 重置滚动条
      window.scrollTo(0, 1);
    });

  };

  /**
   * 设置浏览记录
   * @param state 状态信息
   * @param title 标题
   * @param name 记录的地址参数名
   * @param type 1:新建地址，0:替换当前地址
   */
  Page.setHistoryState = function (state, title, name, type) {
    if (window.history.pushState) {
      if (type === 0) {
        window.history.replaceState(state, title, name);
      } else {
        window.history.pushState(state, title, name);
      }
    } else {
      if (type !== 0) {
        this.pages.push({state: state, title: title, name: name});
      }
    }
  };

  //返回
  Page.goBack = function () {
    if (window.history.pushState) {
      window.history.go(-1);
    } else {
      if (this.pages.length > 0) {
        var pageName = "", pageData = {};
        if (this.pages.length == 1) {
          pageName = "#home";
        } else {
          var pager = this.pages[this.pages.length - 2];
          pageName = pager.state.url;
          pageData = pager.state.data;
        }
        this.init(pageName, pageData, 0);
        this.pages.pop();
      } else {
        window.history.go(-1);
      }
    }
  };

  /**
   * 返回 步骤处理
   * @param step 步骤
   */
  Page.go = function (step) {
    if (window.history.pushState) {
      window.history.go(step);
    } else {
      if (this.pages.length > 0) {
        var pageName = "", pageData = {};
        if (this.pages.length == 1) {
          pageName = "#home";
        } else {
          var pager = this.pages[this.pages.length - (step + 1)];
          pageName = pager.state.url;
          pageData = pager.state.data;
        }
        this.init(pageName, pageData, 0);
        this.pages.splice(this.pages.length - (step + 1), step);
      } else {
        window.history.go(step);
      }
    }
  };

  /**
   * 显示toast
   * @param title
   */
  Page.toast = function (title) {
    $(".toast").text(title).
      off("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd").
      addClass("itoast");
    clearTimeout(TOAST_TIMER);
    TOAST_TIMER = setTimeout(function () {
      $(".toast").removeClass("itoast").
        off("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd").
        on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function () {
          $(".toast").text("");
        });
    }, 1500);
  };

  /**
   * 提示框
   * @param title
   * @param ctx
   * @param button
   * @param callback
   */
  Page.dialog = function (title, ctx, button, callback) {
    if ($.trim(title) === "") {
      $(".dialog .tit").hide();
    } else {
      $(".dialog .tit").text(title).show();
    }
    $(".dialog .cxt").html(ctx);
    var $btn = $("#dialog_l");
    $btn.text(button);
    $btn.off(events.touchStart()).off(events.activate());
    $btn.on(events.touchStart(),function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    }).on(events.activate(), function (e) {
        util.hideCover();
        $(".dialog").hide();
        callback(e);
      });
    util.showCover();
    $(".dialog").show();
  };

  /**
   * 对话框
   * @param title
   * @param ctx
   * @param l_btn
   * @param r_btn
   * @param l_callback
   * @param r_callback
   */
  Page.answer = function (title, ctx, l_btn, r_btn, l_callback, r_callback) {
    if ($.trim(title) === "") {
      $(".prompt .tit").hide();
    } else {
      $(".prompt .tit").text(title).show();
    }

    $(".prompt .cxt").html(ctx);
    var $l_btn = $("#prompt_l"), $r_btn = $("#prompt_r");
    $l_btn.text(l_btn);
    $r_btn.text(r_btn);

    $l_btn.off(events.touchStart()).off(events.activate());
    $r_btn.off(events.touchStart()).off(events.activate());

    $l_btn.on(events.touchStart(),function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    }).on(events.activate(), function (e) {
        util.hideCover();
        $(".prompt").hide();
        l_callback(e);
      });

    $r_btn.on(events.touchStart(),function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    }).on(events.activate(), function (e) {
        util.hideCover();
        $(".prompt").hide();
        r_callback(e);
      });

    util.showCover();
    $(".prompt").show();
  };
  /**
   * 代码号统一处理
   * @param data
   */
  Page.codeHandler = function (data) {
    var self = this;
    if (data.statusCode == "0008") {
      // 余额不足
      self.answer("", "账号余额不足，请充值后重试", "去充值", "取消",
        function (e) {
          self.init("user/abccharge", {}, 1);
        },
        function (e) {
        }
      );
    } else if (data.statusCode == "0007") {
      // 用户信息不完善
      self.answer("", "用户信息不完善,请完善资料", "去完善", "取消",
        function (e) {
          self.init("user/authenticate", {}, 1);
        },
        function (e) {
        }
      );
    } else if (data.statusCode == "off") {
      // 尚未登录，弹出提示框
      self.answer("", "您还未登录，请先登录", "登录", "取消",
        function (e) {
          self.init("login", {}, 1);
        },
        function (e) {
        }
      );
    } else {
      self.toast(data.errorMsg);
    }
  };
  module.exports = Page;
});