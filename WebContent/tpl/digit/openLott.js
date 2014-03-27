define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(data, function (d) { ;
__p += '\r\n<table cellpadding="0" cellspacing="0" width="100%" class="line30 kjList">\r\n  <tr>\r\n    <td>\r\n      <i class="fl">第' +
((__t = (d.issueNo )) == null ? '' : __t) +
'期</i>\r\n      <i class="fr">' +
((__t = (d.openDate )) == null ? '' : __t) +
'</i></td>\r\n  </tr>\r\n  ';

  var numbers = d.lotteryNumbers.split(","),
  reds = [], blues = [];
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
  case "pl3": // 排列3
    reds = numbers;
    break;
  }
  ;
__p += '\r\n  <tr>\r\n    <td class="kjBall">\r\n      ';
 if (lot=="ssq" || lot=="dlt" || lot=="f3d" || lot=="pl3") { ;
__p += '\r\n      <i class="fm fr" id="m_' +
((__t = (d.issueNo )) == null ? '' : __t) +
'">&#xf059;</i>\r\n      ';
};
__p += '\r\n      ';
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
__p += '\r\n    </td>\r\n  </tr>\r\n</table>\r\n';
 });;


}
return __p
}});