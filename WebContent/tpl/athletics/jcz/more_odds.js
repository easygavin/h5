define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="showhide more_odds" data-match-id="' +
((__t = (matchId)) == null ? '' : __t) +
'">\r\n  <table cellpadding="0" cellspacing="0" width="100%" class="zjq_bet">\r\n    <colgroup>\r\n      <col width="25%"/>\r\n      <col width="25%"/>\r\n      <col width="25%"/>\r\n      <col width="25%"/>\r\n    </colgroup>\r\n    <thead>\r\n    <tr>\r\n      <td colspan="4"><b>总进球</b></td>\r\n    </tr>\r\n    </thead>\r\n    <tbody>\r\n    <tr>\r\n      ';
 var zjqOdds = spDatas.zjq.split(',');;
__p += '\r\n      <td class="odds_zjq" data-result="zjq_0">0球<br/>' +
((__t = (zjqOdds[0])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_zjq" data-result="zjq_1">1球<br/>' +
((__t = (zjqOdds[1])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_zjq" data-result="zjq_2">2球<br/>' +
((__t = (zjqOdds[2])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_zjq" data-result="zjq_3">3球<br/>' +
((__t = (zjqOdds[3])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    <tr>\r\n      <td class="odds_zjq" data-result="zjq_4">4球<br/>' +
((__t = (zjqOdds[4])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_zjq" data-result="zjq_5">5球<br/>' +
((__t = (zjqOdds[5])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_zjq" data-result="zjq_6">6球<br/>' +
((__t = (zjqOdds[6])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_zjq" data-result="zjq_7">7+<br/>' +
((__t = (zjqOdds[7])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    </tbody>\r\n  </table>\r\n  <table cellpadding="0" cellspacing="0" width="100%" class="bqc_bet">\r\n    <colgroup>\r\n      <col width="33.33333%" />\r\n      <col width="33.33333%" />\r\n    </colgroup>\r\n    <thead>\r\n    <tr>\r\n      <td colspan="4"><b>半全场胜平负</b></td>\r\n    </tr>\r\n    </thead>\r\n    <tbody>\r\n    <tr>\r\n      ';
 var bqcOdds = spDatas.bqc.split(',');;
__p += '\r\n      <td class="odds_bqc" data-result="bqc_0">胜胜<br />' +
((__t = (bqcOdds[0])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bqc" data-result="bqc_1">胜平<br />' +
((__t = (bqcOdds[1])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bqc" data-result="bqc_2">胜负<br />' +
((__t = (bqcOdds[2])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    <tr>\r\n      <td class="odds_bqc" data-result="bqc_3">平胜<br />' +
((__t = (bqcOdds[3])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bqc" data-result="bqc_4">平平<br />' +
((__t = (bqcOdds[4])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bqc" data-result="bqc_5">平负<br />' +
((__t = (bqcOdds[5])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    <tr>\r\n      <td class="odds_bqc" data-result="bqc_6">负胜<br />' +
((__t = (bqcOdds[6])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bqc" data-result="bqc_7">负平<br />' +
((__t = (bqcOdds[7])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bqc" data-result="bqc_8">负负<br />' +
((__t = (bqcOdds[8])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    </tbody>\r\n  </table>\r\n  <table width="100%" cellpadding="0" cellspacing="0" class="bf_bet">\r\n    <colgroup>\r\n      <col width="14.28%">\r\n      <col width="14.28%">\r\n      <col width="14.28%">\r\n      <col width="14.28%">\r\n      <col width="14.28%">\r\n      <col width="14.28%">\r\n    </colgroup>\r\n    <thead>\r\n    <tr>\r\n      <td colspan="7"><b>比分</b></td>\r\n    </tr>\r\n    </thead>\r\n    <tbody>\r\n    <tr>\r\n      ';
var bfOdds=spDatas.bf.split(','); ;
__p += '\r\n      <td class="odds_bf" data-result="bf_0"> 1:0 <br>' +
((__t = (bfOdds[0])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_1"> 2:0 <br>' +
((__t = (bfOdds[1])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_2"> 2:1 <br>' +
((__t = (bfOdds[2])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_3"> 3:0 <br>' +
((__t = (bfOdds[3])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_4"> 3:1 <br>' +
((__t = (bfOdds[4])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_5"> 3:2 <br>' +
((__t = (bfOdds[5])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_6"> 4:0 <br>' +
((__t = (bfOdds[6])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    <tr>\r\n      <td class="odds_bf" data-result="bf_7"> 4:1 <br>' +
((__t = (bfOdds[7])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_8"> 4:2 <br>' +
((__t = (bfOdds[8])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_9"> 5:0 <br>' +
((__t = (bfOdds[9])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_10"> 5:1 <br>' +
((__t = (bfOdds[10])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_11"> 5:2 <br>' +
((__t = (bfOdds[11])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_12" colspan="2">胜其他<br>' +
((__t = (bfOdds[12])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    <tr>\r\n      <td class="odds_bf" data-result="bf_13"> 0:0 <br>' +
((__t = (bfOdds[13])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_14"> 1:1 <br>' +
((__t = (bfOdds[14])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_15"> 2:2 <br>' +
((__t = (bfOdds[15])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_16"> 3:3 <br>' +
((__t = (bfOdds[16])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_17" colspan="3">平其他<br>' +
((__t = (bfOdds[17])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    <tr>\r\n      <td class="odds_bf" data-result="bf_18"> 0:1 <br>' +
((__t = (bfOdds[18])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_19"> 0:2 <br>' +
((__t = (bfOdds[19])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_20"> 1:2 <br>' +
((__t = (bfOdds[20])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_21"> 0:3 <br>' +
((__t = (bfOdds[21])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_22"> 1:3 <br>' +
((__t = (bfOdds[22])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_23"> 2:3 <br>' +
((__t = (bfOdds[23])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_24"> 0:4 <br>' +
((__t = (bfOdds[24])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    <tr>\r\n      <td class="odds_bf" data-result="bf_25"> 1:4 <br>' +
((__t = (bfOdds[25])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_26"> 2:4 <br>' +
((__t = (bfOdds[26])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_27"> 0:5 <br>' +
((__t = (bfOdds[27])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_28"> 1:5 <br>' +
((__t = (bfOdds[28])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_29"> 2:5 <br>' +
((__t = (bfOdds[29])) == null ? '' : __t) +
'</td>\r\n      <td class="odds_bf" data-result="bf_30" colspan="2">负其他<br>' +
((__t = (bfOdds[30])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    </tbody>\r\n  </table>\r\n</div>';

}
return __p
}});