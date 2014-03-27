/**
 * 账号服务
 */
define(function (require, exports, module) {
  require('md5');
  var path = require('path');

  /**
   * 登录
   * @param name
   * @param password
   * @param callback
   */
  var goLogin = function (name, password, callback) {

    // 请求参数
    var data = {
      "platform": path.platform,
      "channelNo": path.channelNo,
      "username": encodeURIComponent(name),
      "changedPassword": hex_md5(password).substr(8, 16)
    };

    // 请求登录
    var request = $.ajax({
      type: "GET",
      url: path.USER_LOGIN,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };

  /**
   * 注册
   * @param name
   * @param password
   * @param callback
   */
  var goRegister = function (name, password, callback) {

    // 请求参数
    var data = {
      "platform": path.platform,
      "channelNo": path.channelNo,
      "cellphoneType": path.cellphoneType,
      "simCd": path.simCd,
      "imei": path.imei,
      "macAddr": path.macAddr,
      "resolution": path.resolution,
      "mobileNo": "",
      "username": encodeURIComponent(name),
      "password": hex_md5(password).substr(8, 16)
    };

    // 请求登录
    var request = $.ajax({
      type: "GET",
      url: path.USER_REG,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;
  };
  /**
   * 获取用户余额
   * @param requestType   请求类型
   * @param userId        用户id
   * @param userKey       用户key
   * @param callback      回调函数
   */
  var getUserBalance = function (requestType, userId, userKey, callback) {
    var data = {
      "requestType": requestType,
      "userId": userId,
      "userKey": userKey
    };

    var request = $.ajax({
      type: "GET",
      url: path.GET_BALANCE,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

    return request;

  };

  /**
   * 获取优惠券信息..
   * @param userId   用户key.
   * @param beginTime  开始时间.
   * @param endTime    结束时间.
   * @param callback   回调.
   * @returns {*}
   */

  var getCouponInfo = function (userId, beginTime, endTime,callback) {

    var data = {
      "userId":userId,
      "beginTime": beginTime,
      "endTime": endTime
    };

    var request = $.ajax({
      url: path.GET_COUPONS,
      type: "GET",
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });
    return request;
  };

  /**
   * 通过token返回用户信息.
   * @param token
   * @param callback
   * @returns {*}
   */
  var getUserInfoByToken = function (token,callback) {

    var data = {
      "token":token
    };

    var request = $.ajax({
      url: path.GET_USER_BY_TOKEN,
      type: "GET",
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });
    return request;
  };

  /**
   * 查询身份证绑定
   * @param userId
   * @param userKey
   * @param callback
   */
  var inspectUserIDCardState = function (userId, userKey, callback) {

    var data =
    {
      "userId": userId,
      "userKey": userKey
    };
    $.ajax({
      url: path.GET_CARD_ID,
      type: "GET",
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });
  };

  /**
   * 身份认证
   * @param  personCardId   身份证号码
   * @param  personCardName 身份证姓名
   * @param  userId         用户Id
   * @param  userKey        用户key
   * @param  callback       回调函数
   */

  var bindIDCard = function (personCardId, personCardName, userId, userKey, callback) {

    var data = {
      "personCardId": personCardId,
      "name": encodeURIComponent(personCardName),
      "userId": userId,
      "userKey": userKey
    };

    $.ajax({
      url: path.BIND_PERSON_CARD,
      type: "GET",
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });
  };

  /**
   * 发送验证码接口
   * @param userKey 用户Key
   * @param mobileNo 手机号码
   * @param userId 用户id
   * @param callback 回调
   */

  var sendCaptcha = function (userKey, mobileNo, userId, callback) {

    var data = {
      "userKey": userKey,
      "mobileNo": mobileNo,
      "userId": userId
    };

    $.ajax({
      type: "GET",
      url: path.SEND_MSG_TO_PHONE,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });
  };

  /**
   * 绑定手机号
   * @param mobileNo          手机号码
   * @param userId            用户Id
   * @param userKey           用户Key
   * @param indentifyingCode  验证码
   * @param callback          回调
   */
  var bindMobileNo = function (mobileNo, userId, userKey, indentifyingCode, callback) {

    var data = {
      "mobileNo": mobileNo,
      "userId": userId,
      "userKey": userKey,
      "indentifyingCode": indentifyingCode
    };

    $.ajax({
      type: "GET",
      url: path.VALIDATE_CODE,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });
  };

  /**
   * 获取银行卡省市列表
   * @param callback  回调.
   */
  var getBankLists = function (callback) {

    $.ajax(
        {
          type: "POST",
          url: path.GET_BANKS,
          data: {},
          dataType: "jsonp",
          success: callback,
          error: callback
        });
  };

  /**
   * 获取银行卡省市列表
   * @param callback 回调.
   */
  var getBankLocus = function (callback) {

    $.ajax(
        {
          type: "POST",
          url: path.GET_BANK_LOCUS,
          data: {},
          dataType: "jsonp",
          success: callback,
          error: callback
        });
  };

  /**
   * 绑定银行卡
   * @param   userId      用户id
   * @param   userKey     用户key
   * @param   name        真实姓名
   * @param   cardNo      银行卡号
   * @param   bankInfo    开户行信息
   * @param   bankName    开户银行名称
   * @param   province    开户省份
   * @param   city        开户城市
   * @param   password    提款密码
   * @param   confirmPassword 提款密码确认
   * @param   bankCode    银行代码
   * @param   callback    回调
   */
  var bindUserBankCard = function (userId, userKey, name, cardNo, bankInfo, bankName, province, city, password, confirmPassword, bankCode, callback) {

    var data =
    {
      "userId": userId,
      "userKey": userKey,
      "name": encodeURIComponent(name),
      "cardNo": cardNo,
      "bankInfo": encodeURIComponent(bankInfo),
      "bankName": encodeURIComponent(bankName),
      "province": encodeURIComponent(province),
      "city": encodeURIComponent(city),
      "password": password,
      "confirmPassword": confirmPassword,
      "bankCode": bankCode
    };

    $.ajax(
        {
          type: "GET",
          url: path.BIND_BANK_CARD,
          data: {data: JSON.stringify(data)},
          dataType: "jsonp",
          success: callback,
          error: callback
        });
  };

  /**
   * 提款
   * @param userId      用户id
   * @param userKey     用户userKey
   * @param userName    用户名
   * @param drawMoney   提款金额
   * @param drawPwd     密码.
   * @param callback    回调函数
   */
  var withdrawal = function (userId, userKey, userName, drawMoney, drawPwd, callback) {

    var afterMd5drawPwd = hex_md5(drawPwd).substring(8, 24);

    var data = {
      "userId": userId,
      "userKey": userKey,
      "drawMoney": drawMoney,
      "drawPwd": afterMd5drawPwd,
      "md5Sign": hex_md5("userId=" + userId + ",userKey=" + userKey + ",drawMoney=" + drawMoney + ",drawPwd=" + afterMd5drawPwd + userName).substr(8, 16)
    };

    $.ajax({
      type: "GET",
      url: path.DRAWING,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });
  };

  /**
   * 修改登录密码
   * @param userId   用户Id
   * @param userKey  用户Key
   * @param oldPwd   旧密码
   * @param newPwd   新密码
   * @param callback 回调
   */
  var editLoginPassword = function (userId, userKey, oldPwd, newPwd, callback) {

    var data =
    {
      "userId": userId,
      "userKey": userKey,
      "oldPwd": hex_md5(oldPwd).substr(8, 16),
      "newPwd": hex_md5(newPwd).substr(8, 16)
    };

    $.ajax({
      type: "GET",
      url: path.CHANG_PWD,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });
  };


  /**
   * 用户注销接口
   * @param  userId    用户Id
   * @param  userKey   用户Key
   * @param  callback  回调
   */
  var logout = function (userId, userKey, callback) {

    var data = {
      userKey: userKey,
      userId: userId + ""
    };

    $.ajax({
      type: "GET",
      url: path.USER_LOGOUT,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });
  };


  /**
   * 获取用户购彩记录
   * @param data
   * @param callback
   */
  var getBuyRecordsList = function (data, callback) {

    $.ajax({
      type: "GET",
      url: path.BUY_AWARD,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });
  };

  /**
   * 获取账户明细
   * @param data
   * @param callback
   */

  var getAccountDetailList = function (data, callback) {

    $.ajax({
      type: "GET",
      url: path.GET_ACCOUNT_DETAIL,
      data: {data: JSON.stringify(data)},
      dataType: "jsonp",
      success: callback,
      error: callback
    });

  };

  return {
    goLogin: goLogin,
    goRegister: goRegister,
    bindIDCard: bindIDCard,
    getUserBalance: getUserBalance,
    getCouponInfo:getCouponInfo,
    getUserInfoByToken:getUserInfoByToken,
    inspectUserIDCardState: inspectUserIDCardState,
    editLoginPassword: editLoginPassword,
    logout: logout,
    sendCaptcha: sendCaptcha,
    bindMobileNo: bindMobileNo,
    getBankLocus: getBankLocus,
    getBankLists: getBankLists,
    bindUserBankCard: bindUserBankCard,
    getBuyRecordsList: getBuyRecordsList,
    getAccountDetailList: getAccountDetailList,
    withdrawal: withdrawal
  };

});