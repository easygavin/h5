define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="detail">\r\n  <p>方案编号：' +
((__t = (lotteryNo )) == null ? '' : __t) +
'</p>\r\n\r\n  <p>发起人：' +
((__t = (createUser )) == null ? '' : __t) +
'</p>\r\n\r\n  <p>发起时间：' +
((__t = (createDate )) == null ? '' : __t) +
'</p>\r\n\r\n  <p>方案金额：' +
((__t = (totalAmount )) == null ? '' : __t) +
'元</p>\r\n\r\n  <p>认购金额：' +
((__t = (oneAmount )) == null ? '' : __t) +
'元</p>\r\n\r\n  <p>方案状态：' +
((__t = (projectState )) == null ? '' : __t) +
'</p>\r\n\r\n  <p>方案奖金：' +
((__t = (bonus + (isNaN(bonus) ? "" : "元") )) == null ? '' : __t) +
'</p>\r\n</div>\r\n\r\n<div class="detailList bt3">\r\n  <ul>\r\n    ';
 if (hasWithdraw > 1) { ;
__p += '\r\n    <li class="title">\r\n      <p><i id="pullBtn" class="fr fm down">&#xf003;</i>' +
((__t = (title )) == null ? '' : __t) +
'</p>\r\n    </li>\r\n    <li>\r\n      <p id="allIssueList" class="hidden"></p>\r\n    </li>\r\n    ';
 } else { ;
__p += '\r\n    <li class="title">\r\n      <p>' +
((__t = (title )) == null ? '' : __t) +
'</p>\r\n    </li>\r\n    ';
 } ;
__p += '\r\n    <li><p>' +
((__t = (detail )) == null ? '' : __t) +
'</p></li>\r\n    ';
 if (openNumber) { ;
__p += '\r\n    <li class="title"><p>\r\n      ' +
((__t = (issueNo )) == null ? '' : __t) +
'期开奖号码:\r\n      ';
 if (reds) { ;
__p += '\r\n      <span class="cdd1049">' +
((__t = (reds )) == null ? '' : __t) +
'</span>\r\n      ';
 } ;
__p += '\r\n      ';
 if (blues) { ;
__p += '\r\n      <span class="c0cc">' +
((__t = (blues )) == null ? '' : __t) +
'</span>\r\n      ';
 } ;
__p += '\r\n    </p></li>\r\n    ';
 } ;
__p += '\r\n  </ul>\r\n</div>';

}
return __p
}});