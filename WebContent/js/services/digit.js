/**
 * 数字彩服务
 */
define(function (require, exports, module) {

  var path = require('path'),
    util = require('util');
  /**
   * 获取当前期号
   * @param callback
   */
  var getCurrLottery = function (lotteryType, callback) {

    var data = {
      lotteryType: lotteryType
    };

    // 请求登录
    var request = $.ajax({
      type: "GET",
      url: path.GET_CURRENT_LOTTERY,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 获取遗留号
   * @param callback
   */
  var getLastLottery = function (lotteryType, callback) {

    var data = {
      lotteryType: lotteryType
    };

    // 请求登录
    var request = $.ajax({
      type: "GET",
      url: path.GET_LAST_ISSUE_MSG,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 获取幸运赛车前一/位置奖金
   * @param callback
   */
  var getRacingPosAward = function (lotteryType, playType, callback) {

    var data = {
      lotteryType: lotteryType,
      playType: playType
    };

    // 请求登录
    var request = $.ajax({
      type: "GET",
      url: path.GET_RACING_POS_AWARD,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 购买
   * @param params
   * @param callback
   */
  var toBuy = function (lottery, type, params, price, callback) {

    if (!util.checkLogin(null)) {
      // 尚未登录
      callback({statusCode: "off"});
      return false;
    }

    // 保存登录成功信息
    var user = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    // 请求参数
    var data = {};

    data.issueNo = params.issueNo; // 期号
    data.lotteryType = lottery;  // 彩种类型
    data.content = params.content;  // 方案内容
    data.playType = params.playType;  // 玩法类型 2 复式, 5 胆拖
    data.betType = params.betType; // 投注类型 1 直选，2 组选，3 组三，4组六，5 大乐透12 选2，6生肖，7 季节，8 方位；高频彩默认传入1

    data.bets = params.bets; // 当期总注数
    data.totalIssue = params.totalIssue;  // 总期数
    data.totalBet = params.totalBet;  // 总倍数
    data.totalAmount = (parseInt(data.totalBet, 10) * parseInt(data.bets, 10) * price) + "";  // 总金额
    data.stopBetting = params.stopBetting;  // 中奖后停止追号 0不停止，1停止
    data.addtionSupper = params.addtionSupper;  // 大乐透专用，0不追加，1追加
    data.btzh = params.btzh;  // 高频彩，是否是倍投计算器
    data.stopCondition = params.stopCondition;  // 停止追号条件

    var detailStr = JSON.stringify(params.detail).replace(/\"/g, '\"');
    data.detail = detailStr; // 购买当期的详细信息
    // 固定参数
    data.projectDesc = ""; // 方案描述

    switch (type) {
      case "1": // 复式 胆拖
        data.projectType = "0"; // 自购
        data.projectHold = "0";  // 方案保底份数 0 为不保底
        data.projectOpenState = "2";  // 方案公开方式 0公开，1跟单后，2截止后，3不公开
        data.projectBuy = "1";  // 方案认购份数 至少总份数的5%

        data.projectCount = "1";  // 合买方案总份数
        data.projectCommissions = "5";  // 合买方案提成百分比0-10

        break;

      case "2":  // 合买
        data.projectType = "1"; // 自购
        data.projectHold = params.projectHold;  // 方案保底份数 0 为不保底
        data.projectOpenState = params.projectOpenState;  // 方案公开方式 0公开，1跟单后，2截止后，3不公开
        data.projectBuy = params.projectBuy;  // 方案认购份数 至少总份数的5%

        data.projectCount = params.projectCount;  // 合买方案总份数
        data.projectCommissions = params.projectCommissions;  // 合买方案提成百分比0-10

        break;
    }

    data.channelNo = path.channelNo;
    data.platform = path.platform;
    data.userKey = user.userKey;
    data.userId = user.userId + "";
    data.userName = user.userName;

    // 购买登录
    var request = $.ajax({
      type: "GET",
      url: path.DIGIT_BUY,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 获取方案详情
   * @param lotteryType
   * @param requestType
   * @param projectId
   * @param callback
   */
  var getProjectDetails = function (lotteryType, requestType, projectId, callback) {

    if (!util.checkLogin(null)) {
      // 尚未登录
      callback({statusCode: "off"});
      return false;
    }

    // 保存登录成功信息
    var user = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    var data = {
      lotteryType: lotteryType,
      requestType: requestType,
      projectId: projectId,
      userKey: user.userKey,
      userId: user.userId + ""
    };

    // 请求登录
    var request = $.ajax({
      type: "GET",
      url: path.SUBSCRIBE_ORDER,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 获取方案追期列表
   * @param lotteryType
   * @param projectId
   * @param callback
   * @return {Boolean}
   */
  var getProjectAllIssue = function (lotteryType, projectId, callback) {

    if (!util.checkLogin(null)) {
      // 尚未登录
      callback({statusCode: "off"});
      return false;
    }

    // 保存登录成功信息
    var user = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    var data = {
      lotteryType: lotteryType,
      projectId: projectId,
      userId: user.userId + ""
    };

    // 请求登录
    var request = $.ajax({
      type: "GET",
      url: path.ALL_ISSUE,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 复活追号
   * @param lotteryType
   * @param projectId
   * @param callback
   * @return {Boolean}
   */
  var addBuyDigit = function (lotteryType, projectId, callback) {

    if (!util.checkLogin(null)) {
      // 尚未登录
      callback({statusCode: "off"});
      return false;
    }

    // 保存登录成功信息
    var user = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    var data = {
      lotteryType: lotteryType,
      projectId: projectId,
      userKey: user.userKey,
      userId: user.userId + ""
    };

    // 请求登录
    var request = $.ajax({
      type: "GET",
      url: path.ADD_BUY_DIGIT,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 获取开奖记录
   * @param lottery 彩种
   * @param size 记录数
   */
  var getHistoryAwardsByTypes = function (lottery, size, callback) {

    // 请求参数
    var data = {
      lotteryType: lottery,
      issueCount: size
    };

    // 开奖记录
    var request = $.ajax({
      type: "GET",
      url: path.AWARD_LIST_ISSUE,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 数字彩某期开奖详情
   * @param lottery 彩种
   * @param issueNo 期号
   * @param callback
   */
  var getDigitDetailsByIssue = function (lottery, issueNo, callback) {
    var data = {
      lotteryId: lottery,
      issueNo: issueNo
    };

    // 数字彩某期开奖详情
    var request = $.ajax({
      type: "GET",
      url: path.GET_DIGIT_NB,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 获取开奖信息列表
   * @param lotteryTypeArray
   * @param callback
   */
  var getAwardInfoList = function (lotteryTypeArray, callback) {
    var data = {
      lotteryTypeArray: lotteryTypeArray
    };

    // 数字彩某期开奖详情
    var request = $.ajax({
      type: "GET",
      url: path.AWARD_LIST,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 根据彩种ID查询用户中奖信息
   * @param lotteryId 彩种ID
   * @param days 多少天内
   * @param count 数据条数
   * @param callback
   */
  var getUserAwardByLotteryId = function (lotteryId, days, count, callback) {
    var data = {
      lotteryId: lotteryId,
      days: days,
      count: count
    };

    var request = $.ajax({
      type: "GET",
      url: path.USER_AWARD_INFO,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 根据彩种ID数组查询彩票信息集合
   * @param lotteryTypeArray
   * @param callback
   * @returns {*}
   */
  var getLotteryInfoByLotteryIds = function (lotteryTypeArray, callback) {
    var data = {
      lotteryTypeArray: lotteryTypeArray
    };

    var request = $.ajax({
      type: "GET",
      url: path.GET_LOTTERY_INFO,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 根据彩种ID获取彩票上期开奖等级信息
   * @param lotteryId
   * @param callback
   * @returns {*}
   */
  var getLotteryLevelByLotteryId = function (lotteryId, callback) {
    var data = {
      lotteryId: lotteryId
    };

    var request = $.ajax({
      type: "GET",
      url: path.GET_LOTTERY_LEVEL_INFO,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 11选5智能追号前处理
   * @param money 单期消费
   * @param bonus 单注奖金
   * @param issueNo 期号
   * @param count 追期数
   * @param sum 开奖期数
   * @param mode 投注模式
   * @param bet 总注数
   * @param balls 总球数
   * @param dans 胆球数
   * @param tuos 拖球数
   */
  var beforeHandler = function (opt) {
    // money, bonus, issueNo, count, sum, mode, bet, balls, dans, tuos
    // 返回数据
    var result = {};
    if (opt.money >= opt.bonus) {
      // 单期消费 大于等于 奖金 不处理智能追号
      return result;
    }

    // 期数检查
    var number = opt.issueNo.substring(opt.issueNo.length - 2);
    if (typeof number != "undefined" && number != "") {
      number = parseInt(number, 10);
    }

    // 剩余期数
    var leave = opt.sum - number + 1;
    if (number + opt.count - 1 > opt.sum) {
      opt.count = leave;
    }

    // 截止期号
    var endIssue = "";
    var prepend = opt.issueNo.substring(0, opt.issueNo.length - 2);
    if (opt.count > 0) {
      var endNum = number + opt.count - 1;
      endIssue = prepend + (endNum < 10 ? ("0" + endNum) : endNum);
    }

    // 模式处理
    var maxBonus = 0;
    switch (opt.mode) {
      /*case "0": // 任一
       maxBonus = 0;
       break;*/
      case "1": // 任二
      case "2": // 任三
      case "3": // 任四
        if (opt.bet > 1) {
          // 复式追号 5个号码最多10注
          var modeI = parseInt(opt.mode, 10) + 1;
          var ballR = opt.balls < 5 ? opt.balls : 5;
          maxBonus = util.getFactorial(ballR, modeI) * opt.bonus;
        }
        break;
      /*case "4": // 任五
       maxBonus = 0;
       break;*/
      case "5": // 任六
      case "6": // 任七
      case "7": // 任八
        // 复式追号
        if (opt.bet > 1) {
          var modeI = parseInt(opt.mode, 10) + 1;
          maxBonus = util.getFactorial(opt.balls - 5, modeI - 5) * opt.bonus;
        }
        break;
      /*case "8": // 前三直选
       maxBonus = 0;
       break;
       case "9": // 前三组选
       maxBonus = 0;
       break;
       case "10": // 前二直选
       maxBonus = 0;
       break;
       case "11": // 前二组选
       maxBonus = 0;
       break;
       case "12": // 前三直选胆拖
       maxBonus = 0;
       break;
       case "13": // 前三组选胆拖
       maxBonus = 0;
       break;
       case "14": // 前二直选胆拖
       maxBonus = 0;
       break;
       case "15": // 前二组选胆拖
       maxBonus = 0;
       break;*/
      case "16": // 任二胆拖
      case "17": // 任三胆拖
      case "18": // 任四胆拖
      case "19": // 任五胆拖
        if (opt.bet > 1) {
          var modeI = parseInt(opt.mode, 10) - 14;
          var tuoR = opt.tuos < 5 - opt.dans + 1 ? opt.tuos : 5 - opt.dans;
          maxBonus = util.getFactorial(tuoR, modeI - opt.dans) * opt.bonus;
        }
        break;
      case "20": // 任六胆拖
      case "21": // 任七胆拖
      case "22": // 任八胆拖
        if (opt.bet > 1) {
          if (opt.dans > 4) {
            var modeI = parseInt(opt.mode, 10) - 14;
            maxBonus = util.getFactorial(opt.tuos, modeI - opt.dans) * opt.bonus;
          }
        }
        break;
    }

    result.startIssue = opt.issueNo;
    result.endIssue = endIssue;
    result.money = opt.money;
    result.minBonus = opt.bonus;
    result.maxBonus = maxBonus;
    result.count = opt.count;
    result.leave = leave;

    return result;
  };

  /**
   * 11选5获取智能追号列表
   * @param startIssue 开始期号
   * @param endIssue 结束期号
   * @param money 单期金额
   * @param minBonus 单期最小奖金
   * @param maxBonus 单期大奖金
   * @param type 计算方式 1：盈利率，2：盈利金额
   * @param rate 盈利率
   * @param income 盈利金额
   */
  var getAppendList = function (opt) {
    // startIssue, endIssue, money, minBonus, maxBonus, type, rate, income
    opt.startIssue = parseInt(opt.startIssue, 10);
    opt.endIssue = parseInt(opt.endIssue, 10);

    var items = [];
    var totalPay = 0; // 总投入
    var muls = 1; // 倍数
    for (var i = opt.startIssue; i < opt.endIssue + 1; i++) {
      var pay = 0, // 投入
        minIncome = 0, // 最小收益
        maxIncome = 0, // 最大收益
        minRate = 0, // 最小收益率
        maxRate = 0; // 最大收益率

      do {

        pay = muls * opt.money;

        minIncome = muls * opt.minBonus - (pay + totalPay);
        minRate = (minIncome / (pay + totalPay)) * 100;

        if (opt.maxBonus) {
          maxIncome = muls * opt.maxBonus - (pay + totalPay);
          maxRate = (maxIncome / (pay + totalPay)) * 100;
        }

        if (opt.type == 1 && minRate > opt.rate) {
          break;
        } else if (opt.type == 2 && minIncome > opt.income) {
          break;
        }

        muls++;
        if (muls == 10000) {
          break;
        }
      } while (true);

      if (muls < 10000) {
        var item = {};
        item.issueNo = i + "";
        item.muls = muls;
        item.pay = pay;
        item.minIncome = minIncome;
        item.minRate = minRate;
        item.maxIncome = maxIncome;
        item.maxRate = maxRate;

        totalPay = item.pay + totalPay;
        item.totalPay = totalPay;

        items.push(item);
      } else {
        break;
      }

    }
    return items;
  };

  /**
   * 用户改变倍数时，重新计算消费与盈利
   */
  var calcPayIncome = function (items, opt) {
    var totalPay = 0; // 总投入
    for (var i = 0; i < items.length; i++) {
      var pay = 0, // 投入
        minIncome = 0, // 最小收益
        maxIncome = 0, // 最大收益
        minRate = 0, // 最小收益率
        maxRate = 0; // 最大收益率

      pay = items[i].muls * opt.money;

      minIncome = items[i].muls * opt.minBonus - (pay + totalPay);
      minRate = (minIncome / (pay + totalPay)) * 100;

      if (opt.maxBonus) {
        maxIncome = items[i].muls * opt.maxBonus - (pay + totalPay);
        maxRate = (maxIncome / (pay + totalPay)) * 100;
      }

      items[i].pay = pay;
      items[i].minIncome = minIncome;
      items[i].minRate = minRate;
      items[i].maxIncome = maxIncome;
      items[i].maxRate = maxRate;

      totalPay = items[i].pay + totalPay;
      items[i].totalPay = totalPay;
    }
    return items;
  };


  return {
    getCurrLottery: getCurrLottery,
    getLastLottery: getLastLottery,
    getRacingPosAward: getRacingPosAward,
    toBuy: toBuy,
    getProjectDetails: getProjectDetails,
    getProjectAllIssue: getProjectAllIssue,
    addBuyDigit: addBuyDigit,
    getHistoryAwardsByTypes: getHistoryAwardsByTypes,
    getDigitDetailsByIssue: getDigitDetailsByIssue,
    getAwardInfoList: getAwardInfoList,
    getUserAwardByLotteryId: getUserAwardByLotteryId,
    getLotteryInfoByLotteryIds: getLotteryInfoByLotteryIds,
    getLotteryLevelByLotteryId: getLotteryLevelByLotteryId,
    beforeHandler: beforeHandler,
    getAppendList: getAppendList,
    calcPayIncome: calcPayIncome
  };
});
