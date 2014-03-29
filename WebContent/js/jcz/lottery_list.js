define(function (require, exports, module) {
  var $ = require('zepto'),
    util = require('util'),
    page = require('page'),
    _ = require('underscore'),
    service = require('services/jcz'),
    view = require('/views/athletics/lottery_list.html');
  var lotteryList = {
    init: function (data, forward) {
      var self = this;
      $("#container").html(view);
      self.canBack = forward || 0;
      self.type = 'op';
      self.forward = forward;
      self.params = data;
      self.getData();
      self.events();
      page.setHistoryState(
        {url: "jcz/lottery_list", self: this.params},
        "jcz/lottery_list",
          (JSON.stringify(self.params).length > 2 ?
            "?data=" + encodeURIComponent(JSON.stringify(self.params)) : "") + "#jcz/lottery_list",
        self.canBack ? 1 : 0);
    },
    getData: function () {
      util.showLoading();
      var self = this;
      service.getHistoryAwards(self.params, function (data) {
        if (data && data.statusCode == 0) {
          self.data = data;
          self.show();
          util.hideLoading();
        } else {
          page.toast('获取数据失败');
        }
      });
    },
    show: function () {
      var self = this,
        rsList = self.data.datas,
        htmlStr = '',
        matchTpl = require('/tpl/athletics/lottery_list');
      console.log(rsList);
      _.each(rsList, function (rs) {
        htmlStr += matchTpl({data: rs});
      });
      $('#main').html(htmlStr);
    },
    events: function () {
      $('.back').on('click', page.goBack);
    }
  };
  module.exports = lotteryList;
});