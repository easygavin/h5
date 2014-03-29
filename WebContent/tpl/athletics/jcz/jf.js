define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<table class="line50" cellpadding="0" cellspacing="0" width="100%"\r\n       style="border-top:none;margin-top:0;">\r\n  <thead>\r\n  <tr>\r\n    <td colspan="12">' +
((__t = (hostName )) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  <tr>\r\n    <td></td>\r\n    <td>赛</td>\r\n    <td>胜</td>\r\n    <td>平</td>\r\n    <td>负</td>\r\n    <td>得</td>\r\n    <td>失</td>\r\n    <td>净</td>\r\n    <td>积</td>\r\n    <td>排</td>\r\n    <td>胜率</td>\r\n  </tr>\r\n  </thead>\r\n  <tbody>\r\n  ';
 for(var i= 0, l=host.length; i < l; i++ ){;
__p += '\r\n  <tr>\r\n    <td>' +
((__t = (host[i].full)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].matchCount)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].matchWin)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].matchDraw)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].matchLost)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].ballGoal)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].ballLost)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].ballNet)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].nowScore)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].ranking)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].rateWin)) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  ';
};
__p += '\r\n  </tbody>\r\n</table>\r\n<table class="line50" cellpadding="0" cellspacing="0" width="100%"\r\n       style="border-top:none;margin-top:0;">\r\n  <thead>\r\n  <tr>\r\n    <td colspan="12">' +
((__t = (visitName )) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  <tr>\r\n    <td></td>\r\n    <td>赛</td>\r\n    <td>胜</td>\r\n    <td>平</td>\r\n    <td>负</td>\r\n    <td>得</td>\r\n    <td>失</td>\r\n    <td>净</td>\r\n    <td>积</td>\r\n    <td>排</td>\r\n    <td>胜率</td>\r\n  </tr>\r\n  </thead>\r\n  <tbody>\r\n  ';
 for(var i= 0, l=visit.length; i < l; i++ ){;
__p += '\r\n  <tr>\r\n    <td>' +
((__t = (visit[i].full)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].matchCount)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].matchWin)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].matchDraw)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].matchLost)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].ballGoal)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].ballLost)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].ballNet)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].nowScore)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].ranking)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].rateWin)) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  ';
};
__p += '\r\n  </tbody>\r\n</table>';

}
return __p
}});