define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="detail">\r\n  <p>' +
((__t = (issueTitle )) == null ? '' : __t) +
'第' +
((__t = (issueNo )) == null ? '' : __t) +
'期</p>\r\n  ';

  var numbers = lotteryNumber.split(","),
  reds = [], blues = [];
  switch(lot) {
    case "ssq": // 双色球
      if (numbers.length > 6) {
        reds = numbers.slice(0, 6);
        blues = numbers.slice(6, 7);
      } else {
        reds = numbers;
      }
      break;
    case "dlt": // 大乐透
      if (numbers.length > 6) {
        reds = numbers.slice(0, 5);
        blues = numbers.slice(5, 7);
      } else {
        reds = numbers;
      }
      break;
    case "f3d": // 福彩3D
    case "pl3": // 排列3
      reds = numbers;
    break;
  }
  ;
__p += '\r\n  <p>开奖号码：\r\n    ';
 if (reds.length) { ;
__p += '\r\n      <span class="cdd1049">' +
((__t = (reds.join(" "))) == null ? '' : __t) +
'</span>\r\n    ';
} ;
__p += '\r\n\r\n    ';
 if (blues.length) { ;
__p += '\r\n      <span class="c0cc">' +
((__t = (blues.join(" "))) == null ? '' : __t) +
'</span>\r\n    ';
} ;
__p += '\r\n  </p>\r\n\r\n  <p>开奖时间：' +
((__t = (openDate )) == null ? '' : __t) +
'</p>\r\n\r\n  <p>本期销量：' +
((__t = (betAmount )) == null ? '' : __t) +
'元</p>\r\n\r\n  <p>奖池滚存：' +
((__t = (bonusAmount )) == null ? '' : __t) +
'元</p>\r\n</div>\r\n\r\n';

var levelMap = {
  "ssq":{
    "1":"一等奖",
    "2":"二等奖",
    "3":"三等奖",
    "4":"四等奖",
    "5":"五等奖",
    "6":"六等奖"
  },
  "dlt":{
    "1":"一等奖基本",
    "2":"一等奖追加",
    "3":"二等奖基本",
    "4":"二等奖追加",
    "5":"三等奖基本",
    "6":"三等奖追加",
    "7":"四等奖基本",
    "8":"四等奖追加",
    "9":"五等奖基本",
    "10":"五等奖追加",
    "11":"六等奖基本",
    "12":"六等奖追加",
    "13":"七等奖基本",
    "14":"七等奖追加",
    "15":"八等奖基本",
    "16":"12选2"
  },
  "f3d":{
    "1":"直选",
    "2":"组选3",
    "3":"组选6"
  },
  "pl3":{
    "1":"直选",
    "2":"组选3",
    "3":"组选6"
  }
};
;
__p += '\r\n<div class="lookBox">\r\n  <table cellpadding="0" cellspacing="0" width="100%" class="mLine30">\r\n    <colgroup>\r\n      <col width="33%">\r\n      <col width="33%">\r\n      <col width="34%">\r\n    </colgroup>\r\n    <thead>\r\n    <tr>\r\n      <td>奖项</td>\r\n      <td>中奖注数</td>\r\n      <td>每注奖金(元)</td>\r\n    </tr>\r\n    </thead>\r\n    <tbody>\r\n    ';
 _.each(winDatas, function (w) {
    var levelName = levelMap[lot][w.level];
    ;
__p += '\r\n    <tr>\r\n      <td>' +
((__t = (levelName )) == null ? '' : __t) +
'</td>\r\n      <td>' +
((__t = (w.count )) == null ? '' : __t) +
'</td>\r\n      <td>' +
((__t = (w.bonus )) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    ';
 });;
__p += '\r\n    </tbody>\r\n  </table>\r\n</div>';

}
return __p
}});