define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(items, function (i, index) { ;
__p += '\r\n  <tr>\r\n    <td>' +
((__t = (i.issueNo.substring(4) )) == null ? '' : __t) +
'</td>\r\n    <td><input type="number" class="shoutinp" value="' +
((__t = (i.muls )) == null ? '' : __t) +
'" maxlength="4" id="i_' +
((__t = (index )) == null ? '' : __t) +
'"></td>\r\n    <td>' +
((__t = (i.totalPay )) == null ? '' : __t) +
'</td>\r\n    <td class="cdd1049">\r\n      ' +
((__t = (i.minIncome )) == null ? '' : __t) +
'\r\n      ';
 if (i.maxIncome > 0) {;
__p += '\r\n        <br>~' +
((__t = (i.maxIncome )) == null ? '' : __t) +
'\r\n      ';
 } ;
__p += '\r\n    </td>\r\n    <td class="cdd1049">\r\n      ' +
((__t = (i.minRate.toFixed(2) )) == null ? '' : __t) +
'%\r\n      ';
 if (i.maxRate > 0) {;
__p += '\r\n      <br>~' +
((__t = (i.maxRate.toFixed(2) )) == null ? '' : __t) +
'%\r\n      ';
 } ;
__p += '\r\n    </td>\r\n  </tr>\r\n';
 });;


}
return __p
}});