define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<table cellpadding=\'0\' cellspacing=\'0\' width=\'100%\' class=\'line30\'>\r\n  <colgroup>\r\n    <col width="60%">\r\n    <col width="20%">\r\n    <col width="20%">\r\n  </colgroup>\r\n  <tbody>\r\n  ';
 _.each(issues, function (i) { ;
__p += '\r\n  <tr>\r\n    <td>' +
((__t = (i.issueNo )) == null ? '' : __t) +
'期,' +
((__t = (i.proBets )) == null ? '' : __t) +
'注,' +
((__t = (i.proMul )) == null ? '' : __t) +
'倍</td>\r\n    <td><span class="cdd1049">¥' +
((__t = (parseFloat(i.oneAmount).toFixed(1) )) == null ? '' : __t) +
'</span></td>\r\n    <td>' +
((__t = (i.status )) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  ';
 });;
__p += '\r\n  </tbody>\r\n</table>';

}
return __p
}});