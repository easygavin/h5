/**
 * Created by Administrator on 14-3-26.
 */
define(function (require, exports, module) {
  var $ = require('zepto'),
    util = require('util'),
    page = require('page'),
    _ = require('underscore'),
    view = require('/views/athletics/lottery_list.html');

  var analyse = {
    init: function (data, forward) {
      var self = this;
      $("#container").html(view);
      self.canBack = forward || 0;
      self.type = 'op';
      self.forward = forward;

      self.getData();
      self.events();
      page.setHistoryState(
        {url: "jcz/lottery_list", data: this.params},
        "jcz/lottery_list",
          (JSON.stringify(self.params).length > 2 ?
            "?data=" + encodeURIComponent(JSON.stringify(self.params)) : "") + "#jcz/lottery_list",
        self.canBack ? 1 : 0);
    },
    getData: function () {
      util.showLoading();
      var self = this;
      service.getJCZQAgainstInfo(self.params, function (data) {
        if (data) {
          self.data = data;
          self.show();
          util.hideLoading();
        } else {
          page.toast('获取数据失败');
        }
      });
    },
    show: function () {

    },
    events: function () {
      $('.back').on('click', page.goBack);
      $('#tabs').on('click', 'a', this.switchTab.bind(this));
      $('#refresh').on('click', this.getData.bind(this));
    }
  };
  module.exports = analyse;
});