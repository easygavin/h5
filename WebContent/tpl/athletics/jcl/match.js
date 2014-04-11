define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!--竞彩篮球对阵模板-->\r\n<div id="' +
((__t = (matchId)) == null ? '' : __t) +
'" data-match-id="' +
((__t = (matchId)) == null ? '' : __t) +
'" class="betContain">\r\n  <table cellpadding="0" cellspacing="0" width="100%" class="line50" data-number="' +
((__t = (number)) == null ? '' : __t) +
'">\r\n    <colgroup>\r\n      <col width=""/>\r\n      <col width="10%"/>\r\n      <col width="30%"/>\r\n      <col width="30%"/>\r\n    </colgroup>\r\n    <tr>\r\n      <td rowspan="3" class="first bordernone">\r\n        <span class="leagueT">' +
((__t = (leagueMatch)) == null ? '' : __t) +
'</span>\r\n        <br>' +
((__t = (number)) == null ? '' : __t) +
'<br>' +
((__t = (time)) == null ? '' : __t) +
' <br>\r\n        <i class="fm arr"></i>\r\n      </td>\r\n      <td colspan="3" class="c257ab3">\r\n        <b class="f16">' +
((__t = (playAgainst.split('|').join('</b>vs<b class="f16">'))) == null ? '' : __t) +
'</b>\r\n      </td>\r\n    </tr>\r\n    <tr class="footballTz">\r\n      ';
 var sfOdds = spDatas.sf.split(','); ;
__p += '\r\n      <td class="tab">0</td>\r\n      <td id="sf_0-' +
((__t = (matchId)) == null ? '' : __t) +
'">' +
((__t = (sfOdds[0]||'--')) == null ? '' : __t) +
'</td>\r\n      <td id="sf_1-' +
((__t = (matchId)) == null ? '' : __t) +
'">' +
((__t = (sfOdds[1]||'--')) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    <tr class="lYTable">\r\n      ';
 var rfsfOdds = spDatas.rfsf.split(','); ;
__p += '\r\n      <td class="tab">' +
((__t = (rfsfOdds[0]||'--')) == null ? '' : __t) +
'</td>\r\n      <td id="rfsf_1-' +
((__t = (matchId)) == null ? '' : __t) +
'">' +
((__t = (rfsfOdds[1]||'--')) == null ? '' : __t) +
'</td>\r\n      <td id="rfsf_2-' +
((__t = (matchId)) == null ? '' : __t) +
'">' +
((__t = (rfsfOdds[2]||'--')) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n  </table>\r\n</div>';

}
return __p
}});