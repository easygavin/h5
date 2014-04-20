/**
 * 合买服务
 */
define(function (require, exports, module) {

  var path = require('path'),
      util = require('util');

  module.exports = {

    /**
     * 获取合买数据
     * @param pagesize        每页的记录条数
     * @param orderBy         升降方式{desc,asc}
     * @param orderByName     排序方式{percent,money}
     * @param lotteryTypes    彩种id
     * @param requestPage     当前请求页
     * @param callback        回调函数.
     */
    getHmInfo: function (pagesize, orderBy, orderByName, lotteryTypes, requestPage, callback) {

      var data = {
        "pagesize": pagesize,
        "orderBy": orderBy,
        "orderByName": orderByName,
        "lotteryTypes": lotteryTypes,
        "requestPage": requestPage
      };

      return $.ajax({
        type: "GET",
        url: path.HM_DETAIL_LIST,
        data: {data: JSON.stringify(data)},
        dataType: "jsonp",
        success: callback,
        error: callback
      });

    },

    /**
     * 获取合买单详情
     * @param lotteryType
     * @param requestType
     * @param projectId
     * @param requestUrl
     * @param userKey
     * @param userId
     * @param callback

     */
    getHmDetail: function (lotteryType, requestType, projectId, requestUrl, userKey, userId, callback) {

      var data = {
        "lotteryType": lotteryType,
        "requestType": requestType,
        "projectId": projectId,
        "requestUrl": requestUrl,
        "userKey": "",
        "userId": ""
      };

      return $.ajax({
        type: "GET",
        url: requestUrl,
        data: {data: JSON.stringify(data)},
        dataType: "jsonp",
        success: callback,
        error: callback
      });
    },

    /**
     * 参与合买.
     * @param params   参数
     * @param url      地址
     * @param callback 回调
     */
    joinHm: function (params,url,callback) {
      return $.ajax({
        type: "GET",
        url: url,
        data: {data: JSON.stringify(params)},
        dataType: "jsonp",
        success: callback,
        error: callback
      });
    }
  };

});