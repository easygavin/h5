define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="lotteryNum">\r\n  <p class="f16">方案编号:' +
((__t = (lotteryNo )) == null ? '' : __t) +
'</p>\r\n</div>\r\n<div class="hmBox" style="font-size: 1.0em">\r\n  <p class="bl3">发起人：' +
((__t = (createUser)) == null ? '' : __t) +
'</p>\r\n  <p>发起时间：' +
((__t = (createDate )) == null ? '' : __t) +
'</p>\r\n  <P>中奖次数：<i style="color:red">' +
((__t = (createUserWinCount)) == null ? '' : __t) +
'</i>次</p>\r\n  <P>中奖总金额:<i style="color:red">' +
((__t = (createUserWinAmount)) == null ? '' : __t) +
'</i>元</p>\r\n  <P>佣金提成:<i style="color:red">' +
((__t = (commPercent)) == null ? '' : __t) +
'</i>%</p>\r\n  <p>方案份数:<i style="color:red">' +
((__t = (totalCount)) == null ? '' : __t) +
'</i>份&nbsp;&nbsp每份金额:<i style="color:red">' +
((__t = (oneAmount)) == null ? '' : __t) +
'</i>元</p>\r\n  <p>\r\n        进度:<i class="jdbox"><i style="width:' +
((__t = ((buyVolume/totalCount).toFixed(2)*100)) == null ? '' : __t) +
'%"></i> </i>\r\n        ' +
((__t = ((buyVolume/totalCount).toFixed(2)*100)) == null ? '' : __t) +
'%+(保)' +
((__t = ((holdVolume/totalCount).toFixed(2)*100)) == null ? '' : __t) +
'%\r\n  </p>\r\n</div>\r\n<table cellpadding="0" cellspacing="0" width="100%" class="line30 tabp bt3">\r\n  <colgroup>\r\n    <col width=\'70%\'>\r\n    <col width=\'20%\'>\r\n    <col width=\'10%\'>\r\n  </colgroup>\r\n  <thead>\r\n  <tr>\r\n    <td colspan="3">' +
((__t = (title)) == null ? '' : __t) +
'<span class="fr">' +
((__t = (passWay)) == null ? '' : __t) +
'</span></td>\r\n  </tr>\r\n  </thead>\r\n  <tbody>\r\n  ';

  for(var i = 0, len = detail.length; i < len; i++) {
  var content = detail[i].content.replace(/{/g, '<span class="cdd1049">').replace(/}/g, '</span>').replace(/\n/g, '<br>');
  ;
__p += '\r\n  <tr>\r\n    <td>' +
((__t = (content)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (detail[i].score)) == null ? '' : __t) +
'</td>\r\n    <td class="cdd1049">' +
((__t = (detail[i].dan)) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  ';
};
__p += '\r\n  </tbody>\r\n</table>\r\n<div class="w45"></div>';

}
return __p
}});