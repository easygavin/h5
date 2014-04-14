/**
 * 绑定银行卡
 */
define(function (require, exports, module) {
  var page = require('page'),
      events = require('events'),
      util = require('util'),
      $ = require('zepto'),
      _ = require('underscore'),
      account = require('services/account'),
      template = require("../../views/user/bindBankCard.html");

  // 处理返回参数
  var canBack = 0;

  //用户信息
  var userInfo = null;

  //数据组装.
  var parameterValues = {};

  /**
   * 初始化
   */
  var init = function (data, forward) {

    canBack = forward ? 1 : 0;

    userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);

    initShow();

    queryExistsBind();

    bindEvent();

    // 参数设置
    var params = {};

    var tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }

    // 处理返回
    page.setHistoryState({url: "user/bindBankCard", data: params},
        "user/bindBankCard",
        "#user/bindBankCard"+(JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""),
        canBack);
    util.hideLoading();
  };

  /**
   * 初始化显示
   */
  var initShow = function () {

    // compile our template
    var tmp = _.template(template);

    $("#container").empty().html(tmp());

  };

  /**
   * 查询用户是否绑定银行.
   */
  var queryExistsBind = function () {
    if (!_.isEmpty(userInfo) && userInfo.userId && userInfo.userKey) {
      account.getUserBalance(1, userInfo.userId, userInfo.userKey, function (data) {
        if (!_.isEmpty(data)) {
          if (data.statusCode == '0') {
            //初始化页面数据
              initPageData(data);
          } else if (data.statusCode == '0007') {
            //0007尚未绑定身份证.
            page.toast("您尚未进行身份验证");
            page.goBack();
          } else {
            //已经绑定身份证了,但尚未绑定银行卡
            queryInfo();
          }
        } else {
          page.toast('查询数据失败,请稍后重试');
        }
      });
    } else {
      page.init('login', {}, 1);
    }
  };
  /**
   *提供未绑定银行卡用户,信息搜集.
   */
  var queryInfo = function () {
    //银行列表.
    getBankList();
    //开户省市列表.
    getCityList();
    //提交按钮value
    $('.surebtn').html('立即绑定');
  };
  /**
   * 如果已经绑定银行卡则初始化页面数据.
   */
  var initPageData = function (data) {
    $('#selectedBank').html(data.bankName);
    $('#province').html(data.province);
    $('#city').html(data.city);
    $('#bankAccount').val(data.bankInfo);
    $('#bankNum').val(data.cardNo.substring(0,10)+'******');
    $('#bankPass').val('*******');
    $('#bankPassConf').val('*******');
    $('#main select').hide();
    $('#main input').attr('readonly',true);
    $('.selectbox i').hide();
    $('.surebtn').html('返回');
    $(document).off(events.activate(), ".surebtn").on(events.activate(), ".surebtn", function (e) {
      page.goBack();
    });
  };
  /**
   * 获取银行列表.
   */
  var getBankList = function () {
    util.showLoading();
    var request = account.getBankLists(function (data) {
      util.hideLoading();
      if (!_.isEmpty(data)) {
        //设置页面银行级联列表.
        setBankListWithPage(data);
      } else {
        page.toast('查询银行列表出错,请稍后重试');
      }
    });
    util.addAjaxRequest(request);
  };
  /**
   *根据银行列表信息与下拉框相对应.
   */
  var setBankListWithPage = function (bankListInfo) {
    var bankList = document.getElementById('bankList');
    for (var i = 1; i < bankListInfo.length; i++) {
      bankList.options.add(new Option(bankListInfo[i].bankName, bankListInfo[i].bankCode));
    }
    bankList.onchange = function () {
      $('#selectedBank').html($('#bankList option:selected').text());
    }
  };
  /**
   *设置省市级联.
   */
  var setProvinceCitySelect = function (data) {
    var all = data.citylist;
    var selectProvince = document.getElementById("selectProvince");
    var selectCity = document.getElementById("selectCity");
    //读取省列表.
    for (var i = 1; i < all.length; i++) {
      selectProvince.options.add(new Option(all[i].p, i));
    }
    //读取市列表.并且选择以后,则填充lable
    selectProvince.onchange = function () {
      selectCity.options.length = 0;
      var cities = all[selectProvince.value].c;
      for (var i = 0; i < cities.length; i++) {
        selectCity.options.add(new Option(cities[i].n));
      }
      var value = document.getElementById("selectProvince").value;
      var text = selectProvince.options[value - 1].text;
      $("#province").html(text);
    };
    selectCity.onchange = function () {
      var value = document.getElementById("selectCity").value;
      $("#city").html(value);
    };
  };
  /**
   * 获取省市列表.
   */
  var getCityList = function () {
    util.showLoading();
    var request = account.getBankLocus(function (data) {
      util.hideLoading();
      if (!_.isEmpty(data)) {
        setProvinceCitySelect(data);
      } else {
        page.toast("查询省市列表出错,请稍后重试");
      }
      util.addAjaxRequest(request);
    });
  };
  /**
   *文本输入校验.
   */
  var validateInputText = function () {
    //{银行名称,省份,城市,开户行,卡号,密码,确认密码}
    var bankName = $('#selectedBank').html(),
        province = $('#province').html(),
        city = $('#city').html(),
        bankAccount = $('#bankAccount').val(),
        bankNum = $('#bankNum').val(),
        bankPass = $('#bankPass').val(),
        bankPassConf = $('#bankPassConf').val();

    if (bankName == '请选择提款银行' || bankName == '' || bankName == null) {
      page.toast('请选择提款银行');
      return false;
    }
    if (province == '请选择' || province == '' || province == null) {
      page.toast('请选择开户省市');
      return false;
    }
    if (city == '请选择' || city == '' || city == null) {
      page.toast('请选择开户省市');
      return false;
    }
    if (bankAccount == '' || bankAccount == null) {
      page.toast('请填写开户行名称');
      return false;
    } else if (bankAccount.indexOf('支行') < 0) {
      page.toast('开户行必须包含"支行"文字');
      return false;
    }

    if (bankNum == '' || bankNum == null) {
      page.toast("请输入银行卡号");
      return false;
    } else if (bankNum.length < 16 || isNaN(bankNum)) {
      page.toast("请输入正确的银行卡号");
      return false;
    }

    if (bankPass == '' || bankPass == null) {
      page.toast('请输入提款密码');
      return false;
    } else if (bankPass.length < 6 || bankPass.length > 15) {
      page.toast("提款密码为6到15位数字或字母");
      return false;
    }
    if (bankPassConf == '' || bankPassConf == null) {
      page.toast("请输入确认提款密码");
      return false;
    } else if (bankPassConf.length < 6 || bankPassConf.length > 15) {
      page.toast("确认提款密码为6到15位数字或字母");
      return false;
    }

    if (bankPass != bankPassConf) {
      page.toast("提款密码与确认密码不一致");
      return false;
    }
    parameterValues.userId = userInfo.userId;
    parameterValues.userKey = userInfo.userKey;
    parameterValues.name = getUserTrueName();
    parameterValues.cardNo = bankNum;
    parameterValues.bankInfo = bankAccount;
    parameterValues.bankName = bankName;
    parameterValues.province = province;
    parameterValues.city = city;
    parameterValues.password = bankPass;
    parameterValues.confirmPassword = bankPassConf;
    parameterValues.bankCode = $('#bankList option:selected').val(); //银行代码.
    return true;
  };
  /**
   * 信息提交.
   */
  var toBind = function () {
    //文本校验.
    var flag = validateInputText();
    //提交数据.
    if (flag && !_.isEmpty(parameterValues)) {
      var request = account.bindUserBankCard(parameterValues, function (data) {
        if (!_.isEmpty(data)) {
          if (data.statusCode && data.statusCode == '0') {
            page.toast('绑定成功');
            page.goBack();
          } else {
            page.toast(data.errorMsg);
          }
        } else {
          page.toast('绑定失败,请稍候重试');
        }
      });
      util.addAjaxRequest(request);
    }

  };
  /**
   * 用户真实姓名.
   */
  var getUserTrueName = function () {
    //｛1.先从本地缓存取得,2.查询接口.｝
    var trueName = util.getLocalJson(util.keyMap.USER_TRUE_NAME);
    if (trueName && trueName != '') {
      return trueName;
    } else {
      util.showLoading();
      if (!_.isEmpty(userInfo) && userInfo.userId && userInfo.userKey) {
        account.inspectUserIDCardState(userInfo.userId, userInfo.userKey, function (data) {
          util.hideLoading();
          if (!_.isEmpty(data)) {
            if (data.statusCode && data.statusCode == '0') {
              //存储用户的真实姓名.在绑定银行卡页面需要.
              util.setLocalJson(util.keyMap.USER_TRUE_NAME, data.name);
              trueName = data.name;
              return trueName;
            } else {
              page.toast(data.errorMsg);
            }
          } else {
            page.toast('查询真实姓名失败,请稍后重试!');
            page.goBack();
          }
        });
      } else {
        page.init('login', {}, 1);
      }
    }
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {

    // 返回
    $(document).off(events.touchStart(), ".back").on(events.touchStart(), ".back", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), ".back").on(events.activate(), ".back", function (e) {
      if (canBack) {
        page.goBack();
      } else {
        page.init("home", {}, 0);
      }
      return true;
    });

    // 返回
    $(document).off(events.touchStart(), ".surebtn").on(events.touchStart(), ".surebtn", function (e) {
      events.handleTapEvent(this, this, events.activate(), e);
      return true;
    });

    $(document).off(events.activate(), ".surebtn").on(events.activate(), ".surebtn", function (e) {
      toBind();
      return true;
    });

  };

  return {init: init};
});