/**
 * 数字彩服务
 */
define(function (require, exports, module) {

  var path = require('path'),
    util = require('util');

  /**
   * 获取冠军竞猜对阵列表
   * @param event
   * @param issueNo
   * @param callback
   * @returns {*}
   */
  var getMatchList = function (event, issueNo, callback) {

    var data = {
      event: event,
      issueNo: issueNo
    };

    // 请求登录
    var request = $.ajax({
      type: "GET",
      url: path.GJJ_GET_MATCH_LIST,
      data: data,
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 获取冠军竞猜对阵列表
   * @param project
   * @param callback
   * @returns {*}
   */
  var toBuy = function (project, callback) {

    if (!util.checkLogin(null)) {
      // 尚未登录
      callback({statusCode: "off"});
      return false;
    }

    // 保存登录成功信息
    var user = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    // 请求参数
    var data = {};
    data["project.buysp"] = project.buysp;
    data.platform = path.platform;
    data["project.promul"] = project.promul;
    data.channelNo = path.channelNo;
    data["project.projectbets"] = project.projectbets;
    data["project.openstatus"] = project.openstatus;
    data["project.lotteryid"] = project.lotteryid;
    data["project.content"] = project.content;
    data["project.totalcount"] = project.totalcount;
    data["project.projecttype"] = project.projecttype;
    data["project.totalamount"] = project.totalamount;
    data["project.userid"] = user.userId + "";
    data["project.username"] = user.userName;
    data["project.matchids"] = project.matchids;

    // 请求登录
    var request = $.ajax({
      type: "GET",
      url: path.GJJ_TO_BUY,
      data: data,
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 获取方案详情
   * @param projectno
   * @param callback
   * @returns {*}
   */
  var getProjectDetail = function (projectno, callback) {

    var data = {
      projectno: projectno
    };

    // 请求登录
    var request = $.ajax({
      type: "GET",
      url: path.GJJ_GET_PROJECT_DETAIL,
      data: data,
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 平均优化奖金
   * @param matchList
   * @param totalBets
   * @param maxTimes
   * @returns {*}
   */
  var setAvgBonus = function (matchList, totalBets, maxTimes) {
    // 奖金基数点
    var baseBonus = parseFloat(matchList[0].sp);
    // 注数基数点
    var baseBet = 1;
    // 注数基数点Map
    var betPerMap = {};

    // 第一场
    betPerMap["p_0"] = baseBet;
    matchList[0].times = 1;

    // 从第二场赛事开始获取每场赛事相对于第一场奖金的注数基点
    for (var i = 1, iLen = matchList.length; i < iLen; i++) {
      var betPer = baseBonus / parseFloat(matchList[i].sp);
      baseBet += betPer;
      betPerMap["p_" + i] = betPer;
      matchList[i].times = 1;
    }

    //每次平分注数之后，剩余注数
    var leaveBets = totalBets - matchList.length;
    // 每一个基点获得剩余注数
    var perLeaveBet = totalBets / baseBet;
    // 第一项注数最多，是否超过最大倍数
    if (perLeaveBet > maxTimes) {
      return [];
    }

    if (leaveBets) {
      for (var j = 0, jLen = matchList.length; j < jLen; j++) {
        if (j == jLen - 1) {
          // 最后一项，剩余注数+默认一注
          matchList[j].times = leaveBets + 1;
        } else {
          var tmpBet = Math.round(perLeaveBet * betPerMap["p_" + j]);
          if (tmpBet && leaveBets) {
            // 必须减去默认一注
            do {
              tmpBet--;
            } while (tmpBet > leaveBets);
            // 有剩余注数，而计算值为0，默认加一注
            if (!tmpBet && leaveBets) {
              tmpBet = 1;
            }

            leaveBets -= tmpBet;
            // 加上默认一注
            matchList[j].times = tmpBet + 1;
          }
          // 无剩余注数，停止计算
          if (!leaveBets) {
            break;
          }
        }
      }
    }

    return matchList;
  };

  return {
    getMatchList: getMatchList,
    toBuy: toBuy,
    getProjectDetail: getProjectDetail,
    setAvgBonus: setAvgBonus
  };
});
