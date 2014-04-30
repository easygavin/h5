define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

_.each(data.datas,function(data){;
__p += '\r\n    <tr>\r\n      <td>\r\n        <div class="hmBox">\r\n\r\n          <p class="bl3"> <b class="c257ab3">' +
((__t = (map[data.lotteryType].title)) == null ? '' : __t) +
'</b> </p>\r\n\r\n          <p>发起人：' +
((__t = (hideString(data.createUserName))) == null ? '' : __t) +
'&nbsp;\r\n            ' +
((__t = (honour(parseInt(data.goldStar),parseInt(data.silverStar)))) == null ? '' : __t) +
'\r\n          </p>\r\n\r\n          <p>总金额：' +
((__t = (data.totalAmount)) == null ? '' : __t) +
'元，剩余' +
((__t = (data.restVolume)) == null ? '' : __t) +
'份</p>\r\n          <p>进度：<i class="jdbox"><i style="width:' +
((__t = (data.percent)) == null ? '' : __t) +
'%"></i> </i>' +
((__t = (data.percent)) == null ? '' : __t) +
'%+' +
((__t = (data.holdPercent)) == null ? '' : __t) +
'%(保)\r\n          </p>\r\n          <a id=\'more_' +
((__t = (data.lotteryType)) == null ? '' : __t) +
'_' +
((__t = (data.projectId)) == null ? '' : __t) +
'\' class=\'fm rightJ c257ab3\'>&#xf059;</a>\r\n        </div>\r\n      </td>\r\n    </tr>\r\n';
});;


}
return __p
}});