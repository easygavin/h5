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

    }

  };

});