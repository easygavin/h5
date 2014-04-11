define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!--竞彩篮球混合投注模板-->\r\n<div class="showhide more_odds" data-match-id="' +
((__t = (matchId)) == null ? '' : __t) +
'">\r\n  <table class="lBTable" cellpadding="0" cellspacing="0" width="100%">\r\n    ';
 var dxfOdds = spDatas.dxf.split(','); ;
__p += '\r\n    <colgroup>\r\n      <col width="50%"/>\r\n      <col width="50%"/>\r\n    </colgroup>\r\n    <thead>\r\n    <tr>\r\n      <td colspan="4" class="tab"><b>大小分(' +
((__t = (dxfOdds[0])) == null ? '' : __t) +
')</b></td>\r\n    </tr>\r\n    </thead>\r\n    <tbody>\r\n    <tr>\r\n      <td id="dxf_1-' +
((__t = (matchId)) == null ? '' : __t) +
'">大<br/>' +
((__t = (dxfOdds[1])) == null ? '' : __t) +
'</td>\r\n      <td id="dxf_2-' +
((__t = (matchId)) == null ? '' : __t) +
'">小<br/>' +
((__t = (dxfOdds[2])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    </tbody>\r\n  </table>\r\n  <table class="lRTable" cellpadding="0" cellspacing="0" width="100%">\r\n    ';
 var sfcOdds = spDatas.sfc.split(','); ;
__p += '\r\n    <colgroup>\r\n      <col width="25%"/>\r\n      <col width="25%"/>\r\n      <col width="25%"/>\r\n    </colgroup>\r\n    <thead>\r\n    <tr>\r\n      <td colspan="4" class="tab"><b>胜分差</b></td>\r\n    </tr>\r\n    </thead>\r\n    <tbody>\r\n    <tr>\r\n      <td rowspan="2" class="tab">主胜</td>\r\n      <td id="sfc_0-' +
((__t = (matchId)) == null ? '' : __t) +
'">1-5<br/>' +
((__t = (sfcOdds[0])) == null ? '' : __t) +
'</td>\r\n      <td id="sfc_1-' +
((__t = (matchId)) == null ? '' : __t) +
'">6-10<br/>' +
((__t = (sfcOdds[1])) == null ? '' : __t) +
'</td>\r\n      <td id="sfc_2-' +
((__t = (matchId)) == null ? '' : __t) +
'">11-15<br/>' +
((__t = (sfcOdds[2])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    <tr>\r\n      <td id="sfc_3-' +
((__t = (matchId)) == null ? '' : __t) +
'">16-20<br/>' +
((__t = (sfcOdds[3])) == null ? '' : __t) +
'</td>\r\n      <td id="sfc_4-' +
((__t = (matchId)) == null ? '' : __t) +
'">21-25<br/>' +
((__t = (sfcOdds[4])) == null ? '' : __t) +
'</td>\r\n      <td id="sfc_5-' +
((__t = (matchId)) == null ? '' : __t) +
'">26+<br/>' +
((__t = (sfcOdds[5])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    <tr>\r\n      <td rowspan="2" class="tab">客胜</td>\r\n      <td id="sfc_6-' +
((__t = (matchId)) == null ? '' : __t) +
'">1-5<br/>' +
((__t = (sfcOdds[6])) == null ? '' : __t) +
'</td>\r\n      <td id="sfc_7-' +
((__t = (matchId)) == null ? '' : __t) +
'">6-10<br/>' +
((__t = (sfcOdds[7])) == null ? '' : __t) +
'</td>\r\n      <td id="sfc_8-' +
((__t = (matchId)) == null ? '' : __t) +
'">11-15<br/>' +
((__t = (sfcOdds[8])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    <tr>\r\n      <td id="sfc_9-' +
((__t = (matchId)) == null ? '' : __t) +
'">16-20<br/>' +
((__t = (sfcOdds[9])) == null ? '' : __t) +
'</td>\r\n      <td id="sfc_10-' +
((__t = (matchId)) == null ? '' : __t) +
'">21-25<br/>' +
((__t = (sfcOdds[10])) == null ? '' : __t) +
'</td>\r\n      <td id="sfc_11-' +
((__t = (matchId)) == null ? '' : __t) +
'">26+<br/>' +
((__t = (sfcOdds[11])) == null ? '' : __t) +
'</td>\r\n    </tr>\r\n    </tbody>\r\n  </table>\r\n</div>';

}
return __p
}});