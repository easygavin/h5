/**
 * 合买详情页
 */
define(function (require, exports, module) {
  var page = require('page'), util = require('util'), $ = require('zepto'), _ = require('underscore'), path = require('path'), hm = require('services/hm'), template = require("/views/hm/hmdetail.html");

  //彩种Id
  var lotteryType = '';
  //方案编号
  var projectId = '';
  //查询类型
  var requestType = '';
  //登录状态
  var tkn;
  //合买单详情接口地址.
  var hmDetailUrl = '';
  //用于判断显示数字彩,还是竞彩.
  var display_flag = '';
  //合买信息.
  var hmDetailData = {};
  //购买份数
  var residue;
  //剩余份数
  var totalResidue;
  //单份金额.
  var singleMoney;

  /**
   * 初始化
   */
  var init = function (data, forward) {
    //加载模版.
    $("#container").html(template);
    // 参数设置
    var params = {};
    tkn = util.checkLogin(data);
    if (tkn) {
      params.token = tkn;
    }
    if (data != null && typeof data != 'undefined') {
      if (typeof data.lotteryType != '' && $.trim(data.lotteryType) != '') {
        lotteryType = data.lotteryType;
        params.lotteryType = lotteryType;
      }
      if (typeof data.projectId != '' && $.trim(data.projectId) != '') {
        projectId = data.projectId;
        params.projectId = projectId;
      }
      if (typeof data.requestType != '' && $.trim(data.requestType) != '') {
        requestType = data.requestType;
        params.requestType = requestType;
      }
    }
    //获取接口地址.
    getHMInterfaceUrl();
    //获取数据
    getDetail();
    //绑定事件
    bindEvent();
    // 处理返回
    page.setHistoryState({url : "hm/hmdetail", data : params}, "hm/hmdetail", "#hm/hmdetail" + (JSON.stringify(params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(params)) : ""), forward ? 1 : 0);
    // 隐藏加载标示
    util.hideLoading();
  };


  /**
   *获取接口url
   */
  var getHMInterfaceUrl = function () {
    if (lotteryType != '') {
      switch (lotteryType) {
        //数字彩｛双色球,福彩3D,大乐透,排列3,排列5,七星彩,七乐彩｝
        case "11":
        case "12":
        case "13":
        case "4":
        case "6":
        case "8":
        case "88":
          hmDetailUrl = path.DIGIT_HM_DETAIL;
          display_flag = 'digit';
          break;
        //竞彩足球合买详情接口.
        case "46":
        case "47":
        case "48":
        case "49":
        case "52":
        case "56":
          hmDetailUrl = path.JCZQ_HM_DETAIL;
          display_flag = 'jc';
          break;
        //竞彩篮球合买详情接口.
        case"36":
        case"37":
        case"38":
        case"39":
        case"53":
          hmDetailUrl = path.JCLQ_HM_DETAIL;
          display_flag = 'jc';
          break;
        //北京单场
        /* case"89":
         case"92":
         break;
         hmDetailUrl = path.BJDC_HM_DETAIL;
         display_flag = 'bjdc';
         */
      }
    }
  };

  /**
   *获取方案详情
   */
  var getDetail = function () {

    if (lotteryType != '' && requestType != '' && projectId != '' && hmDetailUrl != '') {
      var userId = '', userKey = '';
      if (tkn) {
        var userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
        userId = userInfo.userId, userKey = userInfo.userKey;
      }
      util.showLoading();
      var request = hm.getHmDetail(lotteryType, requestType, projectId, hmDetailUrl, userId, userKey, function (data) {
        // 隐藏加载标示
        util.hideLoading();
        if (typeof data != "undefined") {
          if (typeof data.statusCode != "undefined") {
            if (data.statusCode == "0") {
              setPageInfo(data);
              require.async('/tpl/hm/hm_detail', function (tpl) {
                $('#main').html(tpl({
                    data : data,
                    display_flag : display_flag
                  }));
              });
            } else if (data.statusCode == "off") {
              page.init("login", {}, 1);
            } else {
              page.toast(data['errorMsg']);
            }
          }
        }
      });
      util.addAjaxRequest(request);
    }
  };

  /**
   *配置页面的信息
   */
  var setPageInfo = function (data) {
    hmDetailData = data;
    singleMoney = data.oneAmount;
    totalResidue = parseInt(data.totalCount, 10) - parseInt(data.buyVolume, 10);
    var residue = parseInt(data.totalCount) - parseInt(data.buyVolume);
    //$('#residue').val('剩' + residue + '份');
    $('#residue').attr('placeholder', "剩" + residue + "份");
  };

  /**
   * 参与合买.
   */
  var toBuy = function () {

    // 尚未登录，弹出提示框
    if (!tkn) {
      page.answer("", "您还未登录，请先登录", "登录", "取消", function () {
        page.init("login", {}, 1);
      }, function () {
        $(".popup").hide();
      });
      return false;
    }
    //输入校验.
    if (residue == 0 || isNaN(residue)) {
      page.toast('输入份数不正确');
      return false;
    } else if (residue > totalResidue) {
      page.toast('超过最大份数');
      return false;
    }

    var userInfo = util.getLocalJson(util.keyMap.LOCAL_USER_INFO_KEY);
    var requestPrams = {};
    requestPrams.projectBuy = residue;         //份数
    requestPrams.platform = path.platform;     //平台号
    requestPrams.channelNo = path.channelNo;   //渠道号
    requestPrams.userKey = userInfo.userKey;   //UserKey
    requestPrams.userId = userInfo.userId;     //UserId
    requestPrams.lotteryType = lotteryType;    //彩种id
    requestPrams.purchaseMoney = singleMoney;  //每份金额
    requestPrams.projectId = projectId;        //方案Id
    hm.joinHm(requestPrams, function (datas) {
      if (!_.isEmpty(datas)) {
        if (typeof datas.statusCode != 'undefined' && datas.statusCode == '0') {
          page.toast('购买成功');
          page.goBack();
        } else {
          page.toast(datas.errorMsg);
        }
      } else {
        page.toast('购买失败,请稍后重试!');
      }
    });
  };

  /**
   * 绑定事件
   */
  var bindEvent = function () {
    $('.back').on('click', page.goBack);
    /**
     * 份数输入框的变化.
     */
    $('#residue').on('keyup change', function () {
      this.value = this.value.replace(/\D/g, '');
      var $residue = $(this);
      residue = $residue.val();
      if (residue == '' || isNaN(residue) || residue < 1) {
        residue = 1;
      } else if (residue > totalResidue) {
        page.toast("亲，最多只能选择" + totalResidue + "份哦!");
        $residue.val(totalResidue);
        residue = totalResidue;
      }
      $('#payMoney').html(residue + '份' + singleMoney * residue + '元');
    });
    $('.a2').on('click', toBuy);
  };
  return {init : init};
});