define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="detail">\r\n  <p>方案编号：' +
((__t = (projectInfo.projectNo )) == null ? '' : __t) +
'</p>\r\n\r\n  <p>发起人：' +
((__t = (projectInfo.userName )) == null ? '' : __t) +
'</p>\r\n\r\n  <p>发起时间：' +
((__t = (projectInfo.projectDate )) == null ? '' : __t) +
'</p>\r\n\r\n  <p>方案金额：' +
((__t = (projectInfo.totalAmout )) == null ? '' : __t) +
'元</p>\r\n\r\n  <p>认购金额：' +
((__t = (projectInfo.oneAmount )) == null ? '' : __t) +
'元</p>\r\n\r\n  <p>方案状态：' +
((__t = (projectInfo.projectState )) == null ? '' : __t) +
'</p>\r\n\r\n  <p>方案奖金：' +
((__t = (projectInfo.awardAmount )) == null ? '' : __t) +
'元</p>\r\n</div>\r\n\r\n<div class="detailList bt3">\r\n  <ul>\r\n    <li class="title">\r\n      <p>\r\n        ';

        var event = "";
        if (matchInfo.length) {
          event = matchInfo[0].event;
        }
        ;
__p += '\r\n        ' +
((__t = (event )) == null ? '' : __t) +
'\r\n        冠军竞猜</p>\r\n    </li>\r\n    <li>\r\n      <p>\r\n      <table cellpadding=\'0\' cellspacing=\'0\' width=\'100%\' class=\'line30\'>\r\n        <colgroup>\r\n          <col width="10%">\r\n          <col width="10%">\r\n          <col width="40%">\r\n          <col width="20%">\r\n          <col width="20%">\r\n        </colgroup>\r\n        <tbody>\r\n        ';
 _.each(matchInfo, function (m) { ;
__p += '\r\n        <tr>\r\n          <td>&nbsp;</td>\r\n          <td>' +
((__t = ((m.gameId.length == 1 ? "0" + m.gameId : m.gameId) )) == null ? '' : __t) +
'</td>\r\n          <td>' +
((__t = (m.team )) == null ? '' : __t) +
'</td>\r\n          <td>' +
((__t = (m.promul )) == null ? '' : __t) +
'倍</td>\r\n          <td>' +
((__t = (m.sp )) == null ? '' : __t) +
'</td>\r\n        </tr>\r\n        ';
 });;
__p += '\r\n        </tbody>\r\n      </table>\r\n      </p>\r\n    </li>\r\n  </ul>\r\n</div>';

}
return __p
}});