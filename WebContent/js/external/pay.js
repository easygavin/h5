/**
 * Created by radish on 2014/5/1.
 */
define(function (require, exports, module) {
  var view = require('/views/external/pay.html');
  var util = require('util');
  var page = require('page');
  var path = require('path');
  var accountService = require('services/account');
  var params = {};
  var canBack = 0;
  module.exports = {
    init : function (data, forward) {
      $("#container").html(view);
      params = $.extend(true, params, data);
      this.getUser();
      this.events();
      util.hideLoading();
    },
    getUser : function () {
      var key = /*'39d43219d072cf6a07a69a1500b4506c' ||*/ params.userKey;
      accountService.getUserInfoByToken(key, function (user) {
        if (user.statusCode == 0) {
          $('#user-balance').text(user.userBalance + '元');
        } else {
          console.log(user.errorMsg);
        }
      });
    },
    buy : function () {
      var lotteryType = '', url = '';
      if ([4, 6, 8, 11, 12, 13].indexOf(+lotteryType) != -1) {//数字彩
        url = path.DIGIT_BUY;
      } else if ([1, 5].indexOf(+lotteryType) != -1) {

      }
      require.async(url, function (service) {
        service && service.toBuy(lotteryType, "1", params, price, function (data) {
          if (data && data.statusCode) {
            if (data.statusCode == "0") {
            }
          } else {
            page.codeHandler(data);
          }
        });
      });

    },
    events : function () {
      $('#buy-btn').on('click', this.buy);
    }
  }
});