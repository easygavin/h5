/**
 * 修改密码.
 */
define(function (require, exports, module) {

  var page = require('page'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      account = require('services/account'),
      template = require('/views/user/editinfo.html');

  // 处理返回参数
  var canBack = 0;

  //用户信息
  var userInfo;

  //用户登录信息.
  var tkn;

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward ? 1 : 0;
    var params = {};
    tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    initShow();

    bindEvent();

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

    $("#container").html(template);
  };

  /**
   * 修改昵称.
   */

  /*  var updateNickName = function () {

   if (!tkn) {
   page.init("login", {}, 1);
   return false;
   }
   var nickName = $('#nickName').val();
   var pattern = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
   if (nickName == '' || nickName == null) {
   page.toast('请输入昵称');
   return false;
   } else if (nickName.length < 2 || nickName.length >= 10 ||pattern.test(nickName)) {
   page.toast('昵称应为长度2-10的中英文字母或数字组成');
   return false;
   }
   userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
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
   };*/
  /**
   * 修改登录密码
   */
  var updateLoginPass = function () {

    if (!tkn) {
      page.init("login", {}, 1);
      return false;
    }
    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
    var userId = userInfo.userId, userKey = userInfo.userKey;
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
      page.toast('新密码必须与确认密码一致');
      return false;
    }

    if (oldLoginPass == newLoginPass) {
      page.toast('新密码与原密码相同,修改失败');
      return false;
    }

    var request = account.editLoginPassword(userId, userKey, oldLoginPass, newLoginPass, function (data) {
      if (!_.isEmpty(data)) {
        if (typeof data.statusCode != 'undefined' && data.statusCode == '0') {
          page.toast('修改成功');
        }else if (data.statusCode == '-2' || data.errorMsg.indexOf('token失效') != -1) {
          page.answer("", "因长时间未进行操作,请重新登录", "登录", "取消",
              function (e) {
                page.init("login", {}, 1);
              },
              function (e) {
              });
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
   * 查询用户是否绑定银行.
   */
  var queryExistsBind = function () {

    if (!tkn) {
      page.init("login", {}, 1);
      return false;
    }
    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
    if (!_.isEmpty(userInfo) && userInfo.userId && userInfo.userKey) {
      var request = account.getUserBalance(1, userInfo.userId, userInfo.userKey, function (data) {
        if (!_.isEmpty(data) && typeof data.statusCode != 'undefined') {
          if (data.statusCode == '0') {
            updateDrawPass();
          }else if (data.statusCode == '-2' || data.errorMsg.indexOf('token失效') != -1) {
            page.answer("", "因长时间未进行操作,请重新登录", "登录", "取消",
                function (e) {
                  page.init("login", {}, 1);
                },
                function (e) {
                });
          }else if (data.statusCode == '0007') {
            page.toast('您尚未进行身份认证!');
            page.init('user/authenticate', {}, 1);
            return false;
          } else {
            page.toast('您尚未绑定银行卡!');
            page.init('user/bindBankCard', {}, 1);
            return false;
          }
        } else {
          page.toast('查询数据失败,请稍后重试');
          return false;
        }
      });
      util.addAjaxRequest(request);
    } else {
      page.init('login', {}, 1);
    }
  };

  /**
   * 修改提款密码
   */
  var updateDrawPass = function () {
    var userId = userInfo.userId, userKey = userInfo.userKey;
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
      page.toast('请确认提款密码');
      return false;
    }
    if (newPassword != confDrawalPass) {
      page.toast('新密码与确认密码不一致');
      return false;
    }

    if (oldPassword == newPassword) {
      page.toast('新密码与原密码相同,修改失败');
      return false;
    }
    var request = account.updateWithDrawal(userId, newPassword, oldPassword, function (data) {
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
   * 绑定事件
   */
  var bindEvent = function () {
    $('.back').on('click', function () {
      if (canBack) {
        page.goBack();
      } else {
        page.init("home", {}, 0);
      }
    });

    // 修改信息.

    $('#main').on('click', 'button', function (e) {
      var targetId = $(e.target).attr("id");
      switch (targetId) {
        /*        //修改昵称.
         case 'setNickName':
         updateNickName();
         break;*/
        //修改登录密码.
        case 'setLoginPass':
          updateLoginPass();
          break;
        //修改提款密码
        case 'setDrawalPass':
          queryExistsBind();
          break;
      }
    });
  };
  return {init: init};
});