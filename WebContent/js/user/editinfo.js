/**
 * 修改密码.
 */
define(function (require, exports, module) {
  var page = require('page'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      events = require('events'),
      account = require('services/account'),
      template = require('../../views/user/editinfo.html');

  // 处理返回参数
  var canBack = 0;

  //用户信息
  var userInfo;

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward ? 1 : 0;

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    initShow();

    bindEvent();

    // 参数设置
    var params = {};

    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    // 处理返回
    page.setHistoryState({url: "user/editinfo", data: params},
        "user/editinfo",
            "#user/editinfo" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        forward ? 1 : 0);
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    // compile our template
    var tmp = _.template(template);

    $("#container").empty().html(tmp());
  };

  /**
   * 修改昵称.
   */

  var updateNickName = function () {
    var nickName = $('#nickName').val();
    if (nickName == '' || nickName == null) {
      page.toast('请输入昵称');
      return false;
    }
    if (!_.isEmpty(userInfo) && userInfo.userKey) {
      var request = account.updateNickName(userInfo.userKey, nickName, function (data) {
        if (!_.isEmpty(data)) {
          if (typeof data.statusCode != 'undefined' && data.statusCode == '0') {
            page.toast('修改成功');
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          page.toast('修改失败,请稍后重试');
        }
      });
      util.addAjaxRequest(request);
    }
  };
  /**
   * 修改登录密码
   */
  var updateLoginPass = function () {
    var userId = userInfo.userId,
        userKey = userInfo.userKey;
    if (!userId || !userKey) {
      page.init('login', {}, 1);
      return false;
    }

    var oldLoginPass = $('#oldLoginPass').val();
    var newLoginPass = $('#newLoginPass').val();
    var confLoginPass = $('#confLoginPass').val();

    if ($.trim(oldLoginPass) == '' || oldLoginPass == null) {
      page.toast('请输入原登录密码');
      return false;
    }

    if ($.trim(newLoginPass) == '' || newLoginPass == null) {
      page.toast('请输入新登录密码');
      return false;
    } else if (newLoginPass.length <= 5 || newLoginPass.length > 15) {
      page.toast('密码由6-15位的数字或字母组成');
      return false;
    }
    if ($.trim(confLoginPass) == '' || confLoginPass == null) {
      page.toast('请确认登录密码');
      return false;
    } else if (confLoginPass.length <= 5 || confLoginPass.length > 15) {
      page.toast('确认密码由6-15位的数字或字母组成');
      return false;
    }
    if (newLoginPass != confLoginPass) {
      page.toast("新密码必须与确认密码一致");
      return false;
    }

    var request = account.editLoginPassword(userId, userKey, oldLoginPass, newLoginPass, function (data) {
      if (!_.isEmpty(data)) {
        if (typeof data.statusCode != 'undefined' && data.statusCode == '0') {
          page.toast('修改成功');
        } else {
          page.toast(data.errorMsg);
        }
      } else {
        page.toast('修改失败,请稍后重试');
      }
    });
    util.addAjaxRequest(request);
  };
  /**
   * 修改提款密码
   */
  var updateDrawPass = function () {
    var userId = userInfo.userId,
        userKey = userInfo.userKey;
    if (!userId || !userKey) {
      page.init('login', {}, 1);
      return false;
    }
    var oldPassword = $('#oldDrawalPass').val(),
        newPassword = $('#newDrawalPass').val(),
        confDrawalPass = $('#confDrawalPass').val();

    if (oldPassword == '') {
      page.toast('请输入原提款密码');
      return false;
    }
    if (newPassword == '') {
      page.toast('请输入新提款密码');
      return false;
    }
    if (confDrawalPass == '') {
      page.toast('请输入确认提款密码');
      return false;
    }
    if (newPassword != confDrawalPass) {
      page.toast('新密码与确认密码不一致');
      return false;
    }
    account.updateWithDrawal(userId, newPassword, oldPassword, function (data) {
      if (!_.isEmpty(data)) {
        if (typeof data.statusCode != 'undefined' && data.statusCode == '0') {
          page.toast('修改成功');
        } else {
          page.toast(data.errorMsg);
        }
      } else {
        page.toast('修改失败,请稍后重试');
      }
    });
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    // 返回
    $(document).off(events.touchStart(), ".back").on(events.touchStart(), ".back", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), ".back").on(events.activate(), ".back", function (e) {
      if (canBack) {
        page.goBack();
      } else {
        page.init("home", {}, 0);
      }
      return true;
    });

    // 修改信息.
    $(document).off(events.touchStart(), "#main button").on(events.touchStart(), "#main button", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), "#main button").on(events.activate(), "#main button", function (e) {
      var targetId = $(e.target).attr("id");
      switch (targetId) {
        //修改昵称.
        case 'setNickName':
          updateNickName();
          break;
        //修改登录密码.
        case 'setLoginPass':
          updateLoginPass();
          break;
        //修改提款密码
        case 'setDrawalPass':
          updateDrawPass();
          break;
      }
      return true;
    });
  };
  return {init: init};
});