define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<table cellpadding="0" cellspacing="0" width="100%" class="line30">\r\n  <colgroup><col width="25%"><col width="25%"><col width="25%"><col width="25%"></colgroup>\r\n  <thead>\r\n  <tr>\r\n    <td class="tl head" colspan="4">\r\n      &nbsp;&nbsp;' +
((__t = (data.matchArray[0].date)) == null ? '' : __t) +
' ' +
((__t = (data.matchArray.length)) == null ? '' : __t) +
'场比赛已开奖\r\n    </td>\r\n  </tr>\r\n  </thead>\r\n  <tbody class="">\r\n  ';

    var arr= data.matchArray,classArr=['rs_s','rs_p','rs_f'],rsArr=['胜','平','负'];
    for(var i=0, l=arr.length; i < l; i++ ){
      var player=arr[i].playAgainst.split('|'), rs=arr[i].result[0].spf;
  ;
__p += '\r\n  <tr>\r\n    <td>' +
((__t = (arr[i].number)) == null ? '' : __t) +
'<br>' +
((__t = (arr[i].leagueMatch)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (player[0])) == null ? '' : __t) +
'<br>(' +
((__t = (arr[i].transfer)) == null ? '' : __t) +
')</td>\r\n    <td class="' +
((__t = (classArr[rsArr.indexOf(rs)] )) == null ? '' : __t) +
'">' +
((__t = (arr[i].goalscore)) == null ? '' : __t) +
'<br>' +
((__t = (rs)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (player[1])) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  ';
};
__p += '\r\n  </tbody>\r\n</table>';

}
return __p
}});