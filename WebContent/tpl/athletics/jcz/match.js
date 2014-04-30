define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!--竞彩篮球对阵模板-->\r\n<div data-match-id="' +
((__t = (matchId)) == null ? '' : __t) +
'" class="match">\r\n  <table width="100%" cellspacing="0" cellpadding="0" class="line50" data-number="' +
((__t = (number)) == null ? '' : __t) +
'" data-live-id="' +
((__t = (gliveId)) == null ? '' : __t) +
'">\r\n    <colgroup>\r\n      <col width="">\r\n      <col width="10%">\r\n      <col width="23%">\r\n      <col width="23%">\r\n      <col width="23%">\r\n    </colgroup>\r\n    <tbody>\r\n    <tr>\r\n      <td class="more_odds_btn" rowspan="3">\r\n        <span class="leagueT">' +
((__t = (leagueMatch)) == null ? '' : __t) +
'</span><br>\r\n        ' +
((__t = (number)) == null ? '' : __t) +
'<br>' +
((__t = (time)) == null ? '' : __t) +
' <br>\r\n        <i class="fm arr"></i>\r\n      </td>\r\n      <td class="c257ab3" colspan="3">\r\n        <b class="f16">' +
((__t = (playAgainst.split('|').join('vs'))) == null ? '' : __t) +
'</b>\r\n      </td>\r\n      <td class="analyse">析</td>\r\n    </tr>\r\n    <tr class="spf_bet">\r\n      ';

        var spfOdds = spDatas.spf.split(',');
        if((spfOdds[0] + spfOdds[1] + spfOdds[2]).indexOf('null')!=-1){
      ;
__p += '\r\n        <td colspan="4">该玩法未开售</td>\r\n      ';
}else{;
__p += '\r\n        <td>0</td>\r\n        <td class="odds_spf" data-result="spf_0">胜' +
((__t = (spfOdds[0])) == null ? '' : __t) +
'</td>\r\n        <td class="odds_spf" data-result="spf_1">平' +
((__t = (spfOdds[1])) == null ? '' : __t) +
'</td>\r\n        <td class="odds_spf" data-result="spf_2">负' +
((__t = (spfOdds[2])) == null ? '' : __t) +
'</td>\r\n      ';
};
__p += '\r\n    </tr>\r\n    <tr class="rqspf_bet">\r\n      ';

        var rqspfOdds = spDatas.rqspf.split(',');
        if((rqspfOdds[1] + rqspfOdds[1] + rqspfOdds[2] + rqspfOdds[3]).indexOf('null')!=-1){
      ;
__p += '\r\n        <td colspan="4">该玩法未开售</td>\r\n      ';
}else{;
__p += '\r\n        <td>' +
((__t = (rqspfOdds[0] )) == null ? '' : __t) +
'</td>\r\n        <td class="odds_rqspf" data-result="rqspf_1">胜' +
((__t = (rqspfOdds[1])) == null ? '' : __t) +
'</td>\r\n        <td class="odds_rqspf" data-result="rqspf_2">平' +
((__t = (rqspfOdds[2])) == null ? '' : __t) +
'</td>\r\n        <td class="odds_rqspf" data-result="rqspf_3">负' +
((__t = (rqspfOdds[3])) == null ? '' : __t) +
'</td>\r\n      ';
};
__p += '\r\n    </tr>\r\n    </tbody>\r\n  </table>\r\n</div>';

}
return __p
}});