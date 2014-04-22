define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<table class="line50" cellpadding="0" cellspacing="0" width="100%" style="border-top:none;margin-top:0;">\r\n  <thead>\r\n  <tr>\r\n    <td colspan="6" align="left">/ 历史交锋</td>\r\n  </tr>\r\n  <tr>\r\n    <td>时间</td>\r\n    <td>赛事</td>\r\n    <td>主队</td>\r\n    <td>比分</td>\r\n    <td>客队</td>\r\n    <td>胜负</td>\r\n  </tr>\r\n  </thead>\r\n  <tbody>\r\n  ';
 for(var i= 0, l=jf.length; i < l; i++ ){;
__p += '\r\n  <tr>\r\n    <td>' +
((__t = (jf[i].time)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (jf[i].gameShortCn)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (jf[i].hostname)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (jf[i].score)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (jf[i].visitname)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (jf[i].spf)) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  ';
};
__p += '\r\n  </tbody>\r\n</table>\r\n<table class="line50" cellpadding="0" cellspacing="0" width="100%" style="border-top:none;margin-top:0;">\r\n  <thead>\r\n  <tr>\r\n    <td colspan="6">\r\n      <span style="float:left;">/ 近期战绩</span>\r\n      <span class="bold" style="margin-left: -90px;">' +
((__t = (hostName)) == null ? '' : __t) +
'</span>\r\n    </td>\r\n  </tr>\r\n  <tr>\r\n    <td>时间</td>\r\n    <td>赛事</td>\r\n    <td>主队</td>\r\n    <td>比分</td>\r\n    <td>客队</td>\r\n    <td>胜负</td>\r\n  </tr>\r\n  </thead>\r\n  <tbody>\r\n  ';
 for(var i= 0, l=host.length; i < l; i++ ){;
__p += '\r\n  <tr>\r\n    <td>' +
((__t = (host[i].time)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].gameShortCn)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].hostname)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].score)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].visitname)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (host[i].spf)) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  ';
};
__p += '\r\n  </tbody>\r\n</table>\r\n<table class="line50" cellpadding="0" cellspacing="0" width="100%" style="border-top:none;margin-top:0;">\r\n  <thead>\r\n  <tr>\r\n    <td colspan="6">\r\n      <span style="float:left;">/ 近期战绩</span>\r\n      <span class="bold" style="margin-left: -90px;">' +
((__t = (visitName)) == null ? '' : __t) +
'</span>\r\n    </td>\r\n  </tr>\r\n  <tr>\r\n    <td>时间</td>\r\n    <td>赛事</td>\r\n    <td>主队</td>\r\n    <td>比分</td>\r\n    <td>客队</td>\r\n    <td>胜负</td>\r\n  </tr>\r\n  </thead>\r\n  <tbody>\r\n  ';
 for(var i= 0, l=visit.length; i < l; i++ ){;
__p += '\r\n  <tr>\r\n    <td>' +
((__t = (visit[i].time)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].gameShortCn)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].hostname)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].score)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].visitname)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (visit[i].spf)) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  ';
};
__p += '\r\n  </tbody>\r\n</table>';

}
return __p
}});