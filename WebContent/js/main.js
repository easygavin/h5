define(function (require, exports, module) {
  var $ = require('zepto'),
    page = require('page'),
    util = require('util');
  // 页面加载完毕
  $(document).ready(function () {
    // 加载图标
    util.showLoading();
    // 参数处理
    var hash = location.hash,
      hashName = "";
    var search = location.search,
      dataObj = {};
    if (hash != "undefined" && hash !== "") {
      hash = hash.substring(1).split("?");
      hashName = hash;
    }
    if (search != "undefined" && search !== "") {
      var searchData = util.unParam(search.substring(1));
      if (typeof searchData["data"] != "undefined") {
        console.log(searchData["data"]);
        dataObj = JSON.parse(decodeURIComponent(searchData["data"]));
      }
    }
    if ($.trim(hashName) === "") {
      hashName = "home";
    }
    // 启动页面模块
    page.init(hashName, dataObj, 0);

    $(window).on("popstate", function (e) {
      if (e.state) {
        if (e.state.url) {
          page.init(e.state.url, e.state.data, 0);
        }
      }
    });
  });
});
