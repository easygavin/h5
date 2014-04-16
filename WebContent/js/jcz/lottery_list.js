define(function (require, exports, module) {
  var $ = require('zepto'),
    util = require('util'),
    page = require('page'),
    _ = require('underscore'),
    service = require('services/jcz'),
    fastClick = require('fastclick'),
    view = require('/views/athletics/lottery_list.html');
  var lotteryList = {
    init: function (data, forward) {

      var self = this;
      $("#container").html(view);
      self.canBack = forward || 0;
      self.type = 'op';
      self.forward = forward;
      self.params = _.isEmpty(data) ? JSON.parse(util.unParam(location.search.substring(1)).data) : data;
      self.infoMap = {};
      self.getData();
      self.events();
      page.setHistoryState(
        {url: "jcz/lottery_list", self: this.params},
        "jcz/lottery_list",
          (JSON.stringify(self.params).length > 2 ?
            "?data=" + encodeURIComponent(JSON.stringify(self.params)) : "") + "#jcz/lottery_list",
        self.canBack ? 1 : 0);
    },
    getData: function (date) {
      util.showLoading();
      util.showCover();
      var self = this;
      date && $.extend(self.params, { date: date});
      service.getHistoryAwards(self.params, function (data) {
        if (data && data.statusCode == 0) {
          self.data = data;
          self.show();
          util.hideLoading();
          util.hideCover();
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
      _.each(rsList, function (rs) {
        _.each(rs.matchArray, function (match) {
          self.infoMap[match.matchId] = match;
        });
        htmlStr += matchTpl({data: rs});
      });
      $('#lotteryName').html('竞彩足球');
      htmlStr ? $('#main').html(htmlStr) : page.toast('该日期内没有开奖数据');
    },
    getDateList: function () {
      var list = this.data.IssueList.split(','),
        htmlString = '';
      _.each(list, function (i) {
        htmlString += '<a data-date="' + i + '">' + i + '</a>'
      });
      $('.popup').addClass('success').html(htmlString);
    },
    openFilter: function () {
      var $tar = $('.popup');
      !$tar.hasClass('success') && this.getDateList();
      $('.popup').toggle();
    },
    filterByDate: function (e) {
      var date = $(e.target).data('date');
      this.getData(date);
      $('.popup').hide();
    },
    goBetRecord: function () {
      page.init("user/buyRecord", {lotteryId: "46"}, 1);
    },
    goDetail: function (e) {
      var matchId = $(e.currentTarget).data('matchId');
      page.init("jcz/detail", this.infoMap[matchId], 1);
    },
    events: function () {
      //fastclick events
      fastClick.attach(document.body);
      $('.back').on('click', page.goBack);
      $('.select').on('click', this.openFilter.bind(this));
      $('.popup').on('click', this.filterByDate.bind(this));
      $('#wrapper').on('click', '.match', this.goDetail.bind(this));
      $('footer').on('click', this.goBetRecord.bind(this));
    }
  };
  module.exports = lotteryList;
});