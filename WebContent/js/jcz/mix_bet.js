/**
 * Created by xf.radish on 14-3-20.
 */
define(function (require, exports, module) {
  "use strict";
  var $ = require('zepto');
  var _ = require('underscore');
  var util = require('util');
  var page = require('page');
  var config = require('config');
  var service = require('services/jcz');
  var betTpl = require('/views/athletics/jcz/mix_bet.html');
  var canBack = 0;
  var betList = {};//对阵列表数据
  var selectLeagueElem = [];
  module.exports = {
    init : function (data, forward) {
      canBack = forward ? 1 : 0;
      this.lotteryType = 46;
      // 加载模板内容
      $("#container").html(betTpl);
      this.$page = $('#jczMixedView');
      this.params = {
        token : util.checkLogin(data) || undefined
      };
      this.playNameMap = {
        'mix_bet' : '混投',
        'uad_bet' : '上下盘'
      };
      this.uadList = {}; //上下盘列表数据
      this.currPlayName = sessionStorage.getItem('jcz_curr_play_name') || 'mix_bet';//当前玩法,默认是混投[混投、上下盘]
      this.matchMap = {};// match Map值
      this.bufferData = {};// 缓存的数据
      this.pay = 0;// 消费金额
      this.total = 0;// 注数
      this.issueNo = "";// 显示期号
      this.leagueMap = {};// 赛事分类
      this.leagueLength = 0;// 一共有多少对阵
      this.initShow(canBack);
      this.bindEvent();
      // 处理返回
      page.setHistoryState({url : "jcz/mix_bet", data : this.params}, "jcz/mix_bet", "#jcz/mix_bet" + (JSON.stringify(this.params).length > 2 ? "?data=" + encodeURIComponent(JSON.stringify(this.params)) : ""), canBack);
    },
    //初始化显示
    initShow : function (forward) {
      $('#playName').html(this.playNameMap[this.currPlayName] || '混投');
      $('.menuBox').find('a[data-type=' + this.currPlayName + ']').addClass('click');
      if (forward) {
        this.getBetList();
      } else {
        // 根据缓存数据判断是否需要重新拉取列表
        this.bufferData = util.getLocalJson(util.keyMap.LOCAL_JCZ);
        if (this.bufferData && !_.isEmpty(betList)) {
          this.handleBetList();
          this.showBuffer();
        } else {
          this.getBetList();
        }
      }
      this.unitTotal();
    },
    //获取对阵列表
    getBetList : function () {
      var self = this;
      service.getJCZQBetList(this.lotteryType, function (data) {
        if (typeof data && typeof data.statusCode) {
          if (0 == data.statusCode) {
            betList = data;
            self.handleBetList();
            util.hideLoading();
          } else {
            page.toast(data['errorMsg']);
          }
        }
      });
    },
    //统计赛事场数
    unitTotal : function () {
      var total = 0;
      $('.match').each(function (i, item) {
        total = total + ~~!!$(item).find(".click").length;
      });
      this.total = total;
      $("#selectNum").text(total);
    },
    clearSelect : function () {
      $('td[class^="odds"]').removeClass('click');
      $('.match').find('.arr').removeClass('f07e04');
      $("#selectNum").text(0);
      this.total = 0;
    },
    goBuy : function () {
      if (betList && betList.datas) {
        if (this.total > 1) {
          this.recordUserSelected();
          page.init("jcz/buy", {}, 1);
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
    recordUserSelected : function () {
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
            // 胜平负
            var spfIds = [], $spf = $item.find(".spf_bet .click");
            if ($spf.length) {
              $spf.each(function (j, spf) {
                spfIds.push($(spf).data('result'));
              });
              titleMap["spf"] = 1;
            }
            data.spfIds = spfIds;

            // 让球胜平负
            var rqspfIds = [], $rqspf = $item.find(".rqspf_bet .click");
            if ($rqspf.length) {
              $rqspf.each(function (k, rqspf) {
                rqspfIds.push($(rqspf).data('result'));
              });
              titleMap["rqspf"] = 1;
            }
            data.rqspfIds = rqspfIds;

            // 总进球
            var zjqIds = [], $zjq = $item.find(".zjq_bet .click");
            if ($zjq.length) {
              $zjq.each(function (d, zjq) {
                zjqIds.push($(zjq).data('result'));
              });
              titleMap["zjq"] = 1;
            }
            data.zjqIds = zjqIds;

            // 半全场
            var bqcIds = [], $bqc = $item.find(".bqc_bet .click");
            if ($bqc.length) {
              $bqc.each(function (c, bqc) {
                bqcIds.push($(bqc).data('result'));
              });
              titleMap["bqc"] = 1;
            }
            data.bqcIds = bqcIds;

            //比分
            var bfIds = [], $bf = $item.find(".bf_bet .click");
            if ($bf.length) {
              $bf.each(function (c, bf) {
                bfIds.push($(bf).data('result'));
              });
              titleMap["bf"] = 1;
            }
            data.bfIds = bfIds;

            //上下盘
            var uadIds = [], $uad = $item.find('.uad_bet .click');
            if ($uad.length) {
              $uad.each(function (c, uad) {
                uadIds.push($(uad).data('result') + '_' + $(uad).data('text'));
              });
              titleMap["uad"] = 1;
            }
            data.uadIds = uadIds;

            matchBetList.push(data);
          }
        }
      });
      this.bufferData.matchBetList = matchBetList;
      this.bufferData.titleMap = titleMap;
      util.setLocalJson(util.keyMap.LOCAL_JCZ, this.bufferData);
    },
    //处理对阵列表
    handleBetList : function () {
      var matchLen = 0;
      if (!betList.datas.length) {
        $("#JMIssueNo").text("本期暂无比赛可投注");
        return false;
      }
      this.issueNo = betList.datas[0].issueNo;
      _.each(betList.datas, function (data) {
        matchLen += data['matchArray'].length;
      });
      this.showIssueNo(matchLen);
      this.showMatchItems();
      this.leagueLength = matchLen;
    },
    //显示期号
    showIssueNo : function (matchLen) {
      var htmlStr = matchLen ? this.issueNo + "期，共" + matchLen + "场比赛可投注" : '加载数据失败';
      $("#JMIssueNo").text(htmlStr);
      this.updateSelMatLen(matchLen, false);
    },
    //处理数据并显示赛事列表
    showMatchItems : function () {
      var self = this, url = 'mix_bet' == self.currPlayName ? '/tpl/athletics/jcz/match' : '/tpl/athletics/jcz/uad', htmlStr = '';
      require.async(url, function (tpl) {
        _.each(betList.datas, function (data) {
          _.each(data['matchArray'], function (m) {
            // 缓存赛事数据
            self.matchMap[m.matchId] = m;
            // 计算联赛map
            if (!self.leagueMap[m.leagueMatch]) {
              self.leagueMap[m.leagueMatch] = 1;
            } else {
              self.leagueMap[m.leagueMatch]++;
            }

            if ('mix_bet' == self.currPlayName || 1 == Math.abs(m.transfer)) {
              htmlStr += tpl(m);
            }
          });
        });
        $("#matchList").html(htmlStr);
      });
    },
    //添加赛事种类列表
    addLeagueItems : function () {
      if (this.leagueMap) {
        var htmlStr = '', $leagueBox = $('.leagueBox');
        _.map(this.leagueMap, function (value, key) {
          htmlStr += '<li class="item click" data-num="' + value + '">' + key + '[' + value + ']场</li>';
        });
        util.showCover();
        $leagueBox.show().addClass('success').find('.icon').html(htmlStr);
        selectLeagueElem = $(".leagueBox .click");
      }
    },
    //更新选择赛事类型中的场数
    updateSelMatLen : function (num, opt) {
      var $selectNum = $(".leagueBox .red"), selectNum = 0;
      if (num || opt) {
        selectNum = (opt ? +$selectNum.text() : 0) + num
      } else {
        _.each($('.leagueBox').find('.click'), function (item) {
          selectNum += $(item).data('num');
        });
      }
      $selectNum.text(selectNum);
      opt && this.toggleSelAllLea(selectNum);
    },
    toggleSelAllLea : function (selectNum) {
      if (selectNum == this.leagueLength) {
        $('.leagueBox .selAll').text('全不选');
      } else {
        $('.leagueBox .selAll').text('全选');
      }
    },
    //显示缓存数据
    showBuffer : function () {
      var self = this;
      var matchBetList = this.bufferData.matchBetList;
      for (var i = 0, len = matchBetList.length; i < len; i++) {
        var item = matchBetList[i];
        var matchId = item.matchId;
        var spfIds = item.spfIds, rqspfIds = item.rqspfIds, zjqIds = item.zjqIds, bqcIds = item.bqcIds, bfIds = item.bfIds, uadIds = item.uadIds;
        var $match = $('.match[ data-match-id=' + matchId + ']');

        if (zjqIds.length > 0 || bqcIds.length > 0 || bfIds.length > 0) {
          // 显示SP层
          self.showMoreOdds(matchId);
        }
        // 胜平负
        for (var j = 0, jLen = spfIds.length; j < jLen; j++) {
          $match.find('td[data-result=' + spfIds[j] + ']').addClass("click");
        }
        // 让球胜平负
        for (var j = 0, kLen = rqspfIds.length; j < kLen; j++) {
          $match.find('td[data-result=' + rqspfIds[j] + ']').addClass("click");
        }
        // 总进球
        for (var j = 0, dLen = zjqIds.length; j < dLen; j++) {
          $match.find('td[data-result=' + zjqIds[j] + ']').addClass("click");
        }
        // 半全场
        for (var j = 0, cLen = bqcIds.length; j < cLen; j++) {
          $match.find('td[data-result=' + bqcIds[j] + ']').addClass("click");
        }
        // 比分
        for (var j = 0, bLen = bfIds.length; j < bLen; j++) {
          $match.find('td[data-result=' + bfIds[j] + ']').addClass("click");
        }
        _.each(uadIds, function (j) {
          $match.find('td[data-result=uad_' + j.split('_')[1]+']').addClass('click');
          $match.find('#uad_' + j.split('_')[1]).addClass('click');
        });
        if (spfIds.length || rqspfIds.length || zjqIds.length || bqcIds.length || bfIds.length) {
          $match.addClass('on_show');
          $match.find('.arr').addClass('f07e04');
        }
      }
      util.hideLoading();
    },
    //显示更多赔率
    showMoreOdds : function (e) {
      var $match = '', matchId = '', data = {};
      if ('string' == typeof e) {
        $match = $('.match[ data-match-id=' + e + ']');
        matchId = e;
      } else {
        $match = $(e.target).closest('div');
        matchId = $match.data('matchId');
      }
      data = this.matchMap[matchId];
      if ($match.find('.showhide').length == 0) {
        require.async('/tpl/athletics/jcz/more_odds', function (tpl) {
          $match.toggleClass('on_show').append(tpl(data));
        });
      } else {
        $match.toggleClass('on_show').find('.showhide').toggle();
      }

    },
    //页面跳转
    goPage : function (e) {
      var self = this, $tar = $(e.target), id = $tar.prop('id') || $tar.prop('class');
      switch (id) {
        case 'hm_menu':
          page.init("hm/index", {lotteryTypeArray : "46|47|48|49|52|56"}, 1);
          break;
        case 'gc_menu'://购彩记录
          if (!util.checkLogin(null)) {
            // 尚未登录，弹出提示框
            $(".popup").hide();
            page.answer('', "您还未登录，请先登录!", "登录", "取消", function () {
              page.init("login", {}, 1)
            }, null);
          } else {
            page.init("user/buyRecord", {lotteryTypeArray : "46|47|48|49|52|56"}, 1);
          }
          break;
        case 'wf_menu'://玩法介绍
          page.init("jcz/intro", {}, 1);
          break;
        case 'kj_menu'://开奖信息
          page.init('jcz/lottery_list', {lotteryType : self.lotteryType}, 1);
          break;
        default ://赛事分析
          var $table = $tar.closest('table');
          var param = {
            issueNo : self.issueNo,
            teamNo : $table.data('number'),
            gliveId : $table.data('liveId')
          };
          self.recordUserSelected();
          page.init("jcz/analyse", param, 1);
      }
      util.hideCover();
    },
    //切换玩法
    switchPlay : function (e) {
      var $tar = $(e.target), $playName = $('#playName'), type = $tar.data('type'), text = $tar.data('text');
      this.currPlayName = type;
      sessionStorage.setItem('jcz_curr_play_name', type);
      this.showMatchItems();
      $playName.text(text);
      $('.menuBox').hide();
      $tar.addClass('click').siblings().removeClass('click');
      $('.leagueBox .item').addClass('click');
      this.updateSelMatLen();
      util.hideCover();
    },
    filterMatch : function () {
      var $league = $(".leagueBox .icon .click");
      if (!$league.length) {
        page.toast("请至少选择1种赛事");
        return false;
      }
      var matchLen = 0;
      var $allLeague = $("#selAll");
      if ('全选' == $allLeague.text()) {
        $(".match").show();
      } else {
        $(".match").hide();
        $league.each(function (i, li) {
          var text = $(li).text();
          var leagueName = text.substring(0, text.indexOf("["));
          $(".leagueT").each(function (i, t) {
            var $t = $(t);
            if (leagueName == $t.text()) {
              matchLen++;
              $t.closest(".match").show();
            }
          });
        });
      }
      this.showIssueNo(matchLen);
      $(".leagueBox").hide();
      util.hideCover();
    },
    //绑定事件
    bindEvent : function () {
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
        if ($('.leagueBox').hasClass('success')) {
          util.showCover();
          $('.leagueBox').toggle()
          selectLeagueElem = $(".leagueBox .click");
        } else {
          this.addLeagueItems();
        }
      }.bind(this));
      //赛事筛选
      $(".leagueBox").on('click', '.icon .item', function (e) {
        var $tar = $(e.currentTarget),
          num = 0 ,
          self = this;
        if($tar.hasClass('click')){
          num = -$tar.data('num');
        }else{
          num = $tar.data('num');
        }
        $tar.toggleClass('click');
        setTimeout(function () {
          self.updateSelMatLen(num, true).bind(this);
        }, 25);

      }.bind(this));
      //赛事筛选-全选
      $('.leagueBox').on('click', '.selAll', function (e) {
        var $tar = $(e.target), $leagueBox = $('.leagueBox');
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
      $(".confirm").on('click', this.filterMatch.bind(this));
      //显示更多玩法
      this.$page.on('click', '.more_odds_btn', this.showMoreOdds.bind(this));
      //切换玩法
      $('.menuBox').on('click', 'a:not(.click)', this.switchPlay.bind(this));
      //选取赔率
      this.$page.on('click', 'td[class^="odds"]', function (e) {
        var $tar = $(e.target), $div = $tar.closest('.match');
        $tar.toggleClass('click');
        if ($div.find('.click').length) {
          $div.find('.arr').addClass('f07e04');
        } else {
          $div.find('.arr').removeClass('f07e04');
        }
        this.unitTotal();
      }.bind(this));
      // 关闭显示框
      $(".cover").on('touchstart click', function (e) {
        util.hideCover();
        $(".popup").hide();
        $(".menuBox").hide();
        if ($(".leagueBox").is(":visible")) {
          $('.leagueBox .item').removeClass('click');
          selectLeagueElem.each(function (i, item) {
            $(item).addClass('click');
          });
          if (selectLeagueElem.length == $('.leagueBox .item').length) {
            $('.bar .selAll').text('全不选');
          } else {
            $('.bar .selAll').text('全选');
          }
          this.updateSelMatLen();
          $(".leagueBox").hide();
        }
        util.preventEvent(e);
      }.bind(this));
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
});