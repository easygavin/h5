define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(modes, function (m) { ;
__p += '\r\n';
 if (m.key == def) { ;
__p += '\r\n<a id="mode_' +
((__t = (m.key )) == null ? '' : __t) +
'" class="click">' +
((__t = (m.name )) == null ? '' : __t) +
'</a>\r\n';
 } else { ;
__p += '\r\n<a id="mode_' +
((__t = (m.key )) == null ? '' : __t) +
'">' +
((__t = (m.name )) == null ? '' : __t) +
'</a>\r\n';
 } ;
__p += '\r\n';
 }); ;


}
return __p
}});