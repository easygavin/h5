<div class="showhide more_odds" data-match-id="<%=matchId%>">
  <table cellpadding="0" cellspacing="0" width="100%" class="zjq_bet">
    <colgroup>
      <col width="25%"/>
      <col width="25%"/>
      <col width="25%"/>
      <col width="25%"/>
    </colgroup>
    <thead>
    <tr>
      <td colspan="4"><b>总进球</b></td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <% var zjqOdds = spDatas.zjq.split(',');%>
      <td class="odds_zjq" id="zjq_0">0球<br/><%=zjqOdds[0]%></td>
      <td class="odds_zjq" id="zjq_1">1球<br/><%=zjqOdds[1]%></td>
      <td class="odds_zjq" id="zjq_2">2球<br/><%=zjqOdds[2]%></td>
      <td class="odds_zjq" id="zjq_3">3球<br/><%=zjqOdds[3]%></td>
    </tr>
    <tr>
      <td class="odds_zjq" id="zjq_4">4球<br/><%=zjqOdds[4]%></td>
      <td class="odds_zjq" id="zjq_5">5球<br/><%=zjqOdds[5]%></td>
      <td class="odds_zjq" id="zjq_6">6球<br/><%=zjqOdds[6]%></td>
      <td class="odds_zjq" id="zjq_7">7+<br/><%=zjqOdds[7]%></td>
    </tr>
    </tbody>
  </table>
  <table cellpadding="0" cellspacing="0" width="100%" class="bqc_bet">
    <colgroup>
      <col width="33.33333%" />
      <col width="33.33333%" />
    </colgroup>
    <thead>
    <tr>
      <td colspan="4"><b>半全场胜平负</b></td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <% var bqcOdds = spDatas.bqc.split(',');%>
      <td class="odds_bqc" id="bqc_0">胜胜<br /><%=bqcOdds[0]%></td>
      <td class="odds_bqc" id="bqc_1">胜平<br /><%=bqcOdds[1]%></td>
      <td class="odds_bqc" id="bqc_2">胜负<br /><%=bqcOdds[2]%></td>
    </tr>
    <tr>
      <td class="odds_bqc" id="bqc_3">平胜<br /><%=bqcOdds[3]%></td>
      <td class="odds_bqc" id="bqc_4">平平<br /><%=bqcOdds[4]%></td>
      <td class="odds_bqc" id="bqc_5">平负<br /><%=bqcOdds[5]%></td>
    </tr>
    <tr>
      <td class="odds_bqc" id="bqc_6">负胜<br /><%=bqcOdds[6]%></td>
      <td class="odds_bqc" id="bqc_7">负平<br /><%=bqcOdds[7]%></td>
      <td class="odds_bqc" id="bqc_8">负负<br /><%=bqcOdds[8]%></td>
    </tr>
    </tbody>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" class="bf_bet">
    <colgroup>
      <col width="14.28%">
      <col width="14.28%">
      <col width="14.28%">
      <col width="14.28%">
      <col width="14.28%">
      <col width="14.28%">
    </colgroup>
    <thead>
    <tr>
      <td colspan="7"><b>比分</b></td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <%var bfOdds=spDatas.bf.split(','); %>
      <td class="odds_bf" id="bf_0"> 1:0 <br><%=bfOdds[0]%></td>
      <td class="odds_bf" id="bf_1"> 2:0 <br><%=bfOdds[1]%></td>
      <td class="odds_bf" id="bf_2"> 2:1 <br><%=bfOdds[2]%></td>
      <td class="odds_bf" id="bf_3"> 3:0 <br><%=bfOdds[3]%></td>
      <td class="odds_bf" id="bf_4"> 3:1 <br><%=bfOdds[4]%></td>
      <td class="odds_bf" id="bf_5"> 3:2 <br><%=bfOdds[5]%></td>
      <td class="odds_bf" id="bf_6"> 4:0 <br><%=bfOdds[6]%></td>
    </tr>
    <tr>
      <td class="odds_bf" id="bf_7"> 4:1 <br><%=bfOdds[7]%></td>
      <td class="odds_bf" id="bf_8"> 4:2 <br><%=bfOdds[8]%></td>
      <td class="odds_bf" id="bf_9"> 5:0 <br><%=bfOdds[9]%></td>
      <td class="odds_bf" id="bf_10"> 5:1 <br><%=bfOdds[10]%></td>
      <td class="odds_bf" id="bf_11"> 5:2 <br><%=bfOdds[11]%></td>
      <td class="odds_bf" id="bf_12" colspan="2">胜其他<br><%=bfOdds[12]%></td>
    </tr>
    <tr>
      <td class="odds_bf" id="bf_13"> 0:0 <br><%=bfOdds[13]%></td>
      <td class="odds_bf" id="bf_14"> 1:1 <br><%=bfOdds[14]%></td>
      <td class="odds_bf" id="bf_15"> 2:2 <br><%=bfOdds[15]%></td>
      <td class="odds_bf" id="bf_16"> 3:3 <br><%=bfOdds[16]%></td>
      <td class="odds_bf" id="bf_17" colspan="3">平其他<br><%=bfOdds[17]%></td>
    </tr>
    <tr>
      <td class="odds_bf" id="bf_18"> 0:1 <br><%=bfOdds[18]%></td>
      <td class="odds_bf" id="bf_19"> 0:2 <br><%=bfOdds[19]%></td>
      <td class="odds_bf" id="bf_20"> 1:2 <br><%=bfOdds[20]%></td>
      <td class="odds_bf" id="bf_21"> 0:3 <br><%=bfOdds[21]%></td>
      <td class="odds_bf" id="bf_22"> 1:3 <br><%=bfOdds[22]%></td>
      <td class="odds_bf" id="bf_23"> 2:3 <br><%=bfOdds[23]%></td>
      <td class="odds_bf" id="bf_24"> 0:4 <br><%=bfOdds[24]%></td>
    </tr>
    <tr>
      <td class="odds_bf" id="bf_25"> 1:4 <br><%=bfOdds[25]%></td>
      <td class="odds_bf" id="bf_26"> 2:4 <br><%=bfOdds[26]%></td>
      <td class="odds_bf" id="bf_27"> 0:5 <br><%=bfOdds[27]%></td>
      <td class="odds_bf" id="bf_28"> 1:5 <br><%=bfOdds[28]%></td>
      <td class="odds_bf" id="bf_29"> 2:5 <br><%=bfOdds[29]%></td>
      <td class="odds_bf" id="bf_30" colspan="2">负其他<br><%=bfOdds[30]%></td>
    </tr>
    </tbody>
  </table>
</div>