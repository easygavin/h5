define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="lotteryNum">\r\n  <p class="f16">方案编号:' +
((__t = (lotteryNo )) == null ? '' : __t) +
'</p>\r\n</div>\r\n<div class="hmBox">\r\n  <p class="bl3">发起人：' +
((__t = (createUser )) == null ? '' : __t) +
'</p>\r\n  <p>发起时间：' +
((__t = (createDate )) == null ? '' : __t) +
'</p>\r\n  <p>方案金额：' +
((__t = (totalAmount )) == null ? '' : __t) +
'元</p>\r\n  <p>认购金额：' +
((__t = (oneAmount*userBuyVolume )) == null ? '' : __t) +
'元</p>\r\n  <p>方案状态：' +
((__t = (projectState )) == null ? '' : __t) +
'</p>\r\n  <p>奖金:<span class="cdd1049">' +
((__t = (+bonus?bonus+'元':bonus )) == null ? '' : __t) +
'</span></p>\r\n</div>\r\n<table cellpadding="0" cellspacing="0" width="100%" class="line30 tabp bt3">\r\n  <colgroup>\r\n    <col width=\'70%\'>\r\n    <col width=\'20%\'>\r\n    <col width=\'10%\'>\r\n  </colgroup>\r\n  <thead>\r\n  <tr>\r\n    <td colspan="3">' +
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