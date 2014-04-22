/**
 * 竞彩足球方案详情
 */
define(function (require, exports, module) {
  var view = require('/views/athletics/result.html');
  var _ = require('underscore');
  var page = require('page');
  var service = require('services/jcz');
  var util = require('util');
  // 彩种
  var lotteryType = "";
  // 请求方式
  var requestType = "";
  // 方案编号
  var projectId = "";
  //回退
  var backNum = -1;
  /**
   * 初始化
   */
  var init = function (data, forward) {
    // 加载模板内容
    $("#container").html(view);
    if (data != null && typeof data != "undefined") {
      // 彩种
      if (typeof data.lotteryType != "undefined" && $.trim(data.lotteryType) != "") {
        lotteryType = data.lotteryType;
      }
      // 请求方式
      if (typeof data.requestType != "undefined" && $.trim(data.requestType) != "") {
        requestType = data.requestType;
      }
      // 方案编号
      if (typeof data.projectId != "undefined" && $.trim(data.projectId) != "") {
        projectId = data.projectId;
      }
      if(data.backNum){
        backNum = data.backNum;
      }
    }
    // 参数设置
    var params = {};
    if ($.trim(lotteryType) != "") {
      params.lotteryType = lotteryType;
    }
    if ($.trim(requestType) != "") {
      params.requestType = requestType;
    }
    if ($.trim(projectId) != "") {
      params.projectId = projectId;
    }

    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }
    getResult();

    // 绑定事件
    bindEvent();

    // 处理返回
    page.setHistoryState({url: "jcz/result", data: params}, "jcz/result", "#jcz/result" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""), forward ? 1 : 0);
  };

  /**
   * 获取方案详情
   */
  var getResult = function () {
    service.getProjectDetails(lotteryType, requestType, projectId, function (data) {
      // 隐藏加载标示
      util.hideLoading();
      if (typeof data != "undefined") {
        if (typeof data.statusCode != "undefined") {
          if (data.statusCode == "0") {
            require.async('/tpl/athletics/result', function (tpl) {
              $('#main').html(tpl(data));
              $(".tzBox").text($.trim(data.title) + "投注");
            });
          } else if (data.statusCode == "off") {
            page.init("login", {}, 1);
          } else {
            page.toast(data['errorMsg']);
          }
        }
      }
    });
  };
  /**
   * 绑定事件
   */
  var bindEvent = function () {
    // 返回
    $(".back").on('click', function(){
      page.go(backNum);
    });
    // 去投注
    $(".tzBox").on('click', function () {
      // 删除缓存的购买数据
      util.clearLocalData(util.keyMap.LOCAL_JCZ);
      page.init("jcz/mix_bet", {}, 1);
    });
  };
  return {init: init};
});