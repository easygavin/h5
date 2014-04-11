define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(matchs, function (m) { ;
__p += '\r\n<table id="m_' +
((__t = (m.gameId )) == null ? '' : __t) +
'" cellpadding="0" cellspacing="0" width="50%" class="line50 fl">\r\n  <colgroup>\r\n    <col width="25%">\r\n    <col width="25%">\r\n  </colgroup>\r\n  <tbody>\r\n  <tr>\r\n    <td><img src="' +
((__t = (flags[m.team] )) == null ? '' : __t) +
'" width="5em"><br>' +
((__t = (m.team )) == null ? '' : __t) +
'</td>\r\n    <td class="matchSp">赔率<br>' +
((__t = (m.sp )) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  </tbody>\r\n</table>\r\n';
 }); ;
__p += '\r\n';
 if (matchs.length == 0){ ;
__p += '\r\n  暂无赛事数据\r\n';
} ;


}
return __p
}});