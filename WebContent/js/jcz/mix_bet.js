/**
 * Created by xf.radish on 14-3-20.
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('zepto'),
    _ = require('underscore'),
    util = require('util'),
    page = require('page'),
    config = require('config'),
    fastClick = require('fastclick'),
    service = require('services/jcz'),
    betTpl = require('/views/athletics/jcz/mix_bet.html');
  module.exports = {
    canBack: 0,
    init: function (data, forward) {
      this.lotteryType = 46;
      // 加载模板内容
      $("#container").html(betTpl);
      this.$page = $('#jczMixedView');
      this.canBack = forward || 0;
      this.params = {
        token: util.checkLogin(data) || undefined
      };
      this.betList = {};//对阵列表数据
      this.matchMap = {};// match Map值
      this.bufferData = {};// 缓存的数据
      this.pay = 0;// 消费金额
      this.total = 0;// 注数
      this.issueNo = "";// 显示期号
      this.leagueMap = {};// 赛事分类
      this.leagueLength = 0;// 一共有多少对阵
      this.selLeague = null;// 被选中的联赛
      this.initShow(this.canBack);
      this.bindEvent();
      page.setHistoryState(
        {url: "jcz/mix_bet", data: this.params},
        "jcz/mix_bet",
          (JSON.stringify(this.params).length > 2 ?
            "?data=" + encodeURIComponent(JSON.stringify(this.params)) : "") + "#jcz/mix_bet",
        this.canBack);
    },
    //初始化显示
    initShow: function (forward) {
      if (forward) {
        this.getBetList();
      } else {
        // 根据缓存数据判断是否需要重新拉取列表
        var bufferData = util.getLocalJson(util.keyMap.LOCAL_JCZ);
        if (bufferData && this.betList && this.betList.datas) {
          this.handleBetList();
          this.showBuffer();
        } else {
          this.getBetList();
        }
      }
      this.unitTotal();
    },
    //获取对阵列表
    getBetList: function () {
      var self = this;
      service.getJCZQBetList(this.lotteryType, function (data) {
        if (typeof data && typeof data.statusCode) {
          if (0 == data.statusCode) {
            self.betList = data;
            self.handleBetList();
            util.hideLoading();
          } else {
            page.toast(data['errorMsg']);
          }
        }
      });
    },
    //统计赛事场数
    unitTotal: function () {
      var total = 0;
      $('.match').each(function (i, item) {
        total = total + ~~!!$(item).find(".click").length;
      });
      this.total = total;
      $("#selectNum").text(total);
    },
    clearSelect: function () {
      $('td[class^="odds"]').removeClass('click');
      $('.match').find('.arr').removeClass('f07e04');
      $("#selectNum").text(0);
      this.total = 0;
    },
    goBuy: function () {
      if (this.betList && this.betList.datas) {
        if (this.total > 1) {
          this.recordUserSelected();
          page.init("jcz/list", {}, 1);
        } else {
          page.toast("至少选择2场比赛")
        }
      } else {
        page.toast("无法获取期号");
      }
    },
    /**
     * 点击对阵赛事的欧亚盘,以及确认按钮,
     * back的时候要记录所选定的比赛.
     */
    recordUserSelected: function () {
      var self = this;
      self.bufferData = {};
      self.bufferData.issueNo = self.issueNo;
      var titleMap = {};// 标题对象
      var matchBetList = [];// 赛事对阵列表
      $('.match').each(function (i, item) {
        var $item = $(item);
        if ($item.find(".click").length) {
          // 每场赛事数据
          var data = {};
          // 获取matchId
          var matchId = $item.data('matchId');
          data.matchId = matchId;
          data.match = self.matchMap[matchId];
          if (matchId) {
            // 选中模式
            // 球胜平负
            var spfIds = [], $spf = $item.find(".spf_bet .click");
            $spf.length && $spf.each(function (j, spf) {
              var spfId = $(spf).attr("id").split("-")[0];
              spfIds.push(spfId);
            });
            titleMap["spf"] = $spf.length;
            data.spfIds = spfIds;

            // 让球胜平负
            var rqspfIds = [], $rqspf = $item.find(".rqspf_bet .click");
            $rqspf.length && $rqspf.each(function (k, rqspf) {
              var rqspfId = $(rqspf).attr("id").split("-")[0];
              rqspfIds.push(rqspfId);
            });
            titleMap["rqspf"] = $rqspf.length;
            data.rqspfIds = rqspfIds;

            // 总进球
            var zjqIds = [], $zjq = $item.find(".zjq_bet .click");
            $zjq.length && $zjq.each(function (d, zjq) {
              var zjqId = $(zjq).attr("id").split("-")[0];
              zjqIds.push(zjqId);
            });
            titleMap["zjq"] = $zjq.length;

            data.zjqIds = zjqIds;

            // 半全场
            var bqcIds = [], $bqc = $item.find(".bqc_bet .click");
            $bqc.length && $bqc.each(function (c, bqc) {
              var bqcId = $(bqc).attr("id").split("-")[0];
              bqcIds.push(bqcId);
            });
            titleMap["bqc"] = $bqc.length;
            data.bqcIds = bqcIds;

            //比分
            var bfIds = [], $bf = $item.find(".lRTable .click");
            $bf.length && $bf.each(function (c, bf) {
              var bfId = $(bf).attr("id").split("-")[0];
              bfIds.push(bfId);

            });
            titleMap["bf"] = $bf.length;
            data.bfIds = bfIds;
            matchBetList.push(data);
          }
        }
      });
      this.bufferData.matchBetList = matchBetList;
      this.bufferData.titleMap = titleMap;
      util.setLocalJson(util.keyMap.LOCAL_JCZ, this.bufferData);

    },
    //处理对阵列表
    handleBetList: function () {
      var matchLen = 0;
      this.issueNo = this.betList.datas[0].issueNo;
      _.each(this.betList.datas, function (data) {
        matchLen += data['matchArray'].length;
      });
      this.showIssueNo(matchLen);
      this.showMatchItems();
      this.leagueLength = matchLen;
    },
    //显示期号
    showIssueNo: function (matchLen) {
      var htmlStr = matchLen ? this.issueNo + "期，共" + matchLen + "场比赛可投注" : '加载数据失败';
      $("#JMIssueNo").text(htmlStr);
      this.updateSelMatLen(matchLen, false);
    },
    // 处理数据并显示赛事列表
    showMatchItems: function () {
      var self = this,
        htmlStr = '',
        matchTpl = require('/tpl/athletics/jcz/match');
      _.each(this.betList.datas, function (data) {
        _.each(data['matchArray'], function (m) {
          // 缓存赛事数据
          self.matchMap[m.matchId] = m;
          // 计算联赛map
          if (!self.leagueMap[m.leagueMatch]) {
            self.leagueMap[m.leagueMatch] = 1;
          }
          self.leagueMap[m.leagueMatch]++;
          htmlStr += matchTpl(m);
        });
      });
      $("#matchList").html(htmlStr);
    },
    //添加赛事种类列表
    addLeagueItems: function () {
      var htmlStr = '',
        $leagueBox = $('.leagueBox');
      _.map(this.leagueMap, function (value, key) {
        htmlStr += '<li class="item click" data-num="' + value + '">' + key + '[' + value + ']场</li>';
      });
      $leagueBox.addClass('success').find('.icon').html(htmlStr);
    },
    //更新选择赛事类型中的场数
    updateSelMatLen: function (num, opt) {
      var $selectNum = $(".leagueBox .red"),
        selectNum = (opt ? +$selectNum.text() : 0) + num;
      $selectNum.text(selectNum);
      opt && this.toggleSelAllLea(selectNum);
    },
    toggleSelAllLea: function (selectNum) {
      if (selectNum == this.leagueLength) {
        $('.leagueBox .selAll').text('全不选');
      } else {
        $('.leagueBox .selAll').text('全选');
      }
    },
    //显示缓存数据
    showBuffer: function () {
      var matchBetList = this.bufferData.matchBetList;
      for(var i = 0, len = matchBetList.length; i < len; i++) {
        var item = matchBetList[i];
        var matchId = item.matchId;
        var spfIds = item.spfIds,
          rqspfIds = item.rqspfIds,
          zjqIds = item.zjqIds,
          bqcIds = item.bqcIds,
          bfIds = item.bfIds;

        if (rqspfIds.length > 0 || zjqIds.length > 0 || bqcIds.length > 0 || bfIds.length > 0) {
          // 显示SP层
          showSPOptions(matchId);
        }

        // 胜平负
        for(var j = 0, jLen = spfIds.length; j < jLen; j++) {
          $("#" + spfIds[j] + "-" + matchId).addClass("click");
        }

        // 让球胜平负
        for(var k = 0, kLen = rqspfIds.length; k < kLen; k++) {
          $("#" + rqspfIds[k] + "-" + matchId).addClass("click");
        }

        // 总进球
        for(var d = 0, dLen = zjqIds.length; d < dLen; d++) {
          $("#" + zjqIds[d] + "-" + matchId).addClass("click");
        }

        // 半全场
        for(var c = 0, cLen = bqcIds.length; c < cLen; c++) {
          $("#" + bqcIds[c] + "-" + matchId).addClass("click");
        }

        // 比分
        for(var f = 0, bLen = bfIds.length; f < bLen; f++) {
          $("#" + bfIds[f] + "-" + matchId).addClass("click");
        }

        if (spfIds.length > 0 || rqspfIds.length > 0 || zjqIds.length > 0 || bqcIds.length > 0 || bfIds.length > 0) {
          // 焦点样式
          switchArrow(matchId, 0);
        }
      }
    },
    //显示更多赔率
    showMoreOdds: function (e) {
      var $tar = $(e.target),
        $match = $tar.closest('div'),
        matchId = $match.data('matchId'),
        data = this.matchMap[matchId];
      require.async('/tpl/athletics/jcz/more_odds', function (tpl) {
        if ($match.find('.showhide').length == 0) {
          $match.toggleClass('on_show').append(tpl(data));
        } else {
          $match.toggleClass('on_show').find('.showhide').toggle();
        }
      });
    },
    //页面跳转
    goPage: function (e) {
      var self = this,
        $tar = $(e.target),
        id = $tar.prop('id') || $tar.prop('class');
      switch (id) {
        case 'wf_menu'://玩法介绍
          page.init("jcz/intro", {}, 1);
          break;
        case 'kj_menu'://开奖信息
          page.init('jcz/lottery_list', {}, 1);
          break;
        default ://赛事分析
          var $table = $tar.closest('table');
          var param = {
            issueNo: self.issueNo,
            teamNo: $table.data('number'),
            gliveId: $table.data('liveId')
          };
          page.init("jcz/analyse", param, 1);
      }
      util.hideCover();
    },
    //切换玩法
    switchPlay: function (e) {
      var $tar = $(e.target),
        $playName = $('#playName'),
        type = $tar.data('type'),
        text = $tar.data('text');
      switch (type) {
        case 1:
          break;
        case 2:

          break;
      }
      $playName.text(text);
      $('.menuBox').hide();
      $tar.addClass('click').siblings().removeClass('click');
      util.hideCover();
    },
    //绑定事件
    bindEvent: function () {
      //fastclick events
      fastClick.attach(document.body);
      this.$page.on('click', '.back', function () {
        this.callback ? page.goBack() : page.init('home', {}, 1);
      }.bind(this));
      this.$page.on('click', '.menu', function () {
        $('.menuBox').toggle();
        util.showCover();
      }.bind(this));
      this.$page.on('click', '.more', function () {
        $('.popup').toggle();
        util.showCover();
      }.bind(this));
      //打开赛事筛选
      this.$page.on('click', '#filterBtn', function () {
        util.showCover();
        var leagueBox = $('.leagueBox');
        leagueBox.toggle().hasClass('success') ? '' : this.addLeagueItems();
        //this.selLeague = $(".leagueBox .item .click");
      }.bind(this));
      //赛事筛选
      $(".leagueBox").on('click', '.item', function (e) {
        var $tar = $(e.target);
        $tar.toggleClass('click');
        var num = $tar.hasClass('click') ? $tar.data('num') : -$tar.data('num');
        this.updateSelMatLen(num, true);
        //this.selLeague = $(".leagueBox .item .click");
      }.bind(this));
      //赛事筛选-全选
      $('.leagueBox').on('click', '.selAll', function (e) {
        var $tar = $(e.target),
          $leagueBox = $('.leagueBox');
        if ($tar.text() == '全选') {
          $leagueBox.find('.item').addClass('click');
          $leagueBox.find('.red').text(this.leagueLength);
          $tar.text('全不选');
        } else {
          $leagueBox.find('.item').removeClass('click');
          $leagueBox.find('.red').text(0);
          $tar.text('全选');
        }
      }.bind(this));
      //显示更多玩法
      this.$page.on('click', '.more_odds_btn', this.showMoreOdds.bind(this));
      //切换玩法
      $('.menuBox').on('click', 'a:not(.click)', this.switchPlay.bind(this));
      //选取赔率
      this.$page.on('click', 'td[class^="odds"]', function (e) {
        var $tar = $(e.target),
          $div = $tar.closest('.match');
        $tar.toggleClass('click');
        if ($div.find('.click').length) {
          $div.find('.arr').addClass('f07e04');
        } else {
          $div.find('.arr').removeClass('f07e04');
        }
        this.unitTotal();
      }.bind(this));
      // 关闭显示框
      $(".cover").on('click', function (e) {
        util.hideCover();
        $(".popup").hide();
        $(".menuBox").hide();
        if ($(".leagueBox").is(":visible")) {
          $(".leagueBox").hide();
          /*this.selLeague.each(function (i, item) {
           $(item).addClass("click");
           });*/
        }
        return true;
      });
      //赛事分析
      this.$page.on('click', '.analyse', this.goPage.bind(this));
      //菜单栏事件
      $('.popup').on('click', 'a', this.goPage.bind(this));
      //清除选择
      $('footer').on('click', '.btn1', this.clearSelect.bind(this));
      //确认购买
      $('footer').on('click', '.btn2', this.goBuy.bind(this));
    }
  };
})
;