/**
 * 竞彩足球合买
 */
define(function (require, exports, module) {
  var $ = require('zepto'),
    util = require('util'),
    page = require('page'),
    service = require('services/jcz'),
    pageTpl = require('/views/athletics/jcz/join.html');

  var analyse = {
    init: function (data, forward) {
      var self = this;
      $("#container").html(pageTpl);
      self.canBack = forward || 0;
      self.forward = forward;
      self.data = {};
      self.params = data;
      self.getData();
      self.events();
      page.setHistoryState(
        {url: "jcz/join", data: self.params},
        "jcz/join",
          (JSON.stringify(self.params).length > 2 ?
            "?data=" + encodeURIComponent(JSON.stringify(self.params)) : "") + "#jcz/join",
        self.canBack ? 1 : 0);
    },
    getData: function () {
      util.showLoading();
      var self = this;
      service.getJCZQAgainstInfo(self.params, function (data) {
        if (data.statusCode == 0) {
          self.data = data;
          self.show();
        } else {
          page.toast('获取数据失败');
        }
        util.hideLoading();
      });
    },
    show: function () {
      var data = this.data,
        _data ,
        url = '/tpl/athletics/jcz/oyd',
        tableHtml = '';
      $('#teamInfo').find('.host').html(data.hostName);
      $('#teamInfo').find('.score').html(data.hostAllRank + ':' + data.visitAllRank);
      $('#teamInfo').find('.visit').html(data.visitName);
      switch (this.type) {
        case 'jf':
          url = '/tpl/athletics/jcz/jf';
          _data = {
            hostName: data.hostName,
            visitName: data.hostName,
            host: [ data.integral.host.all, data.integral.host.zhu, data.integral.host.ke],
            visit: [ data.integral.visit.all, data.integral.visit.zhu, data.integral.visit.ke]
          };
          break;
        case 'zj':
          url = '/tpl/athletics/jcz/history';
          _data = {
            hostName: data.hostName,
            visitName: data.hostName,
            jf: data.history['0'].jfHistory,
            host: data.history['0'].hostHistory,
            visit: data.history['0'].visitHistory
          };
          break;
        case 'op':
          _data = {data: data.oydx.europe};
          break;
        case 'yp':
          _data = {data: data.oydx.asia};
          break;
        case 'dx':
          _data = {data: data.oydx.dx};
          break;
      }
      require.async(url, function (tpl) {
        tableHtml = tpl(_data);
        $('#detail').html(tableHtml);
      });
    },
    switchTab: function (e) {
      var $tar = $(e.target);
      this.type = $tar.data('type');
      $('#tabs').find('.click').removeClass('click');
      $tar.addClass('click');
      this.show();
    },
    events: function () {
      $('.back').on('click', page.goBack);
      $('#tabs').on('click', 'a', this.switchTab.bind(this));
      $('#refresh').on('click', this.getData.bind(this));
    }
  };
  module.exports = analyse;
});