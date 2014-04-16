/**
 * 竟彩足球奖金优化
 */
define(function (require, exports, module) {
  var page = require('page'), tpl = require('/tpl/athletics/jcz/optimize');
  $("#container").html(tpl);
  var csmoney = null, jhmoney = null, sjmoney = null, ywlsh = null, cspromul = null, djaftermoney = null, ischangmoney = true, csminprize = null, is_d = true, csmaxprize = null, gbtype = "pj", rkywlsh = null, passway = null, matchids = null, content = null, lotteryid = null, ptList = null, fonL_ = null, Max_prize = null, Line_Group = null, objtr = null, hightset = "";
  //ischangmoney是否已经给所有的注数和金额赋值为0了
  var contentType = {
    "胜": "3#46",
    "平": "1#46",
    "负": "0#46",
    "0球": "0#48",
    "1球": "1#48",
    "2球": "2#48",
    "3球": "3#48",
    "4球": "4#48",
    "5球": "5#48",
    "6球": "6#48",
    "7+球": "7#48",
    "1:0": "1-0#47",
    "2:0": "2-0#47",
    "2:1": "2-1#47",
    "3:0": "3-0#47",
    "3:1": "3-1#47",
    "3:2": "3-2#47",
    "4:0": "4-0#47",
    "4:1": "4-1#47",
    "4:2": "4-2#47",
    "5:0": "5-0#47",
    "5:1": "5-1#47",
    "5:2": "5-2#47",
    "胜其它": "s-s#47",
    "0:0": "0-0#47",
    "1:1": "1-1#47",
    "2:2": "2-2#47",
    "3:3": "3-3#47",
    "平其它": "p-p#47",
    "0:1": "0-1#47",
    "0:2": "0-2#47",
    "1:2": "1-2#47",
    "0:3": "0-3#47",
    "1:3": "1-3#47",
    "2:3": "2-3#47",
    "0:4": "0-4#47",
    "1:4": "1-4#47",
    "2:4": "2-4#47",
    "0:5": "0-5#47",
    "1:5": "1-5#47",
    "2:5": "2-5#47",
    "负其它": "f-f#47",
    "胜-胜": "s-s#49",
    "胜-平": "s-p#49",
    "胜-负": "s-f#49",
    "平-胜": "p-s#49",
    "平-平": "p-p#49",
    "平-负": "p-f#49",
    "负-胜": "f-s#49",
    "负-平": "f-p#49",
    "负-负": "f-f#49",
    "让胜": "3#56",
    "让平": "1#56",
    "让负": "0#56"
  };
  var lotteryId = {
    "46": "spfgg",
    "47": "bfgg",
    "48": "zjqgg",
    "49": "bqcgg",
    "52": "fhtgg",
    "56": "rqspfgg"
  };
  var jjyhfm = '<form id="jjyhfrom" method="post" action="/sportsfootballorder/jjyh/dgporder.shtml"><input type="hidden" name="project.jjyhcontent" value=""><input type="hidden" name="project.followuser" value=""><input type="hidden" name="project.content" value=""><input type="hidden" name="project.openstatus" value=""><input type="hidden" name="project.percent" value=""><input type="hidden" name="project.promul" value=""><input type="hidden" name="project.projectbets" value=""><input type="hidden" name="project.minimumcount" value=""><input type="hidden" name="project.totalcount" value=""><input type="hidden" name="project.totalamount" value=""><input type="hidden" name="project.passtype" value=""><input type="hidden" name="project.playtype" value=""><input type="hidden" name="project.lotteryid" value=""><input type="hidden" name="project.projecttype" value=""><input type="hidden" name="id" value=""><input type="hidden" name="project.fromurl" value=""><input type="hidden" name="project.passway" value=""><input type="hidden" name="project.matchids" value=""><input type="hidden" name="project.prevmoney" value=""><input type="hidden" name="project.subscribecount" value=""><input type="hidden" name="project.jjyhkey" value=""><input type="hidden" value="" name="project.dan"><input type="hidden" value="" name="project.jjyhhightset"></form> ';
  var jjyhhm = '<form id="jjyhhmfrom" method="post" action=""><input type="hidden" name="project.jjyhcontent" value=""><input type="hidden" name="project.followuser" value=""><input type="hidden" name="project.content" value=""><input type="hidden" name="project.openstatus" value=""><input type="hidden" name="project.percent" value=""><input type="hidden" name="project.promul" value=""><input type="hidden" name="project.projectbets" value=""><input type="hidden" name="project.minimumcount" value=""><input type="hidden" name="project.totalcount" value=""><input type="hidden" name="project.totalamount" value=""><input type="hidden" name="project.passtype" value=""><input type="hidden" name="project.playtype" value=""><input type="hidden" name="project.lotteryid" value=""><input type="hidden" name="project.projecttype" value=""><input type="hidden" name="id" value=""><input type="hidden" name="project.fromurl" value=""><input type="hidden" name="project.passway" value=""><input type="hidden" name="project.matchids" value=""><input type="hidden" name="project.prevmoney" value=""><input type="hidden" name="project.subscribecount" value=""><input type="hidden" name="project.jjyhkey" value=""><input type="hidden" name="project.buysp" value=""><input type="hidden" value="" name="project.dan"><input type="hidden" value="" name="project.jjyhhightset"></form> ';
  var init = function () {


    optimize();
  };

  module.exports = init;
  /**
   *奖金优化
   **/
  var optimize = function () {
    objtr = $("#jjtbody").find("tr[id^=tr]");
    Max_prize = Number($("#maxprize").html());
    csmoney = $("#csmoney").val();
    ywlsh = $("#ywlsh").val();
    cspromul = $("#cspromul").val();
    djaftermoney = csmoney;
    sjmoney = csmoney;
    csminprize = $("#csminprize").val(); //初始化最小奖金
    csmaxprize = $("#csmaxprize").val(); //初始化最大奖金
    passway = $("#passway").val();
    passway = passway.replace("-", "串");
    content = $("#content").val();
    matchids = $("#matchids").val();
    lotteryid = $("#lotteryid").val();
    Line_Group = $("#allcontent").val();
    $("#allcontent").val("");
    var lengt = matchids.split(",").length;
    $(".jjyh").bind("click", function (i) {
      prizeYh.yhClickStart(this);
    });
    $("#jhmoney").bind("keyup", function () {
      prizeYh.jhmoneychange(this);
    });
    $("#cspromul").bind("keyup", function () {
      prizeYh.cspromulkeyup(this);
    });
    $(".ls").bind("click", function () {
      prizeYh.promulchange(this);
    });
    $(".dzbs").bind("click", function () {
      prizeYh.dzbsbutton(this);
    });
    $(".selfbuy").bind("click", function () {
      buyProcess.selfbuy();
    });
    $(".joinbuy").bind("click", function () {
      buyProcess.joinbuy();
    });
    $(".pri").bind("blur", function () {
      prizeYh.dzPrizeChange(this);
    });
    $("input[id^=checkbox]").bind("click", function () {
      prizeYh.checkBoxChange(this);
    });
    $(".pri").bind("click", function () {
      prizeYh.dzSelectFocus(this);
    });
    $(".pri").bind("keyup", function () {
      prizeYh.dzKeyup(this);
    });
    $("#allupdateMoney").bind("keyup", function () {
      var arg = /^[1-9][0-9]*$/;
      if (!arg.test(Number($(this).val()))) {
        $(this).val(1);
      }
    });
    if (Number(cspromul) > 1) {
      prizeYh.yhClickStart($("#pj"));
    }
    var betTitleLocate = function (titleId, showId, className) {
      var betTitleObj = $("#" + titleId);
      var betTitleTop = betTitleObj.offset().top;
      var betTitleLeft = betTitleObj.offset().left;
      var

        betObj = $("#" + showId);
      var betTop = betObj.offset().top;
      var betHeight = betObj.height();

      function getlocate() {
        var scrollTop = Number($(document).scrollTop());
        if

          (scrollTop > betTitleTop && scrollTop < betTop + betHeight) {
          if ($.browser.msie) {
            betTitleObj.css("left", betTitleLeft + "px");
          }
          if (betTitleObj.hasClass(className)) return false;
          betTitleObj.addClass(className);
          $("#jjTjObj").parent().attr("style", "*position:relative;");
        } else {
          if ($.browser.msie) {
            betTitleObj.css("left", "auto");
          }
          if (!betTitleObj.hasClass(className)) return false;
          betTitleObj.removeClass(className);
          $("#jjTjObj").parent().attr("style", "");
        }
      }

      $(window).scroll(getlocate);
    };
    betTitleLocate("betDivObj", "jjTjObj", "xuanxbox");
    betTitleLocate("qhyhObj", "jjTjObj", "yhmenuDiv");
    var getHeaderW = function () {
      var betTitleObj = $("#betbottom");
      var

        betTitleHeight = betTitleObj.offset().top;
      var nowClientHeigth = document.documentElement.clientHeight;
      if (betTitleHeight + 48 > nowClientHeigth) {
        betTitleObj.addClass("yhBet");
      } else {
        betTitleObj.removeClass("yhBet");
      }
    };
    getHeaderW();
    var betFooterLocate = function (footerId, showId, className) {
      var betTitleObj = $("#" + footerId);
      var betTitleHeight = betTitleObj.height();
      var betObj = $("#" + showId);
      var

        betTop = betObj.offset().top;

      function getlocate() {
        var scrollTop = Number($(document).scrollTop());
        var nowClientHeigth = document.documentElement.clientHeight;
        var

          betHeight = betObj.height();
        if (scrollTop + nowClientHeigth - 48 < betTop + betHeight) {
          if (betTitleObj.hasClass(className)) return false;
          betTitleObj.addClass(className);
        } else {
          if (!

            betTitleObj.hasClass(className)) return false;
          betTitleObj.removeClass(className);
        }
      }

      $(window).scroll(getlocate);
    };
    betFooterLocate("betbottom", "jjTjObj", "yhBet");
    var jjTjObj = $("#jjTjObj");
    var noteTrObj = $(".noteTrObj");
    $("#closePljjCon").click(function () {
      $("#pljjCon").hide();
    });
    prizeYh.getBonus();
    $(".img_jjyh").show();
  };
  /**
   *竟彩足球优化的一系列操作
   */
  var prizeYh = {
    /**
     * 优化之前做的验证
     */
    before: function () {
      //			if(Number($("#jhmoney").val())>300000){page.toast("输入计划购买金额最大支持200万元！");return false;}
      if (Number($("#jhmoney").val()) % 2 != 0) {
        page.toast("输入计划购买金额必须是偶数！");
        return false;
      }
      if (Number($("#jhmoney").val()) < Number(csmoney)) {
        page.toast("计划购买金额至少需要" + csmoney + "元！");
        return false;
      }
      jhmoney = Number($("#jhmoney").val());
      return true;
    },
    /**
     * 点击开始优化
     */
    yhClickStart: function (obj) {
      var clickthis = $(obj);
      var type = clickthis.attr("id");
      if (is_d || (!is_d && type == "pj")) {
        if (type == "br" || type == "bl") $(".img_jjyh").hide(); else
          $(".img_jjyh").show();
        if ($("#lysource").val() == "888jingcai")
          $(".yhBtn").each(function () {
            if ($(this).attr("id") == type) {
              $(this).removeClass(" click").addClass(" click");
            } else {
              $(this).removeClass(" click");
            }
          });
        if ($("#lysource").val() == "ecp888" && is_d) {
          $(".jjyh").each(function () {
            if ($(this).attr("id") == type) {
              $(this).attr("class", "click jjyh");
            } else {
              $(this).attr("class", "link jjyh");
            }
          });
        }
        if (prizeYh.before()) {
          $("#cspromul").val(cspromul);
          $("#oldpromul").val(cspromul);
          if (jhmoney != djaftermoney || type != gbtype) {
            gbtype = type;
            var url = $("#contextPath").val() + "/sportsfootballbonusopt!optYh.shtml";
            $.getJSON(url, "jhmoney=" + jhmoney + "&sjcsmoney=" + $("#sjcsmoney").val() + "&csmoney=" + csmoney + "&sjcsprouml=" + $("#sjcsprouml").val() + "&type=" + type + "&ywlsh=" + ywlsh + "&matchnum=" + matchids.split(",").length + "&passway=" + $("#passway").val() + "&matchids=" + $("#matchids").val() + "&lotteryid=" + $("#lotteryid").val() + "&content=" + $("#content").val(), function (data) {
              var status = data.status;
              var message = data.message;
              if (typeof (status) == "undefined") {
                var sjm = $("#sjmoney");
                if (type == "pj" || type == "bl" || type == "br") {
                  for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    if (typeof (item.minmaxprize) == "undefined") {
                      var obj = $("#prize" + i);
                      var num = "num" + i;
                      var prize = "prize" + i;
                      var itemnum = item.num;
                      var itemprize = item.prize;
                      $("#" + num).html(itemnum);
                      $("#checkbox" + (i + 1)).attr("checked", true);
                      $("#prize" + i).val(cauScale(2, itemprize)).removeClass("bgccc");
                      var tr = $("#tr" + i);
                      tr.attr("data-prize", cauScale(2, itemprize / itemnum));
                      tr.attr("data-zhushu", itemnum);
                      clickClassChangeTwo(obj, sjm);
                    } else {
                      if ($("#isdwf").val() == "1" || ($("#dan").val() != null && $("#dan").val() != "")) {
                        prizeYh.publicMoney();
                        var minp = cauScale(2, Number($("#minprize").html()));
                        var maxp = cauScale(2, Number($("#maxprize").html()));
                        $("#csminprize").val(minp);
                        $("#csmaxprize").val(maxp);
                        csminprize = minp; //初始化最小奖金
                        csmaxprize = maxp; //初始化最大奖金
                      } else {
                        var minmaxprize = item.minmaxprize;
                        var minmax = minmaxprize.split("/");
                        var mmi = cauScale(2, minmax[0]);
                        var mmx = cauScale(2, minmax[1]);
                        $("#minprize").html(mmi);
                        $("#maxprize").html(mmx);
                        $("#csminprize").val(mmi);
                        $("#csmaxprize").val(mmx);
                        csminprize = mmi; //初始化最小奖金
                        csmaxprize = mmx; //初始化最大奖金
                      }
                    }
                  }
                }
              }
              if (status == 1) {
                page.toast(message);
              }
              djaftermoney = jhmoney; //保存点击之前的计划购买金额，方便以后改变计划金额的时候判断是不是这个金额。
              sjmoney = jhmoney; //优化成功后给实际购买金额赋值
              ischangmoney = true; //平均优化成功后，方便以后改变计划金额的时候判断你修改的计划购买金额是不是刚刚优化的金额
            });
          } else {
            var sjm = $("#sjmoney");
            for (var i = 0, len = objtr.length; i < len; i++) {
              var lobj = objtr.eq(i);
              var obj = $("#prize" + i);
              $("#checkbox" + (i + 1)).attr("checked", true);
              var prize = lobj.attr("data-prize");
              var zhushu = lobj.attr("data-zhushu");
              $("#num" + i).html(zhushu);
              obj.val(cauScale(2, prize * Number(zhushu))).removeClass("bgccc");
              clickClassChangeTwo(obj, sjm);
            }
            $("#minprize").html(cauScale(2, $("#csminprize").val()));
            $("#maxprize").html(cauScale(2, $("#csmaxprize").val()));
          }
        }
        sjmoney = jhmoney;
        $("#sjmoney").html(sjmoney);
      } else {
        var messe = "博热奖金优化暂不支持组合过关!";
        if (type == "bl")
          messe = "博冷奖金优化暂不支持组合过关!";
        page.toast(messe);
        return false;
      }
    },
    /**
     * 计划金额改变时
     */
    jhmoneychange: function (obj) {
      var money = obj.value;
      var arg = /^[1-9][0-9]*$/;
      if (obj.value != "" && !arg.test(obj.value)) {
        obj.value = djaftermoney;
      }
      var minhtml = $("#minprize");
      var maxhtml = $("#maxprize");
      if (money != djaftermoney) {
        if (ischangmoney) {
          for (var i = 0, len = objtr.length; i < len; i++) {
            $("#num" + i).html(0);
            $("#prize" + i).val(0);
          }
          minhtml.html(0);
          maxhtml.html(0);
          ischangmoney = false;
        }
        ;
      }
      if (money == djaftermoney && !ischangmoney) {
        for (var i = 0, len = objtr.length; i < len; i++) {
          var objnum = objtr.eq(i);
          var prize = objnum.attr("data-prize");
          var zhushu = objnum.attr("data-zhushu");
          var zs = parseInt(zhushu) * Number($("#cspromul").val());
          var pr = zs * parseFloat(prize);
          $("#num" + i).html(zs);
          $("#prize" + i).val(pr.toFixed(2));
        }
        minhtml.html(cauScale(2, $("#csminprize").val()));
        maxhtml.html(cauScale(2, $("#csmaxprize").val()));
        ischangmoney = true;
      }
      ;
    },
    /**
     * 加减倍数改变时
     * @param obj
     */
    cspromulkeyup: function (obj) {
      var oldpromul = $("#oldpromul").val();
      var proml = $(obj).val();
      var arg = /^[1-9][0-9]*$/;
      if (!arg.test(oldpromul)) {
        oldpromul = 1;
        $("#oldpromul").val(oldpromul);
      }
      if (proml == "") {
        proml = 1;
        $(obj).val(cspromul);
      }
      if ((proml != "" && !arg.test(proml))) {
        $(obj).val(cspromul);
        proml = $(obj).val();
      }
      if (Number(proml) > 10000) {
        $(obj).val(10000);
        proml = $(obj).val();
      }
      var sjmoenys = 0;
      for (var i = 0, len = objtr.length; i < len; i++) {
        var objthis = objtr.eq(i);
        var numi = $("#num" + i);
        var prize = objthis.attr("data-prize");
        var zs = 0;
        var zhushu = Number(numi.text()) / oldpromul;
        zs = Number(proml) * Number(zhushu);
        var pr = zs * parseFloat(prize);
        numi.html(zs);
        $("#prize" + i).val(pr.toFixed(2));
        sjmoenys += zs;
      }
      $("#sjmoney").html(Number(sjmoenys * 2));
      if (proml == 0) {
        $("#minprize").html("0.00");
        $("#maxprize").html("0.00");
      } else {
        prizeYh.getBonus();
      }
      $("#oldpromul").val(proml);
    },
    /**
     * 当鼠标移动到单注上的，给右侧投注区相应的投注选项  增加选择样式
     * @param obj
     */
    onmouseovertr: function (obj) {
      $("#matchteamno").find("b").removeClass("zzzs");
      var teamno = $(obj).attr("data-teamno"); //周五001胜/周五0035球/周五004平-负
      teamno = teamno.split("/");
      var len = teamno.length;
      for (var i = 0; i < len; i++) {
        document.getElementById(teamno[i]).className = "zzzs";
      }
    },
    /**
     * 当鼠标移动到单注上的，给右侧投注区相应的投注选项  增加选择样式
     * @param obj
     */
    onmouseovertr1: function (obj) {
      $("#matchteamno").find("span").removeClass("red");
      var teamno = $(obj).attr("data-teamno"); //周五001胜/周五0035球/周五004平-负
      teamno = teamno.split("/");
      var len = teamno.length;
      for (var i = 0; i < len; i++) {
        document.getElementById(teamno[i]).className = "red";
      }
    },
    /**
     * 当鼠标移出 这个注数显示层的时候 ，左边的投注区的选项内容 样式还原
     */
    diver: function () {
      $("#matchteamno").find("b").removeClass("zzzs");
    },
    /**
     * 当鼠标移出 这个注数显示层的时候 ，左边的投注区的选项内容 样式还原
     */
    diver1: function () {
      $("#matchteamno").find("span").removeClass("red");
    },
    validation: function (obj) {
      var bl = true;
      var val = obj;
      var arg = /^[1-9][0-9]*$/;
      if (val != "" && !arg.test(val)) {
        bl = false;
      }
      return bl;
    },
    /**
     * 倍数的改变
     * @param obj
     */
    promulchange: function (obj) {
      var id = $(obj).attr("id");
      var csp = $("#cspromul");
      var proml = csp.val();
      if (id == "bsjian") {
        csp.val(Number(proml) - 1);
        proml = csp.val();
      }
      if (id == "bsjia") {
        csp.val(Number(proml) + 1);
        proml = csp.val();
      }
      var arg = /^[1-9][0-9]*$/;
      if (proml != "" && !arg.test(proml)) {
        csp.val(1);
      }
      if (proml != 0) {
        prizeYh.cspromulkeyup(csp);
      }
    },
    renonum: function (obj) {
      if (obj) {
        return Number(obj.replace(/\D/g, ''));
      }
    },
    /**
     * 单注倍数按钮
     * @param obj
     */
    dzbsbutton: function (obj) {
      var id = $(obj).attr("id");
      var num = prizeYh.renonum(id);
      var checboxnum = $("#checkbox" + (num + 1));
      if (checboxnum.attr("checked") == false) {
        checboxnum.attr("checked", true);
        $("#prize" + num).removeClass("bgccc");
      }
      var numobj = $("#num" + num);
      var prize = Number($("#tr" + num).attr("data-prize"));
      var proml = Number(numobj.html());
      var type = id.split("-")[0];
      var isjq = true;
      if (proml > 0 && type == "dzbsjian") {
        numobj.html(proml - 1);
      }
      if (type == "dzbsjia") {
        numobj.html(proml + 1);
      }
      if (proml == 0 && type == "dzbsjian") {
        isjq = false;
      }
      if (isjq) {
        var sj = $("#sjmoney");
        $("#prize" + num).val((Number(numobj.html()) * prize).toFixed(2));
        if (type == "dzbsjia")
          sj.html(Number(sj.html()) + 2);
        if (type == "dzbsjian")
          sj.html(Number(sj.html()) - 2);
        $("#cspromul").val(1);
        prizeYh.publicMoney();
      }
      sjmoney = $("#sjmoney").html();
      $("#oldpromul").val(1);
    },
    /**
     * 单数金额修改
     */
    dzPrizeChange: function (obj) {
      var obj_prize = $(obj);
      var id = obj_prize.attr("id");
      var bs_lie = prizeYh.renonum(id);
      var prize = obj_prize.val();
      var bspromul = $("#num" + bs_lie).html();
      sjmoney = Number($("#sjmoney").html()) - (bspromul * 2);
      if (!prize > 0)
        prize = 0;
      var one_prize = $("#tr" + bs_lie).attr("data-prize");
      var promul = Number(Math.round(prize / one_prize));
      var zh_prize = promul * one_prize;
      $("#num" + bs_lie).html(promul);
      obj_prize.val(zh_prize.toFixed(2));
      prizeYh.publicMoney();
    },
    checkBoxChange: function (obj) {
      var id = $(obj).attr("id");
      id = prizeYh.renonum(id);
      if ($(obj).attr("checked") == false)
        $("#prize" + (id - 1)).addClass(" bgccc"); else
        $("#prize" + (id - 1)).removeClass(" bgccc");
      prizeYh.publicMoney();
    },
    /**
     * 公共的计算理论最大和最小奖金范围总入口
     */
    publicMoney: function () {
      var pass_way1 = $("#passway").val();
      pass_way1 = pass_way1.split("-")[0];
      var matchidl1 = matchids.split(",");
      if ($("#isdwf").val() == "1") {
        prizeYh.getBonus();
        prizeYh.sumBuyMoney();
        clickClassChange();
      } else {
        if (prizeYh.returnjjyhtype() == "pj" && pass_way1 != matchidl1.length) {
          prizeYh.getBonus();
          prizeYh.sumBuyMoney();
          clickClassChange();
        } else {
          prizeYh.dzzschangeminmaxprice();
          prizeYh.sumBuyMoney();
          clickClassChange();
        }
      }
    },
    /**
     * 鼠标选中单注金额框  就聚焦文本框中内容
     * @param obj  当前选中
     */
    dzSelectFocus: function (obj) {
      $(obj).select().focus();
    },
    dzKeyup: function (obj) {
      var obj_prize = $(obj);
      var prize_obj = obj_prize.val();
      var arg = /^[1-9][0-9]*$/;
      if (prize_obj != "" && !arg.test(prize_obj)) {
        obj_prize.val(1);
      }
      var id = obj_prize.attr("id");
      var bs_lie = prizeYh.renonum(id);
      var checkeboxbs = $("#checkbox" + (bs_lie + 1));
      if (checkeboxbs.attr("checked") == false) {
        checkeboxbs.attr("checked", true);
        $(obj).removeClass("bgccc");
      }
      prizeYh.publicMoney();
    },
    sumBuyMoney: function () {
      var snum = $("td[id^=num]");
      var sum_mo = [], bs = 0;
      for (var i = 0, len = snum.length; i < len; i++) {
        var numtr = snum.eq(i);
        var id = numtr.attr("id");
        var id_i = prizeYh.renonum(id);
        if ($("#checkbox" + (id_i + 1)).attr("checked") == true) {
          sum_mo.push(numtr.html());
        }
      }
      if (sum_mo.length == 0) {
        bs = 0;
      } else {
        bs = eval(sum_mo.join("+"));
      }
      $("#sjmoney").html(Number(bs) * 2);
    },
    /**
     * 纯粹单注倍数或者整个倍数改变时计算最大奖金和最小奖金
     */
    dzzschangeminmaxprice: function () {
      var min = 0, max = 0;
      var sjm = $("#sjmoney");
      var ssobj = $("#jjtbody").find("input[id^=prize]");
      var thisZHBouns = [];
      for (var i = 0, len = ssobj.length; i < len; i++) {
        var objnum = ssobj.eq(i);
        var obj = $("#prize" + i);
        if ($("#checkbox" + (i + 1)).attr("checked") == false) {
          thisZHBouns.push(Number(0));
        } else {
          thisZHBouns.push(Number(objnum.val()));
        }
      }
      min = eval("Math.min(" + thisZHBouns.join(",") + ")");
      max = eval("Math.max(" + thisZHBouns.join(",") + ")");
      var mincau = Number(cauScale(2, min));
      var maxcau = Number(cauScale(2, max));
      $("#minprize").html(mincau.toFixed(2));
      $("#maxprize").html(maxcau.toFixed(2));
    },
    returnjjyhtype: function () {
      var result = null;
      $(".jjyh").each(function () {
        if ($(this).hasClass("click")) {
          result = $(this).attr("id");
        }
      });
      return result;
    },
    /**
     * 混合过关计算最大和最小奖金
     */
    getBonus: function () {
      var temTeamval = [];
      var temBonus = [];
      var maxBonus = [];
      var mixBonus = [];
      var maxBonusVal = 0, minBonusVal = 0;
      var minbonus = [], hight = [];
      var lines = Line_Group.split("^");
      var sjmoenys = 0, minBonus = 0;
      if ($("#isdwf").val() == "1" || ($("#dan").val() != null && $("#dan").val() != "")) {
        var thisZHBouns = [], thisZhMinBouns = [], ht = "";
        for (var li in lines) {
          var thisTeam = lines[li]; //F20130712002#S,F20130712001#S,F20130711008#S|F20130712002#S,F20130712001#S,F20130711008#P|
          var thisTeam_m = thisTeam.split("|");
          for (var tm in thisTeam_m) {
            var bjtr = $("tr[val_data=" + thisTeam_m[tm] + "]");
            var numid = bjtr.attr("id");
            var id = prizeYh.renonum(numid);
            var bonusVal = Number($("#prize" + id).val());
            if ($("#checkbox" + (id + 1)).attr("checked") == false) {
              bonusVal = 0;
            }
            if (bonusVal > maxBonusVal) {
              maxBonusVal = bonusVal;
              ht = bjtr.attr("data-teamno");
            }
          }
          for (var j = 0, len = objtr.length; j < len; j++) {
            var objvs = objtr.eq(j);
            if (!(temTeamval.length && temTeamval[j])) {
              if ($("#checkbox" + (j + 1)).attr("checked") == false) {
                minbonus.push(0);
                break;
              } else {
                temTeamval[j] = objvs.attr("val_data");
                temBonus[j] = $("#prize" + j).val();
                minbonus.push(temBonus[j]);
              }

            }
          }
          if (ht != "")
            hight.push(ht);
          thisZHBouns.push(maxBonusVal);
          maxBonusVal = 0;
          minBonusVal = 0;
        }
        hightset = hight.join("^");
        maxBonusVal = eval(thisZHBouns.join("+"));
        minBonus = eval("Math.min(" + minbonus.join(",") + ")");
      } else {
        for (var i = 0, lens = lines.length; i < lens; i++) {
          var thisTeam = lines[i]; //"6001:11;6002:06;6003:02"
          var thisZHBouns = [];
          var sjm = $("#sjmoney");
          var obj = $("#prize" + i);
          for (var j = 0, len = objtr.length; j < len; j++) {
            var objvs = objtr.eq(j);
            if (!(temTeamval.length && temTeamval[j])) {
              temTeamval[j] = objvs.attr("val_data");
              if ($("#checkbox" + (j + 1)).attr("checked") == false) {
                temBonus[j] = 0;
              } else {
                temBonus[j] = $("#prize" + j).val();
              }
              minbonus.push(temBonus[j]);
            }
            if (prizeYh.isMaxBonus(thisTeam, temTeamval[j])) {
              thisZHBouns.push(temBonus[j]);
              hight.push(objvs.attr("data-teamno"));
            }
          }
          var bonusVal = eval(thisZHBouns.join("+"));
          if (bonusVal > maxBonusVal) {
            maxBonus = thisZHBouns;
            maxBonusVal = bonusVal;
            hightset = hight.join("^");
          }
          hight = [];
        }
        minBonus = eval("Math.min(" + minbonus.join(",") + ")");
      }
      $("#minprize").html(cauScale(2, minBonus));
      $("#maxprize").html(cauScale(2, maxBonusVal));
    },
    /**
     * 判断适合符合最大注数的要求
     * @param bonusTeamVal
     * @param thisTeamval
     * @returns {Boolean}
     */
    isMaxBonus: function (bonusTeamVal, thisTeamval) {
      var thisTeamArr = thisTeamval.split("/");
      for (var i = 0, ilen = thisTeamArr.length; i < ilen; i++) {
        if (bonusTeamVal.indexOf(thisTeamArr[i]) < 0) return false;
      }
      return true;
    },
    pljjConShow: function () {
      $("#pljjCon").show();
    },
    updataMoney: function () {
      var allupdateMoney = $("#allupdateMoney").val();
      var jjtboprize = $("#jjtbody").find("input[id^=prize]");
      for (var i = 0, len = jjtboprize.length; i < len; i++) {
        var obj_prize = jjtboprize.eq(i);
        var id = obj_prize.attr("id");
        var bs_lie = prizeYh.renonum(id);
        var prize = allupdateMoney;
        var numbs_lie = $("#num" + bs_lie);
        var bspromul = numbs_lie.html();
        var sjm = $("#sjmoney");
        sjmoney = Number(sjm.html()) - (bspromul * 2);
        if (!prize > 0)
          prize = 0;
        var one_prize = $("#tr" + bs_lie).attr("data-prize");
        var promul = Number(Math.round(prize / one_prize));
        if (promul < 1) promul = 1;
        var zh_prize = promul * one_prize;
        numbs_lie.html(promul);
        obj_prize.val(zh_prize.toFixed(2));
        if ($("#checkbox" + (Number(bs_lie) + 1)).attr("checked")) {
          sjmoney = sjmoney + (promul * 2);
        }
        sjm.html(sjmoney);
      }
      prizeYh.publicMoney();
      $("#pljjCon").hide();
    }
  };
  /**
   * 购买入库流程，验证
   */
  var buyProcess = {
    oneAmount: 1,
    projecttype: 0,
    lotteryid: 46,
    isDg: 1,
    playtype: '',
    passtype: 1,
    passway: '',
    totalamount: 0,
    totalcount: 1,
    subscribecount: 1,
    minimumcount: 0,
    projectbets: 0,
    promul: 1,
    percent: 0,
    openstatus: 4,
    detail: {
      content: '',
      projectinfo: '',
      followuser: '',
      dan: '',
      dancount: '',
      matchids: '',
      jjyhcontent: '',
      jjyhHightSet: ''
    },
    insertform: function () {
      if ($("#jjyhform").html() == null)
        $("body").append(jjyhfm);
      var jjyhformm = document.getElementById("jjyhfrom");
      jjyhformm["project.fromurl"].value = location.href.split("?")[0];
      jjyhformm["id"].value = lotteryId[lotteryid];
      jjyhformm["project.projecttype"].value = 0;
      jjyhformm["project.lotteryid"].value = lotteryid;
      jjyhformm["project.playtype"].value = 10;
      jjyhformm["project.passtype"].value = 1;
      jjyhformm["project.passway"].value = passway.replace("串", "-");
      jjyhformm["project.totalamount"].value = buyProcess.totalamount;
      jjyhformm["project.totalcount"].value = 1;
      jjyhformm["project.percent"].value = 0;
      jjyhformm["project.openstatus"].value = 4;
      jjyhformm["project.projectbets"].value = buyProcess.projectbets;
      jjyhformm["project.minimumcount"].value = 0;
      jjyhformm["project.promul"].value = 1;
      jjyhformm["project.subscribecount"].value = 1;
      jjyhformm["project.matchids"].value = matchids;
      jjyhformm["project.followuser"].value = "";
      jjyhformm["project.prevmoney"].value = cauScale(2, $("#maxprize").html());
      jjyhformm["project.jjyhcontent"].value = buyProcess.detail.jjyhcontent;
      jjyhformm["project.content"].value = content.replace(new RegExp("rq_", "g"), "");
      jjyhformm["project.jjyhkey"].value = $("#ywlsh").val();
      jjyhformm["project.dan"].value = $("#dan").val();
      jjyhformm["project.jjyhhightset"].value = buyProcess.detail.jjyhHightSet;
    },
    inserthmform: function () {
      if ($("#jjyhhmform").html() == null)
        $("body").append(jjyhhm);
      var jjyhformm = document.getElementById("jjyhhmfrom");
      jjyhformm["project.fromurl"].value = location.href.split("?")[0];
      jjyhformm["id"].value = lotteryId[lotteryid];
      jjyhformm["project.projecttype"].value = 0;
      jjyhformm["project.lotteryid"].value = lotteryid;
      jjyhformm["project.playtype"].value = 10;
      jjyhformm["project.passtype"].value = 1;
      jjyhformm["project.passway"].value = passway.replace("串", "-");
      jjyhformm["project.totalamount"].value = buyProcess.totalamount;
      jjyhformm["project.totalcount"].value = 1;
      jjyhformm["project.percent"].value = 0;
      jjyhformm["project.openstatus"].value = 4;
      jjyhformm["project.projectbets"].value = buyProcess.projectbets;
      jjyhformm["project.minimumcount"].value = 0;
      jjyhformm["project.promul"].value = 1;
      jjyhformm["project.subscribecount"].value = 1;
      jjyhformm["project.matchids"].value = matchids;
      jjyhformm["project.followuser"].value = "";
      jjyhformm["project.prevmoney"].value = cauScale(2, $("#maxprize").html());
      jjyhformm["project.jjyhcontent"].value = buyProcess.detail.jjyhcontent;
      jjyhformm["project.content"].value = content.replace(new RegExp("rq_", "g"), "");
      jjyhformm["project.jjyhkey"].value = $("#ywlsh").val();
      jjyhformm["project.buysp"].value = $("#buysp").val();
      jjyhformm["project.dan"].value = $("#dan").val();
      jjyhformm["project.jjyhhightset"].value = buyProcess.detail.jjyhHightSet;
    },
    before: function () {
      var arg = /^[1-9][0-9]*$/;
      var resu = buyProcess.zsandjjyhcontent();
      if (!resu) {
        page.toast("方案注数不能为负数！");
        return false;
      }
      if (hightset != "" && hightset != null) {
        buyProcess.hightsetcontent();
      }
      if (!arg.test($("#sjmoney").html())) {
        page.toast("实际购买金额有误！");
        return false;
      }
      if (!arg.test($("#cspromul").val())) {
        page.toast("购买倍数有误！");
        return false;
      }
      buyProcess.promul = Number($("#cspromul").val());
      buyProcess.totalamount = $("#sjmoney").html();
      if (buyProcess.projectbets > 1000000) {
        page.toast("方案总注数不能超过100万注！");
        return false;
      }
      if (Number(buyProcess.projectbets) * 2 != buyProcess.totalamount) {
        page.toast("方案注数和倍数计算出来的投注金额与实际购买金额不符！");
        return false;
      }
      buyProcess.detail.content = content;
      buyProcess.detail.matchids = matchids;
      return true;
    },
    selfbuy: function () {
      if (LoginStatus.isLogin()) {
        if (LoginStatus.getUserAmount() < parseInt($("#sjmoney").html(), 10)) { //添加用户余额是否可购买校验
          var lysu = $("#lysource").val();
          if (lysu == "888jingcai")
            jingcaiwindow.rechargeWindow();
          if (lysu == "ecp888" && is_d) {
            commonWindow.rechargeWindow();
          }
        } else {
          $.getJSON(LoginStatus.loginURL + "/user/user-info-validate/ecp3/check.shtml?cookieForm=?" + "&t=" + new Date().getTime(), {
              userid: LoginStatus.getUserId()
            }, function (responseText) {
              $("#betDivObj").removeClass("xuanxbox");
              $("#betbottom").removeClass("yhBet");
              $("#qhyhObj").removeClass("yhmenuDiv");
              if (0 == responseText.status) {
                buyProcess.rengou_afterlogin();
              } else if ("-1" == responseText.status) {
                buyProcess.rengou_afterlogin();
              } else if (responseText.status == "2") {
                page.toastLogin(responseText.message);
              } else {
                alertdiv.showBoxDivHtml(LoginStatus.userinfoPopContent(responseText), '温馨提示', 560, 300);
              }
            });
        }
      } else {
        LoginStatus.showLogin();
      }
    },
    joinbuy: function () {
      if (LoginStatus.isLogin()) {
        $.getJSON(LoginStatus.loginURL + "/user/user-info-validate/ecp3/check.shtml?cookieForm=?" + "&t=" + new Date().getTime(), {
            userid: LoginStatus.getUserId()
          }, function (responseText) {
            if (0 == responseText.status) {
              buyProcess.rengou_hemai();
            } else if ("-1" == responseText.status) {
              buyProcess.rengou_hemai();
            } else if (responseText.status == "2") {
              page.toastLogin(responseText.message);
            } else {
              alertdiv.showBoxDivHtml(LoginStatus.userinfoPopContent(responseText), '温馨提示', 560, 300);
            }
          });
      } else {
        LoginStatus.showLogin();
      }
    },
    /**
     * 认购方法
     */
    rengou_afterlogin: function () {
      if (buyProcess.before()) {
        buyProcess.insertform();
        var url = $("#contextPath").val() + "/sportsfootballorder/" + lotteryId[lotteryid] + "/bonusoptorder.shtml";
        var jjyfr = $("#jjyhfrom");
        jjyfr.attr("action", url);
        jjyfr.ajaxSubmit({
          dataType: 'json',
          success: function (responseText) {
            rkywlsh = responseText.message;
            var sjm = $("#sjmoney").html();
            jingcaiwindow.sureMessage(sjm, sjm, Number(sjm) / Number($("#cspromul").val()) / 2, 1, "buyProcess.order()", passway);
            jjyfr.remove();
          }
        });
      }
    },
    rengou_hemai: function () {
      if (buyProcess.before()) {
        buyProcess.inserthmform();
        var url = $("#contextPath").val() + "/sportsfootballpartner.shtml";
        var jjh = $("#jjyhhmfrom");
        jjh.attr("action", url);
        jjh.get(0).submit();
      }
    },
    /**
     * 异步入库
     */
    order: function () {
      $.ajax({
        url: $("#contextPath").val() + "/sportsfootballorder/" + lotteryId[lotteryid] + "/bonusoptorder.shtml?ywlsh=" + rkywlsh,
        dataType: 'json',
        success: function (data) {
          alertdiv.close();
          joinsAcount.loginCallBack();
          buyProcess.resultForm(data);
        },
        error: function (data) {
          $(".selfbuy").removeAttr("disabled");
          $(".btn_OK").removeAttr("disabled");
          alertdiv.close();
          buyProcess.resultForm(data);
        }
      });
    },
    /**
     * 打开我的投注
     */
    mybet: function () {
      window.open("/user/bet/");
      alertdiv.close();
    },
    resultForm: function (msg) {
      if (null == msg || msg.message == null) { ////@author wulong 修改  2013-9-22 12:19
        page.toast('方案提交异常');
      } else {
        msg = msg.message;
        if (msg == "A") {
          page.toast("用户余额不足!");
        } else if (msg == "B") {
          page.toast("出错了,请与客服联系!");
        } else {
          msg = msg.split("_");
          if (msg.length == 2) {
            var url = $("#contextPath").val() + "/jingcai/jingcaifootballdetail/" + msg[0] + "/index.shtml";
            if ($("#lysource").val() == "ecp888") {
              url = $("#contextPath").val() + "/sportsfootballdetail/" + msg[0] + "/index.shtml";
            }
            jingcaiwindow.successMessage("buyProcess.closeSuccess()", "buyProcess.lookProject('" + url + "')", "Z");
          } else {
            if (msg[0].length > 20)
              page.toast(msg[0]); else
              page.toast(msg[0]);
          }
        }
      }
    },
    /**
     * 得到入库时的方案注数和奖金优化后的单式内容
     * @returns {注数}
     */
    zsandjjyhcontent: function () {
      var zs = 0;
      var jjyhcontent = new Array();
      var result = true;
      for (var j = 0, lenh = objtr.length; j < lenh; j++) {
        var trzs = objtr.eq(j);
        var num = 0;
        if (trzs.find("input[id^=checkbox]").attr("checked") == true) {
          var anum = trzs.find("td[id^=num]").html();
          if (prizeYh.validation(anum) || Number(anum) == 0)
            num = Number(anum); else {
            result = false;
          }
        } else {
          num = 0;
        }
        zs += num;
        var c = trzs.attr("data-teamno"); //F20130401001#平/F20130401002#5:2/F20130401003#6球
        var cc = c.split("/");
        var html = buyProcess.contentpublic(cc);
        html += "#" + passway.replace("串", "-") + "#" + num;
        jjyhcontent.push(html);
      }
      buyProcess.projectbets = zs;
      buyProcess.detail.jjyhcontent = jjyhcontent.join("^");
      return result;
    },
    contentpublic: function (cc) {
      var html = "";
      for (var i = 0, len = cc.length; i < len; i++) {
        var b = cc[i].split("#");
        var gameid = b[0];
        var con = contentType[b[1]]; //"0-0#47"
        var d = con.split("#");
        var lot = d[1];
        if (lot == 46) {
          html += gameid + ":" + d[0] + "||||";
        } else if (lot == 47) {
          html += gameid + ":|" + d[0] + "|||";
        } else if (lot == 48) {
          html += gameid + ":||" + d[0] + "||";
        } else if (lot == 49) {
          html += gameid + ":|||" + d[0] + "|";
        } else if (lot == 56) {
          html += gameid + ":||||" + d[0];
        }
        if (i < len - 1)
          html += "/";
      }
      return html;
    },
    hightsetcontent: function () {
      var hs = hightset.split("^");
      var zs = 0;
      var jjyhcontent = new Array();
      var numbercon = [];
      if (hs.length < 2) {
        for (var j = 0, lenh = objtr.length; j < lenh; j++) {
          var trzs = objtr.eq(j);
          var prize = Number(trzs.find("input[id^=prize]").val());
          var c = trzs.attr("data-teamno"); //F20130401001#平/F20130401002#5:2/F20130401003#6球
          numbercon.push({
            "prize": prize,
            "content": c
          });
        }
        numbercon.sort(function (a, b) {
          return a.prize > b.prize ? -1 : 1;
        });
        var c_con = numbercon[0].content.split("/");
        jjyhcontent.push(buyProcess.contentpublic(c_con));
      } else {
        for (var j = 0, lenh = hs.length; j < lenh; j++) {
          var c = hs[j];
          var cc = c.split("/");
          jjyhcontent.push(buyProcess.contentpublic(cc));
        }
      }
      buyProcess.detail.jjyhHightSet = jjyhcontent.join("^");
    },
    //查看买到的方案
    lookProject: function (url) {
      window.open(url);
      window.close();
    },
    //继续购彩
    closeSuccess: function () {
      alertdiv.close();
      window.close();
    }
  };

  function Combin1(s) {
    var temp = s[0];
    for (var i = 1; i < s.length; i++) {
      temp = Multiplication1(temp, s[i]);
    }
    return temp;
  }

  function Multiplication1(a, b) {
    var result = new Array();
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < b.length; j++) {
        result.push(a[i] + "/" + b[j]);
      }
    }
    return result;
  }

  /**
   * 注数金额字体颜色判断
   */
  function clickClassChange() {
    var prizeinput = $("#jjtbody").find("input[id^=prize]");
    var sjm = $("#sjmoney");
    for (var i = 0, len = prizeinput.length; i < len; i++) {
      var obj = prizeinput.eq(i);
      var ps = Number(obj.val());
      if (ps == 0)
        obj.removeClass("red"); else {
        if (Number(sjm.html()) > ps) {
          obj.removeClass("red");
        } else {
          obj.addClass("red");
        }
      }
    }
  }

  function clickClassChangeTwo(obj, sjm) {
    if (Number(sjm.html()) > Number(obj.val())) {
      obj.removeClass("red");
    } else {
      obj.addClass("red");
    }
  }

  /**
   * 四舍六入五成双 - 奖金计算方式
   * @param mod 精度-要处理的小数点位数（ 值必须大于0）
   * @param big 处理值（值必须大于0）
   * @returns
   */
  function cauScale(mod, big) {
    if (mod <= 0) return big;
    if (big <= 0) return big;
    var mathstr = big.toString();
    var dian = mathstr.indexOf(".");
    if (dian > 0 && mathstr.length - dian - 1 > mod) {
      var base = mathstr.substring(0, dian);
      var adress = mathstr.substring(dian + 1, mathstr.length);
      if (adress.length <= mod) {
        base = base + "." + adress;
      } else if (adress.length >= mod + 1) {
        var v = parseInt(adress.substring(mod, mod + 1), 10); //精确位小数后一位
        var v1 = parseInt(adress.substring(mod - 1, mod), 10); //精确位小数。
        var m = 0;
        if (v >= 6) { //精确位后大于等于6，精确位进一
          m++;
        } else if (v <= 4) { //精确位后小于等于4，精确位后舍弃
          ;
        } else if (v == 5 && adress.length > mod + 1) { //精确位后为5时，精确位后一位还有其他值，精确位进一
          m++;
        } else if (v == 5 && v1 % 2 == 0) { //精确位后为5时，精确位前为偶时，精确位后一位舍弃。
          ;
        } else if (v == 5 && v1 % 2 == 1) { //精确位后为5时，精确位前为奇时，精确位进一
          m++;
        }
        var s = adress.substring(0, mod - 1);
        var fl = s + v1;
        if (m > 0 && parseInt(s, 10) > 0) {
          fl = parseInt(fl, 10) + 1;
          if (fl >= Math.pow(10, mod)) {
            base = parseInt(base, 10) + 1;
            fl = fl % 100;
          }
          big = base.toString() + "." + fl.toString();
        } else if (m > 0 && parseInt(s, 10) == 0) {
          fl = v1 + 1;
          if (fl >= Math.pow(10, mod)) {
            base = parseInt(base, 10) + 1;
            fl = fl % 100;
          } else if (fl < 10) {
            var tempfl = '';
            for (var k = 0; k < mod - 1; k++) {
              tempfl += '0';
            }
            fl = tempfl + fl;
          } else if (fl == 10) {
            var tempfl = '';
            for (var k = 0; k < mod - 2; k++) {
              tempfl += '0';
            }
            fl = tempfl + fl;
          }
          big = base.toString() + "." + fl.toString();
        } else {
          big = base + "." + fl;
        }
      }
    }
    if (dian < 0) big = big + ".00";
    if (mathstr.substring(dian + 1).length < 2) big = mathstr + "0";
    return big;
  }

//加法
  Number.prototype.add = function (arg) {
    var r1, r2, m;
    try {
      r1 = this.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (this * m + arg * m) / m;
  };

//减法
  Number.prototype.sub = function (arg) {
    return this.add(-arg);
  };

//乘法
  Number.prototype.mul = function (arg) {
    var m = 0, s1 = this.toString(), s2 = arg.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) {
    }
    try {
      m += s2.split(".")[1].length;
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  };

//除法
  Number.prototype.div = function (arg) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
      t1 = this.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
      t2 = arg.toString().split(".")[1].length;
    } catch (e) {
    }
    with (Math) {
      r1 = Number(this.toString().replace(".", ""));
      r2 = Number(arg.toString().replace(".", ""));
      return (r1 / r2) * pow(10, t2 - t1);
    }
  };
  /**
   * 一些组合算法
   */
  var CAsf = {
    //去除重复的
    distinct: function (objh) {
      var sameObj = function (a, b) {
        var tag = true;
        if (!a || !b)
          return false;
        for (var x in a) {
          if (!b[x])
            return false;
          if (typeof (a[x]) === 'object') {
            tag = sameObj(a[x], b[x]);
          } else {
            if (a[x] !== b[x])
              return false;
          }
        }
        return tag;
      };
      var newArr = [], obj = {};
      for (var i = 0, len = objh.length; i < len; i++) {
        if (!sameObj(obj[typeof (objh[i]) + objh[i]], objh[i])) {
          newArr.push(objh[i]);
          obj[typeof (objh[i]) + objh[i]] = objh[i];
        }
      }
      return newArr;
    },
    //得到所有的组合
    Combin: function (s) {
      var temp = s[0];
      for (var i = 1; i < s.length; i++) {
        temp = CAsf.Multiplication(temp, s[i]);
      }
      return temp;
    },
    Multiplication: function (a, b) {
      var result = new Array();
      for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < b.length; j++) {
          result.push(a[i] + "," + b[j]);
        }
      }
      return result;
    },
    FastGroupNums: function (s, i, d, NumberLen, Numbers) {
      for (var n = i; n < Numbers - NumberLen + d + 1; n++) {
        if (d == NumberLen) {
          fonL_.push(s + n);
        } else {
          CAsf.FastGroupNums(s + n + ",", n + 1, d + 1, NumberLen, Numbers);
        }
      }
    },
    //返回选择的过关方式的最大关数和最小关数
    MaxMinC: function (ptypeList) {
      for (var i = 0; i < ptypeList.length; i++) {
        var subPType = ptypeList[i];
        var max = parseInt(subPType.replace(/\d+_\d+/gi, "$1")); //最大关数
        var min = parseInt(subPType.replace(/\d+_\d+/gi, "$1"));
        if (subPType == "2-3") {
          min = 1;
        } else if (subPType == "3-3") {
          min = 2;
          max = 2;
        } else if (subPType == "3-4") {
          min = 2;
        } else if (subPType == "3-7") {
          min = 1;
        } else if (subPType == "4-4") {
          min = 3;
          max = 3;
        } else if (subPType == "4-5") {
          min = 3;
        } else if (subPType == "4-6") {
          min = 2;
          max = 2;
        } else if (subPType == "4-11") {
          min = 2;
        } else if (subPType == "4-15") {
          min = 1;
        } else if (subPType == "5-5") {
          min = 4;
          max = 4;
        } else if (subPType == "5-6") {
          min = 4;
        } else if (subPType == "5-10") {
          min = 2;
          max = 2;
        } else if (subPType == "5-16") {
          min = 3;
        } else if (subPType == "5-20") {
          min = 2;
          max = 3;
        } else if (subPType == "5-26") {
          min = 2;
        } else if (subPType == "5-31") {
          min = 1;
        } else if (subPType == "6-6") {
          min = 5;
          max = 5;
        } else if (subPType == "6-7") {
          min = 5;
        } else if (subPType == "6-15") {
          min = 2;
          max = 2;
        } else if (subPType == "6-20") {
          min = 3;
          max = 3;
        } else if (subPType == "6-22") {
          min = 4;
        } else if (subPType == "6-35") {
          min = 2;
          max = 3;
        } else if (subPType == "6-42") {
          min = 3;
        } else if (subPType == "6-50") {
          min = 2;
          max = 4;
        } else if (subPType == "6-57") {
          min = 2;
        } else if (subPType == "6-63") {
          min = 1;
        } else if (subPType == "7-7") {
          min = 6;
          max = 6;
        } else if (subPType == "7-8") {
          min = 6;
        } else if (subPType == "7-21") {
          min = 5;
          max = 5;
        } else if (subPType == "7-35") {
          min = 4;
          max = 4;
        } else if (subPType == "7-120") {
          min = 2;
        } else if (subPType == "8-8") {
          min = 7;
          max = 7;
        } else if (subPType == "8-9") {
          min = 7;
        } else if (subPType == "8-28") {
          min = 6;
          max = 6;
        } else if (subPType == "8-56") {
          min = 5;
          max = 5;
        } else if (subPType == "8-70") {
          min = 4;
          max = 4;
        } else if (subPType == "8-247") {
          min = 2;
        }
        for (var k = min; k <= max; k++)
          ptList.push(k);
      }
      return ptList;
    }
  };
});