define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!--竞彩足球对阵模板-->\r\n<div data-match-id="' +
((__t = (matchId)) == null ? '' : __t) +
'" class="match">\r\n  <table width="100%" cellspacing="0" cellpadding="0" class="line50"\r\n         data-number="' +
((__t = (number)) == null ? '' : __t) +
'" data-live-id="' +
((__t = (gliveId)) == null ? '' : __t) +
'">\r\n    <colgroup>\r\n      <col width="">\r\n      <col width="10%">\r\n      <col width="40%">\r\n      <col width="40%">\r\n    </colgroup>\r\n    <tbody>\r\n    <tr>\r\n      <td colspan="2" class="more_odds_btn" rowspan="2">\r\n        ' +
((__t = (leagueMatch)) == null ? '' : __t) +
'\r\n        <br>' +
((__t = (number)) == null ? '' : __t) +
'<br>' +
((__t = (time)) == null ? '' : __t) +
' <br>\r\n      </td>\r\n      <td class="" colspan="3">\r\n        <b class="f16">' +
((__t = (playAgainst.split('|').join('</b>vs<b class="f16">'))) == null ? '' : __t) +
'</b>\r\n        <b class="fr">>&nbsp;&nbsp;</b>\r\n      </td>\r\n    </tr>\r\n    <tr class="spf_bet">\r\n      ';
var spfOdds = spDatas.footwall.split('|');;
__p += '\r\n      <td class="odds_spf">' +
((__t = (spfOdds[0].replace('_',' '))) == null ? '' : __t) +
'</td>\r\n      <td class="odds_spf">' +
((__t = (spfOdds[1].replace('_',' '))) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    </tbody>\r\n  </table>\r\n</div>';

}
return __p
}});