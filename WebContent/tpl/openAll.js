define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(datas, function (d) { ;
__p += '\r\n  ';

  var lotteryType = d.lotteryType + "", lotteryName = "";
  var numbers = d.lotteryNumbers.split(","),
  reds = [], blues = [], desc = "";
  switch (lotteryType) {
    case "11": // 双色球
      lotteryName = "双色球";
      if (numbers.length > 6) {
        reds = numbers.slice(0, 6);
        blues = numbers.slice(6, 7);
      } else {
        reds = numbers;
      }
    break;
    case "13": // 大乐透
      lotteryName = "大乐透";
      if (numbers.length > 6) {
        reds = numbers.slice(0, 5);
        blues = numbers.slice(5, 7);
      } else {
        reds = numbers;
      }
      break;
    case "12": // 福彩3D
      lotteryName = "福彩3D";
      reds = numbers;
      break;
    case "4": // 排列3
      lotteryName = "排列3";
      reds = numbers;
      break;
    case "34": // 11选5
      lotteryName = "11选5";
      reds = numbers;
      break;
    case "31": // 十一运夺金
      lotteryName = "十一运夺金";
      reds = numbers;
      break;
    case "46": // 竞彩足球
      lotteryName = "竞彩足球";
      desc = "查看开奖详情";
      break;
    case "36": // 竞彩篮球
      lotteryName = "竞彩篮球";
      desc = "查看开奖详情";
      break;
  }
  ;
__p += '\r\n  ';
 if(lotteryType != '89' && lotteryType != '92' &&  lotteryType !='1' && lotteryType !='88' ){;
__p += '\r\n<table cellpadding="0" cellspacing="0" width="100%" class="line30 kjList bt4 mt10">\r\n  <tr>\r\n    <td>\r\n      <i class="fl">' +
((__t = (lotteryName )) == null ? '' : __t) +
'</i>\r\n      <i class="fr">第' +
((__t = (d.issueNo )) == null ? '' : __t) +
'期</i></td>\r\n  </tr>\r\n  <tr>\r\n    <td class="kjBall">\r\n      <i class="fm fr" id="m_' +
((__t = (d.lotteryType )) == null ? '' : __t) +
'">&#xf059;</i>\r\n      ';
 _.each(reds, function (r) { ;
__p += '\r\n      <span class="red">' +
((__t = (r )) == null ? '' : __t) +
'</span>\r\n      ';
 });;
__p += '\r\n      ';
 _.each(blues, function (b) { ;
__p += '\r\n      <span class="blue">' +
((__t = (b )) == null ? '' : __t) +
'</span>\r\n      ';
 });;
__p += '\r\n      ';
 if (desc != "") { ;
__p += '\r\n        <i class="cdd1049">' +
((__t = (desc )) == null ? '' : __t) +
'</i>\r\n      ';
 } ;
__p += '\r\n    </td>\r\n  </tr>\r\n  ';
};
__p += '\r\n</table>\r\n';
 });;


}
return __p
}});