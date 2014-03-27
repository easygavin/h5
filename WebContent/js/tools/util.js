/**
 * Util Collections
 */
define(function (require, exports, module) {
  var $ = require('zepto');
  var util = {};
  // Shake 参数
  var shake = {
    SHAKE_THRESHOLD: 2000,
    lastUpdate: 0,
    x: 0, y: 0, z: 0,
    last_x: 0, last_y: 0, last_z: 0
  };
  // 名称空间
  var ecp = {};
  // 动态存储数据
  ecp.data = {};
  // 无痕浏览
  var nonMark = false;
  // Ajax Request 集合
  var ajaxRequests = [];
  // 登录token
  util.token = "";
  // 关键字Map
  util.keyMap = {
    LOCAL_USER_INFO_KEY: "local_user_info", // 本地登录用户信息
    LOCAL_TO_HM:"local_to_hm", // 发起合买
    LOCAL_CUSTOM: "local_custom", // 用户定制彩种
    LOCAL_SSQ: "local_ssq",// 双色球
    LOCAL_DLT: "local_dlt",// 大乐透
    LOCAL_F3D: "local_f3d",// 福彩3D
    LOCAL_JCZ: 'local_jcz' // 竞彩足球
  };

  /**
   * 显示遮盖层
   */
  util.showCover = function () {
    var bodyHeight = Math.max(document.documentElement.clientHeight, document.body.scrollHeight);
    $(".cover").css({"height": bodyHeight + "px"}).show();
  };

  /**
   * 隐藏遮盖层
   */
  util.hideCover = function () {
    $(".cover").hide();
  };

  /**
   * 显示加载图标
   */
  util.showLoading = function () {
    var $load = $(".load");
    if (!$load.is(":visible")) {
      $load.show();
    }
  };

  /**
   * 隐藏加载图标
   */
  util.hideLoading = function () {
    var $load = $(".load");
    if ($load.is(":visible")) {
      $load.hide();
    }
  };

  /**
   * shake处理
   * @param eventData
   * @param callback
   */
  util.deviceMotionHandler = function (eventData, callback) {
    // Grab the acceleration including gravity from the results
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();
    if ((curTime - shake.lastUpdate) > 100) {
      var diffTime = (curTime - shake.lastUpdate);
      shake.lastUpdate = curTime;
      shake.x = acceleration.x;
      shake.y = acceleration.y;
      shake.z = acceleration.z;
      var speed = Math.abs(shake.x + shake.y + shake.z - shake.last_x - shake.last_y - shake.last_z) / diffTime * 10000;
      if (speed > shake.SHAKE_THRESHOLD) {
        callback();
      }
      shake.last_x = shake.x;
      shake.last_y = shake.y;
      shake.last_z = shake.z;
    }
  };


  /**
   * 获取本地字符串信息
   * @param key
   * @return {*}
   */
  util.getLocalString = function (key) {
    if (localStorage.getItem && !nonMark) {
      return localStorage.getItem(key);
    } else {
      return ecp.data[key];
    }
  };

  /**
   * 设置本地字符信息
   * @param key
   * @param val
   */
  util.setLocalString = function (key, val) {
    if (localStorage.setItem) {
      try {
        localStorage.removeItem(key);
        localStorage.setItem(key, val);
      } catch (e) {
        nonMark = true;
        ecp.data[key] = val;
      }
    } else {
      ecp.data[key] = val;
    }
  };

  /**
   * 删除本地字符串信息
   * @param key
   */
  util.clearLocalData = function (key) {
    if (localStorage.removeItem && !nonMark) {
      localStorage.removeItem(key);
    } else {
      ecp.data[key] = [];
    }
  };

  /**
   * 获取本地Json数据
   * @param key
   * @return {*}
   */
  util.getLocalJson = function (key) {
    if (localStorage.getItem && !nonMark) {
      var localVal = localStorage.getItem(key);
      return localVal === null ? null : JSON.parse(localVal);
    } else {
      return ecp.data[key];
    }
  };

  /**
   * 设置本地json数据
   * @param key
   * @param val
   */
  util.setLocalJson = function (key, val) {
    if (localStorage.setItem) {
      try {
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {
        nonMark = true;
        ecp.data[key] = val;
      }
    } else {
      ecp.data[key] = val;
    }
  };

  /**
   * 阶乘计算 m > n
   */
  util.getFactorial = function (m, n) {
    if (m <= 0 || n <= 0 || m < n) {
      return 0;
    }
    var max = m, min = n, total = 1, div;
    // m * (m-1) * (m 2) * ... * (n+1)
    for(var i = min + 1; i <= max; i++) {
      total *= i;
      div = i - min;
      total /= div;
    }
    return total;
  };

  /**
   * 从n个元素中取出m个元素的组合公式n!/((n-m)!m!)
   * @param m 6-胆
   * @param n 拖
   * @return
   */
  util.getCombineCount = function (m, n) {
    if (m < 0 || n < 0 || n < m) {
      return 0; // 当m小于0时返回0 by:liaoyuding
    }
    if (m === 0 || n === 0) {
      return 1;// 当m为0或者n 为 0 时,返回 1 by :zw
    }
    var n1 = 1, n2 = 1;
    for(var i = n, j = 1; j <= m; n1 *= i--, n2 *= j++) {

    }
    return n1 / n2;
  };

  /**
   * 从n个元素中取出m个元素的排列公式n!/(n-m)!
   * @param m
   * @param n
   * @return
   */
  util.getPLNumber = function (m, n) {
    var p = 1;
    if (m <= 0 || n <= 0 || n < m) {
      return 0;
    }
    p = this.getJCNumber(n) / this.getJCNumber(n - m);
    console.log("从" + n + "个不同的数中取" + m + "个数字的排列数：" + p);
    return p;
  };

  /**
   * 计算n的阶乘1*2*3*4。。。。n-1
   * @param n
   * @return
   */
  util.getJCNumber = function (n) {
    var result = 1;
    if ((n < 0) || (n > 19)) {
      return -1;
    }
    for(var i = 1; i <= n; i++) {
      result = i * result;
    }
    return result;
  };

  /**
   * 随机从m---n数中，随机选择count个数，并用spilt分割
   * @param m 开始数
   * @param n 结束数
   * @param count 随机个数
   */
  util.getSrand = function (m, n, count) {
    var arr = [];
    if (m == n || m > n || count === 0) {
      return arr;
    }

    do {
      var val = this.getRandom(m, n);
      if (!this.isContain(arr, val)) {
        arr.push(val);
      }
    } while (arr.length < count);
    // 排序
    arr = this.sortNumber(arr, "asc");
    return arr;
  };

  /**
   * 指定范围的一个随机数
   * @param s 开始数
   * @param e 结束数
   * @return {Number}
   */
  util.getRandom = function (s, e) {
    return Math.floor(Math.random() * (e + 1 - s)) + s;
  };

  /**
   * 数组中是否包含某项值
   * @param arr 数组
   * @param n 某项值
   * @return {Boolean}
   */
  util.isContain = function (arr, n) {
    for(var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] == n) {
        return true;
      }
    }
    return false;
  };

  /**
   * 数组排序
   * @param arr 数组
   * @param ad 排序方式
   * @return {*}
   */
  util.sortNumber = function (arr, ad) {
    var f = ad != "desc" ? function (a, b) {
      return a - b;
    } : function (a, b) {
      return b - a;
    };
    return arr.sort(f);
  };

  /**
   * 检查是否已经登录
   * @param data
   * @return {String}
   */
  util.checkLogin = function (data) {
    var nowToken = "";
    if ($.trim(this.token) !== "") {
      // 获取缓存的token值
      nowToken = this.token;
    } else if (data !== null && typeof data != "undefined") {
      // 获取地址栏token值
      nowToken = data.token;
    } else {
      return "";
    }

    // 本地保存用户token值
    var userInfo = this.getLocalJson(this.keyMap.LOCAL_USER_INFO_KEY);
    if (nowToken !== null && typeof nowToken != "undefined" &&
      $.trim(nowToken) !== "" &&
      userInfo !== null && userInfo.token !== null &&
      typeof userInfo.token != "undefined" &&
      $.trim(userInfo.token) !== "") {
      if ($.trim(nowToken) == $.trim(userInfo.token)) {
        this.token = nowToken;
        return nowToken;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  /**
   * 添加Ajax Request 请求对象
   * @param r
   */
  util.addAjaxRequest = function (r) {
    ajaxRequests.push(r);
  };

  /**
   * 清除Ajax Request 请求
   */
  util.clearAjaxRequests = function () {
    for(var i = 0, len = ajaxRequests.length; i < len; i++) {
      if (typeof ajaxRequests[i]["abort"] == "function") {
        ajaxRequests[i].abort();
        console.log("request abort!");
      }
    }
    ajaxRequests = [];
  };
  //将查询字符串解析成一个对象
  util.unParam = function (str) {
    var rs = {};
    if (typeof str == 'string' && (str = $.trim(str))) {
      var decode = decodeURIComponent,
        pairs = str.split('&');
      for(var i = 0, l = pairs.length; i < l; ++i) {
        var pair = pairs[i].split('='),
          key = decode(pair[0]).replace('[]', ''),
          val = decode(pair[1]);
        if (key in rs) {
          if ($.isArray(rs[key])) {
            rs[key].push(val);
          } else {
            rs[key] = [rs[key], val];
          }
        } else {
          rs[key] = val;
        }
      }
    }
    return rs;
  };
  module.exports = util;
});