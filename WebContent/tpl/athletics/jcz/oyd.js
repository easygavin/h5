define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<table class="line50" cellpadding="0" cellspacing="0" width="100%"\r\n       style="border-top:none;margin-top:0;">\r\n  <thead>\r\n  <tr>\r\n    <td>公司</td>\r\n    <td colspan="3">即时</td>\r\n    <td colspan="3">初盘</td>\r\n  </tr>\r\n  </thead>\r\n  <tbody>\r\n  ';
 for(var i= 0, l=data.length; i < l; i++ ){;
__p += '\r\n  <tr>\r\n    <td>' +
((__t = (data[i].company)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (data[i].oddsNow1)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (data[i].oddsNow2)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (data[i].oddsNow3)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (data[i].oddsFirst1)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (data[i].oddsFirst2)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (data[i].oddsFirst3)) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  ';
};
__p += '\r\n  </tbody>\r\n</table>';

}
return __p
}});