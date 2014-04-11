/**
 * 充值services.
 */
define(function (require, exports, module) {

  var md5 = require('md5');
  var path = require('path');

  module.exports = {

    /**
     *支付宝WAP充值.
     * @param  params include(amount,userId,token,couponNo,canalNo)
     * @param  callback 回调.
     */

    zfbWap: function (params, callback) {
      var data = {
        "amount": params.amount,    //支付金额
        "userId": params.userId,    //会员ID
        "couponNo": params.couponNo,//优惠券号
        "canalNo": params.canalNo   //渠道编号
      };

      return $.ajax({
        type: "GET",
        url: "/zfbWapPay",
        data: {data: JSON.stringify(data)},
        dataType: "json",
        success: callback,
        error: callback
      });
    },

    /**
     * 财付通WAP充值.
     * @param params include(amount,userId,token,couponNo,canalNo)
     * @param callback 回调.
     */

    cftWap: function (params, callback) {

      var data = {
        "amount": params.amount,      //支付金额
        "userId": params.userId,      //会员ID
        "couponNo": params.couponNo,  //优惠券号
        "canalNo": params.canalNo    //渠道编号
      };

      return $.ajax({
        type: "GET",
        url: "/cftWapPay",
        data: {data: JSON.stringify(data)},
        dataType: "json",
        success: callback,
        error: callback
      });
    },

    /**
     * 充值卡充值.
     * @param params include (amount,userId,token,couponNo,canalNo,cardNo,cardPwd,payCode)
     * @param callback  回调.
     */

    czk: function (params, callback) {

      var data = {
        "amount": params.amount,       //支付金额
        "userId": params.userId,       //会员ID
        "token": params.token,         //登录令牌
        "couponNo": params.couponNo,   //优惠券号
        "canalNo": params.canalNo,    //渠道编号
        "cardNo": params.cardNo,      //充值卡号
        "cardPwd": params.cardPwd,    //充值卡密码
        "payCode": params.payCode      //支付通道编码
      };

      return $.ajax({
        type: "GET",
        url: "/czkPay",
        data: {data: JSON.stringify(data)},
        dataType: "json",
        success: callback,
        error: callback
      });
    },

    /**
     *直通卡充值.
     * @param params include(userId,token,cardNo,password,mobile,canalNo)
     * @param callback  回调.
     */

    ztk: function (params, callback) {

      var data = {
        "userId": params.userId,      //会员ID
        "token": params.token,        //登录令牌
        "cardNo": params.cardNo,      //直通卡号
        "password": params.password,  //直通卡密码
        "mobile": params.mobile,      //手机号
        "canalNo": params.canalNo     //渠道编号
      };

      return $.ajax({
          type:"GET",
          url:"/ztkPay",
          data:{data:JSON.stringify(data)},
          dataType:"json",
          success:callback,
          error:callback
      });
    }
  };
});
