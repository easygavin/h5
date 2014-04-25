define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!--竞彩足球[上下盘]模板-->\r\n<div data-match-id="' +
((__t = (matchId)) == null ? '' : __t) +
'" class="match">\r\n  <table width="100%" cellspacing="0" cellpadding="0" class="line50" data-number="' +
((__t = (number)) == null ? '' : __t) +
'"\r\n         data-live-id="' +
((__t = (gliveId)) == null ? '' : __t) +
'">\r\n    <colgroup>\r\n      <col width="24%">\r\n      <col width="12%">\r\n      <col width="26%">\r\n      <col width="26%">\r\n      <col width="12%">\r\n    </colgroup>\r\n    <tbody>\r\n    <tr>\r\n      <td rowspan="2">\r\n        <span class="leagueT">' +
((__t = (leagueMatch)) == null ? '' : __t) +
'</span>\r\n        <br>' +
((__t = (number)) == null ? '' : __t) +
'<br>' +
((__t = (time)) == null ? '' : __t) +
' <br>\r\n      </td>\r\n      <td colspan="3">\r\n        <b class="f16 c257ab3">' +
((__t = (playAgainst.split('|').join('vs'))) == null ? '' : __t) +
'</b>\r\n      </td>\r\n      <td class="analyse">析</td>\r\n    </tr>\r\n    <tr class="uad_bet">\r\n      ';
var uadOdds = spDatas.footwall.split('|');;
__p += '\r\n      <td colspan="2" class="odds_aud" data-result="uad_0" data-text="' +
((__t = (uadOdds[0])) == null ? '' : __t) +
'">' +
((__t = (uadOdds[0].replace('_',' '))) == null ? '' : __t) +
'</td>\r\n      <td colspan="2" class="odds_aud" data-result="uad_1" data-text="' +
((__t = (uadOdds[1])) == null ? '' : __t) +
'">' +
((__t = (uadOdds[1].replace('_',' '))) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    </tbody>\r\n  </table>\r\n</div>\r\n\r\n\r\n';

}
return __p
}});