define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(data, function (d) {
var reds = [], blues = [],
numbers = d.lotteryNumbers.split(","),
issueNo = d.issueNo;
switch(lot) {
  case "ssq": // 双色球
    if (numbers.length > 6) {
      reds = numbers.slice(0, 6);
      blues = numbers.slice(6, 7);
    }
    break;
  case "dlt": // 大乐透
    if (numbers.length > 6) {
      reds = numbers.slice(0, 5);
      blues = numbers.slice(5, 7);
    }
    break;
  case "f3d": // 福彩3D
  case "pl3": // 大乐透
    reds = numbers;
    break;
  case "syx": // 11选5
  case "syy": // 十一运夺金
    reds = numbers;
    issueNo = issueNo.substring(8);
    break;
}
;
__p += '\r\n<p>\r\n  第' +
((__t = (issueNo )) == null ? '' : __t) +
'期开奖:\r\n\r\n  ';
 _.each(reds, function (r) { ;
__p += '\r\n  <b class="cdd1049">' +
((__t = (r )) == null ? '' : __t) +
'</b>\r\n  ';
 }); ;
__p += '\r\n\r\n  ';
 _.each(blues, function (b) { ;
__p += '\r\n  <b class="c0cc">' +
((__t = (b )) == null ? '' : __t) +
'</b>\r\n  ';
 }); ;
__p += '\r\n</p>\r\n';
 }); ;


}
return __p
}});