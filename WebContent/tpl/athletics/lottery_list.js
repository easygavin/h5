define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="lotteryNum">\r\n  <p class="f16">' +
((__t = (data.matchArray[0].date)) == null ? '' : __t) +
' ' +
((__t = (data.matchArray.length)) == null ? '' : __t) +
'场比赛已开奖</p>\r\n</div>\r\n<table cellpadding="0" cellspacing="0" width="100%" class="line50">\r\n  <colgroup><col width="25%"><col width="25%"><col width="25%"><col width="25%"></colgroup>\r\n  <tbody>\r\n  ';

    var arr= data.matchArray,classArr=['rs_s','rs_p','rs_f','rs_u'],rsArr=['胜','平','负','未开售'];
    if(data.matchArray[0].result[0].sf){
      rsArr=['主胜','客胜'];
    }
    for(var i=0, l=arr.length; i < l; i++ ){
      var player=arr[i].playAgainst.split('|'), rs=arr[i].result[0].spf || arr[i].result[0].sf;
  ;
__p += '\r\n  <tr class="match" data-match-id="' +
((__t = (arr[i].matchId)) == null ? '' : __t) +
'">\r\n    <td class="first">\r\n      ' +
((__t = (arr[i].number)) == null ? '' : __t) +
'<br>\r\n      ' +
((__t = (arr[i].leagueMatch)) == null ? '' : __t) +
'<br>\r\n      ' +
((__t = (arr[i].time)) == null ? '' : __t) +
'\r\n    </td>\r\n    <td class="bnone"><b class="f16 c257ab3">' +
((__t = (player[0])) == null ? '' : __t) +
'</b></td>\r\n    <td class="bnone">\r\n      <div class="lqkj">\r\n        <div class="lqkjtitle ' +
((__t = (classArr[rsArr.indexOf(rs)] )) == null ? '' : __t) +
'">' +
((__t = (rs)) == null ? '' : __t) +
'</div>\r\n        <p>' +
((__t = (arr[i].goalscore)) == null ? '' : __t) +
'</p>\r\n      </div>\r\n    </td>\r\n    <td class="bnone"><b class="f16 c257ab3">' +
((__t = (player[1])) == null ? '' : __t) +
'</b></td>\r\n  </tr>\r\n  ';
};
__p += '\r\n  </tbody>\r\n</table>\r\n\r\n';

}
return __p
}});