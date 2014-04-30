/**
 * 充值首页
 */
define(function (require, exports, module) {
      var page = require('page'),
          util = require('util'),
          $ = require('zepto'),
          _ = require('underscore'),
          md5 = require('tools/md5'),
          path = require('path'),
          charge = require('services/charge'),
          account = require('services/account'),
          template = require("/views/charge/index.html");

      // 处理返回参数
      var canBack = 0;

      //用户信息.
      var userInfo = null;

      //优惠券编号.从优惠券界面跳转,传递.
      var couponCode = '';

      //.1表示包含可提款余额姓名等信息，0表示只须提供可用余额
      var requestType = 0;

      //优惠券总张数..
      var couponCount = 0;

      //客户端过来的userToken，平台号,渠道号.
      var userToken = '', client_channelNo = '', client_platform = '';

      //调用充值接口所需的参数.
      var parameterValues = {};

      //充值卡,三种运行商发行卡序列号,密码,长度
      var serialNumberMap = {};

      //从callback失败到充值中心,传递过来的result &type
      var result, type;

      //登录状态.
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

        type = data.type;
        result = data.result;

        if (typeof data.couponCode != "undefined" && $.trim(data.couponCode) != '') {
          couponCode = data.couponCode;
          params.couponCode = couponCode;
        }

        //参数设定,包括客户端传递,或者H5其他页面传递..
        browserParameterSettings(data, params);

        initShow();

        bindEvent();

        // 处理返回
        page.setHistoryState({url: "charge/index", data: params},
            "charge/index", "#charge/index" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
            canBack);
        util.hideLoading();
      };

      /**
       * 初始化显示
       */
      var initShow = function () {

        $("#container").html(template);
        //何处登录.
        loginByWhich();
        //文本框禁用.
        disableCouponInput();
      };

      /**
       * 判断用户登录平台.
       */
      var loginByWhich = function () {

        if (userToken && client_channelNo && client_platform) {
          //如果有userToken,client_channelNo,client_platform则表明来自客户端内嵌.
          loginByToken();
        } else {
          //来自H5自有用户.
          loginByH5();
        }
      };
      /**
       * h5自有用户登录.
       */
      var loginByH5 = function () {

        if (!tkn) {
          // 尚未登录，弹出提示框
          page.answer("", "您还未登录，请先登录", "登录", "取消", function () {
            page.init("login", {}, 1);
          }, function () {
            $(".popup").hide();
          });
          return false;
        }

        userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
        util.showLoading();
        var request = account.getUserBalance(requestType, userInfo.userId, userInfo.userKey, function (data) {
          util.hideLoading();
          if (data != "undefined" && typeof data.statusCode != "undefined" && data.statusCode == '0') {
            $("#balance").html(parseFloat(data.userBalance).toFixed(2));
            //设置 userInfo 的平台号,渠道号.
            userInfo.channelNo = path.channelNo;
            userInfo.platform = path.platform;
            util.setLocalJson(util.keyMap.LOCAL_USER_INFO_KEY, userInfo);
            getCouponCount(userInfo.userId);
          } else if (data.statusCode == '-2' || data.errorMsg.indexOf('token失效') != -1) {
            page.answer("", "因长时间未进行操作,请重新登录", "登录", "取消",
                function (e) {
                  page.init("login", {}, 1);
                },
                function (e) {
                });
          } else {
            page.toast(data.errorMsg);
          }
        });
        util.addAjaxRequest(request);
      };

      /**
       * 根据token得到用户信息,来自客户端.
       */
      var loginByToken = function () {
        util.showLoading();
        var request = account.getUserInfoByToken(userToken, function (data) {
          util.hideLoading();
          if (typeof data != "undefined" && typeof data.statusCode != "undefined") {
            if (data.statusCode == '0') {
              $("#balance").html(parseFloat(data.userBalance).toFixed(2));
              getCouponCount(data.userId);
              //保存登录成功信息,并且设置设它的渠道号,平台号,token信息.
              data.channelNo = client_channelNo;
              data.platform = client_platform;
              data.token = new Date().getTime() + "";
              userInfo = data;
              util.setLocalJson(util.keyMap.LOCAL_USER_INFO_KEY, userInfo);
            } else {
              page.toast(data.errorMsg);
            }
          }
        });
        util.addAjaxRequest(request);
      };

      /**
       * 获取优惠券总数
       * @param userId   用户Id.
       */
      var getCouponCount = function (userId) {
        var time = getTime();
        util.showLoading();
        var request = account.getCouponInfo(userId, time.beginTime, time.endTime, 1, 10, function (data) {
          util.hideLoading();
          //得到优惠券总张数
          if (typeof data != "undefined" && typeof data.statusCode != "undefined") {
            couponCount = typeof data.unUsed == "undefined" ? 0 : data.unUsed;
            $("#couponCount").html(couponCount);
          } else {
            page.toast(data.errorMsg);
          }
        });
        util.addAjaxRequest(request);
      };

      /**
       *是否禁用优惠券输入框.
       */
      var disableCouponInput = function () {
        if (couponCode != '') {
          $("#couponCode").attr("readonly", true).val(couponCode);
        }
      };

      /**
       *获取当前时间,结束时间.
       */
      var getTime = function () {
        var timeObj = {};
        //结束时间(当前时间)
        var endDate = new Date();
        var endYear = endDate.getFullYear();
        var endMonth = endDate.getMonth() < 10 ? "0" + (endDate.getMonth() + 1) : endDate.getMonth() + 1;
        var endDay = endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate();
        var endTime = endYear + "-" + endMonth + "-" + endDay;
        //开始时间(往前推一年).
        var beginDate = new Date(endTime);
        beginDate.setYear(beginDate.getFullYear() - 1);
        var beforeYear = beginDate.getFullYear();
        var beforeMonth = beginDate.getMonth() < 10 ? "0" + (beginDate.getMonth() + 1) : beginDate.getMonth() + 1;
        var beforeDay = beginDate.getDate() < 10 ? "0" + beginDate.getDate() : beginDate.getDate();
        var beginTime = beforeYear + "-" + beforeMonth + "-" + beforeDay;
        timeObj.beginTime = beginTime;
        timeObj.endTime = endTime;
        return timeObj;
      };

      /**
       *在线冲值(支付宝,财付通)输入校验.
       */
      var zfbCftWapInput = function () {
        parameterValues = {};
        //充值金额.
        var money = $("#money").val(), couponNo = $("#couponCode").val();
        var pattern = /^[1-9]\d*$/;
        if (money == '至少充值10元' || money == '') {
          page.toast("请输入充值金额");
          return false;
        } else if (isNaN(money) || !pattern.test(money)) {
          page.toast("充值金额必须为整数");
          return false;
        } else if (parseInt(money) < 10) {
          page.toast("至少充值10元");
          return false;
        }

        //优惠券编号校验.
        var str = "[@/'\"#$%&^*]+";
        var reg = new RegExp(str);
        if (couponNo == '请输入优惠券编号' || couponNo == '') {
          parameterValues.couponNo = ''; //优惠券编号.
        } else {
          if (couponNo != '' && couponCount == 0) {
            page.toast("您尚未获得有效的优惠券");
            return false;
          } else if (couponNo != '' && reg.test(couponNo)) {
            page.toast("请输入有效的优惠券编号");
            return false;
          }
          parameterValues.couponNo = couponNo; //优惠券编号.
        }
        parameterValues.amount = money;             //充值金额.
        parameterValues.userId = userInfo.userId;   //用户Id
        parameterValues.canalNo = userInfo.platform;//渠道号.
        return true;
      };

      /**
       *充值卡充值,(移动,联通,电信)输入校验.
       */
      var czkInput = function () {
        //充值卡序列号.
        var serialNumber = $('#serialNumber').val();
        //充值卡密码.
        var serialPassWord = $('#serialPassWord').val();
        //充值类型[神州行,联通,电信]
        var chargeType = $('.tabs1').find('span.click').data('type');
        //根据充值类型,来得到充值号码,密码,最大长度,以及支付通道对应编码
        var szkType = serialNumberMap[chargeType];
        if (serialNumber == '请输入充值卡序列号' || serialNumber == '') {
          page.toast('请输入充值卡序列号');
          return false;
        } else if (isNaN(serialNumber) || serialNumber.length > szkType.serialNumberLen) {
          page.toast('请输入正确的充值卡序列号');
          return false;
        }
        //充值卡密码校验..
        if (serialPassWord == '请输入充值卡密码' || serialPassWord == '') {
          page.toast('请输入充值卡密码');
          return false;
        } else if (serialPassWord.length > szkType.passwordLen) {
          page.toast('请输入正确的充值卡密码');
          return false;
        }
        //设置参数..
        var amount = $('#' + chargeType + '_panel').find('li.click').data('num');
        parameterValues = {};
        parameterValues.amount = amount;           //支付金额.
        parameterValues.userId = userInfo.userId;   //用户Id
        parameterValues.couponNo = '';             //充值卡充值,暂时没有优惠券选项.
        parameterValues.canalNo = userInfo.platform;//canalNo 渠道编号.
        parameterValues.cardNo = serialNumber;     //充值卡号.
        parameterValues.cardPwd = serialPassWord;  //充值卡密码.
        parameterValues.payCode = szkType.type;    //支付通道编码
        return true;
      };

      /**
       *直通卡充值输入校验.
       */
      var ztkInput = function () {

        //直通卡,卡号,密码,手机号码,验证码 校验.
        var ztkNum = $('#ztkNum').val(),
            ztkPass = $('#ztkPass').val(),
            zktTele = $('#zktTele').val();

        //直通卡卡号校验.
        var regZtkNum = /^[A-Za-z0-9]+$/;
        if (ztkNum == '请输入卡号' || ztkNum == '') {
          page.toast('请输入直通卡卡号');
          return false;
        } else if (!regZtkNum.test(ztkNum)) {//卡号,只能是字母或者数字组合.
          page.toast('您输入的直通卡号不正确');
          return false;
        }

        //直通卡密码校验.
        if (ztkPass == '请输入密码' || ztkPass == '') {
          page.toast('请输入直通卡密码');
          return false;
        }

        //手机号码校验.
        if (zktTele == '请输入手机号' || zktTele == '') {
          page.toast('请输入手机号码');
          return false;
        } else if (zktTele.length != 11 || isNaN(zktTele)) {
          page.toast('您输入的手机号码不正确');
          return false;
        }
        parameterValues = {};
        parameterValues.userId = userInfo.userId;   //用户Id
        parameterValues.cardNo = ztkNum;            //直通卡号
        parameterValues.password = ztkPass;         //直通卡密码
        parameterValues.mobile = zktTele;           //手机号
        parameterValues.canalNo = userInfo.platform;//渠道编号
        return true;

      };

      /**
       * 支付宝WAP充值.
       */
      var zfbWapPay = function () {
        //校验文本输入.
        var flag = zfbCftWapInput();
        if (flag) {
          util.showLoading();
          var request = charge.zfbWap(parameterValues, function (data) {
            util.hideLoading();
            if (typeof  data != "undefined" && typeof data.statusCode != "undefined") {
              if (data.statusCode == '0') {
                //跳转到支付宝页面.
                window.location.href = data.reqUrl;
                //$("#zftWapHref").attr("target", "_parent").attr("href", data.reqUrl).trigger("click");
              } else {
                page.toast(data.errorMsg);
                console.log('zfbWapPay===:' + data.statusCode);
              }
            } else {
              util.toast("充值出错,请联系客服");
            }
          });
          util.addAjaxRequest(request);
        }
      };

      /**
       *财付通充值.
       */
      var cftWapPay = function () {
        //校验文本输入.
        var flag = zfbCftWapInput();
        if (flag) {
          util.showLoading();
          var request = charge.cftWap(parameterValues, function (data) {
            util.hideLoading();
            if (typeof  data != "undefined" && typeof data.statusCode != "undefined") {
              if (data.statusCode == '0') {
                //$("#cftWapHref").attr("target", "_parent").attr("href", data.reqUrl).trigger("click");
                window.location.href = data.reqUrl;
              } else {
                console.log('cftWapPay===:' + data.statusCode);
                page.toast(data.errorMsg);
              }
            } else {
              page.toast("充值出错,请联系客服");
            }
          });
          util.addAjaxRequest(request);
        }
      };

      /**
       * 充值卡充值.
       */
      var ckzPay = function () {
        //输入校验.
        var flag = czkInput();
        if (flag) {
          util.showLoading();
          var request = charge.czk(parameterValues, function (data) {
            util.hideLoading();
            if (typeof data != "undefined" && typeof data.statusCode != "undefined") {
              if (data.statusCode == '0') {
                page.answer(
                    "支付请求提交成功", "充值卡支付请求提交成功，请2分钟后查询账户余额！",
                    "个人中心", "确定",
                    function (e) {
                      page.init("user/person", {}, 0);
                    },
                    function (e) {
                      page.init('charge/index', {}, 0);
                    }
                );
              } else {
                page.toast(data.errorMsg);
                console.log('ckzPay===:' + data.statusCode);
              }
            } else {
              page.toast("充值失败,请联系客服.");
            }
          });
          util.addAjaxRequest(request);
        }
      };

      /**
       * 直通卡充值.
       */
      var ztkPay = function () {
        var flag = ztkInput();
        if (flag) {
          util.showLoading();
          var request = charge.ztk(parameterValues, function (data) {
            util.hideLoading();
            if (typeof data != "undefined" && typeof data.statusCode != "undefined") {
              if (data.statusCode == '1') {
                page.answer(
                    "充值成功", "恭喜您充值成功",
                    "个人中心", "确定",
                    function (e) {
                      page.init("user/person", {}, 0);
                    },
                    function (e) {
                      page.init('charge/index', {}, 0);
                    }
                );
              } else {
                page.toast(data.errorMsg);
              }
            } else {
              page.toast("充值失败,请联系客服.");
            }
          });
          util.addAjaxRequest(request);
        }
      };

      /**
       * 绑定事件
       */
      var bindEvent = function () {
        $('.back').on('click', function () {
          if (type && result) {
            page.init('user/person', {}, 1);
          } else {
            if (canBack) {
              page.goBack();
            } else {
              if (userToken) {
                page.init('user/person', {"token": userInfo.token}, 0);
              } else {
                page.init("home", {}, 0);
              }
            }
          }
        });

        //优惠券说明
        $('.whbox').on('click', function () {
          page.init("user/getCoupon", {}, 1);
        });

        //页面选项卡切换[在线充值,充值卡充值,直通卡充值].
        $('.tabs').on('click', 'span', function (e) {
          $(".tabs span").removeClass("click");
          $(e.currentTarget).addClass("click");
          $('.wrapper').prop('id', $(e.target).data('type'));
        });

        //充值卡充值选项卡切换[神州行,联通卡,电信卡].
        $('.tabs1').on('click', 'span', function (e) {
          $(".tabs1 span").removeClass("click");
          $(e.currentTarget).addClass("click");
          $('.selectCzkMode').prop('id', $(e.target).data('type'));
          var select = $(e.target).data('type');
          var selectMoney = $('#' + select + '_panel').find('li.click').data('num');
          $('.sure_p').html('充值' + selectMoney + '元,到账' + (selectMoney - parseInt(selectMoney) * 0.04) + '元');
        });

        //充值卡[神州卡面额选择]
        $('.yd').on('click', 'li', function (e) {
          $(".yd li").removeClass("click");
          var $target = $(e.target);
          $target.addClass("click");
          //显示充值后的实际到账余额.
          var money = $target.data('num');
          $('.sure_p').html('充值' + money + '元,到账' + (money - parseInt(money) * 0.04) + '元');
        });

        //充值卡[联通卡面额选择]
        $('.lt').on('click', 'li', function (e) {
          $(".lt li").removeClass("click");
          var $target = $(e.target);
          $target.addClass("click");
          //显示充值后的实际到账余额.
          var money = $target.data('num');
          $('.sure_p').html('充值' + money + '元,到账' + (money - parseInt(money) * 0.04) + '元');
        });

        //充值卡[电信卡面额选择]
        $('.dxx').on('click', 'li', function (e) {
          $(".dxx li").removeClass("click");
          var $target = $(e.target);
          $target.addClass("click");
          //显示充值后的实际到账余额.
          var money = $target.data('num');
          $('.sure_p').html('充值' + money + '元,到账' + (money - parseInt(money) * 0.04) + '元');
        });

        //在线冲值[支付宝WAP，财付通WAP]
        $('.account').on('click', 'li', function (e) {
          var targetId = $(this).attr("id");
          switch (targetId) {
            case "zfb_charge":
              zfbWapPay();
              break;
            case "cft_charge":
              cftWapPay();
              break;
          }
        });

        //充值卡充值[移动,联通,电信]
        $('.loginbtn').on('click', function (e) {
          ckzPay();
        });

        //直通卡充值.
        $('.surebtn').on('click', function (e) {
          ztkPay();
        });

      };

      serialNumberMap = {
        //分别对应,充值方式: 序列号码支持长度,密码长度,支付通道对应编码.
        "yd_pay": {"serialNumberLen": 17, "passwordLen": 21, "type": "SZX"},
        "lt_pay": {"serialNumberLen": 15, "passwordLen": 19, "type": "UNICOM"},
        "dx_pay": {"serialNumberLen": 19, "passwordLen": 18, "type": "TELECOM"}
      };

      var browserParameterSettings = function (data, params) {

        //客户端请求带userToken,转换.
        var _form = util.unParam(window.location.href.split('?')[1]);
        var form = _form.data ? JSON.parse(_form.data) : _form;
        //客户端过来的userToken.
        userToken = form.userToken;
        //客户端过来的平台号.
        client_channelNo = form.channelNo || form.client_channelNo;
        //客户端过来的渠道号.
        client_platform = form.platform || form.client_platform;
        //从我的优惠券传递过来的优惠券号码.
        if (data && !_.isEmpty(data.couponCode) && data.couponCode) {
          couponCode = data.couponCode;
        }
        if (userToken) {
          params.userToken = userToken;
        }
        if (client_platform) {
          params.client_platform = client_platform;
        }
        if (client_channelNo) {
          params.client_channelNo = client_channelNo;
        }
        if (couponCode) {
          params.couponCode = couponCode;
        }

      };
      return {init: init};
    }
);