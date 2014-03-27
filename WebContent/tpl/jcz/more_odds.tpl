<div class="showhide more_odds" data-match-id="<%=matchId%>">
  <table cellpadding="0" cellspacing="0" width="100%" class="zjq_bet">
    <colgroup>
      <col width="25%" />
      <col width="25%" />
      <col width="25%" />
      <col width="25%" />
    </colgroup>
    <thead>
    <tr>
      <td colspan="4"><b>总进球</b></td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <% var zjqOdds = spDatas.zjq.split(',');%>
      <td class="odds_zjq">0球<br /><%=zjqOdds[0]%></td>
      <td class="odds_zjq">1球<br /><%=zjqOdds[1]%></td>
      <td class="odds_zjq">2球<br /><%=zjqOdds[2]%></td>
      <td class="odds_zjq">3球<br /><%=zjqOdds[3]%></td>
    </tr>
    <tr>
      <td class="odds_zjq">4球<br /><%=zjqOdds[4]%></td>
      <td class="odds_zjq">5球<br /><%=zjqOdds[5]%></td>
      <td class="odds_zjq">6球<br /><%=zjqOdds[6]%></td>
      <td class="odds_zjq">7+<br /><%=zjqOdds[7]%></td>
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
      <td class="odds_bqc">胜胜<br /><%=bqcOdds[0]%></td>
      <td class="odds_bqc">胜平<br /><%=bqcOdds[1]%></td>
      <td class="odds_bqc">胜负<br /><%=bqcOdds[2]%></td>
    </tr>
    <tr>
      <td class="odds_bqc">平胜<br /><%=bqcOdds[3]%></td>
      <td class="odds_bqc">平平<br /><%=bqcOdds[4]%></td>
      <td class="odds_bqc">平负<br /><%=bqcOdds[5]%></td>
    </tr>
    <tr>
      <td class="odds_bqc">负胜<br /><%=bqcOdds[6]%></td>
      <td class="odds_bqc">负平<br /><%=bqcOdds[7]%></td>
      <td class="odds_bqc">负负<br /><%=bqcOdds[8]%></td>
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
      <td class="odds_bf"> 1:0 <br><%=bfOdds[0]%></td>
      <td class="odds_bf"> 2:0 <br><%=bfOdds[1]%></td>
      <td class="odds_bf"> 2:1 <br><%=bfOdds[2]%></td>
      <td class="odds_bf"> 3:0 <br><%=bfOdds[3]%></td>
      <td class="odds_bf"> 3:1 <br><%=bfOdds[4]%></td>
      <td class="odds_bf"> 3:2 <br><%=bfOdds[5]%></td>
      <td class="odds_bf"> 4:0 <br><%=bfOdds[6]%></td>
    </tr>
    <tr>
      <td class="odds_bf"> 4:1 <br><%=bfOdds[7]%></td>
      <td class="odds_bf"> 4:2 <br><%=bfOdds[8]%></td>
      <td class="odds_bf"> 5:0 <br><%=bfOdds[9]%></td>
      <td class="odds_bf"> 5:1 <br><%=bfOdds[10]%></td>
      <td class="odds_bf"> 5:2 <br><%=bfOdds[11]%></td>
      <td class="odds_bf" colspan="2">胜其他<br><%=bfOdds[12]%></td>
    </tr>
    <tr>
      <td class="odds_bf"> 0:0 <br><%=bfOdds[13]%></td>
      <td class="odds_bf"> 1:1 <br><%=bfOdds[14]%></td>
      <td class="odds_bf"> 2:2 <br><%=bfOdds[15]%></td>
      <td class="odds_bf"> 3:3 <br><%=bfOdds[16]%></td>
      <td class="odds_bf" colspan="3">平其他<br><%=bfOdds[17]%></td>
    </tr>
    <tr>
      <td class="odds_bf"> 0:1 <br><%=bfOdds[18]%></td>
      <td class="odds_bf"> 0:2 <br><%=bfOdds[19]%></td>
      <td class="odds_bf"> 1:2 <br><%=bfOdds[20]%></td>
      <td class="odds_bf"> 0:3 <br><%=bfOdds[21]%></td>
      <td class="odds_bf"> 1:3 <br><%=bfOdds[22]%></td>
      <td class="odds_bf"> 2:3 <br><%=bfOdds[23]%></td>
      <td class="odds_bf"> 0:4 <br><%=bfOdds[24]%></td>
    </tr>
    <tr>
      <td class="odds_bf"> 1:4 <br><%=bfOdds[25]%></td>
      <td class="odds_bf"> 2:4 <br><%=bfOdds[26]%></td>
      <td class="odds_bf"> 0:5 <br><%=bfOdds[27]%></td>
      <td class="odds_bf"> 1:5 <br><%=bfOdds[28]%></td>
      <td class="odds_bf"> 2:5 <br><%=bfOdds[29]%></td>
      <td class="odds_bf" colspan="2">负其他<br><%=bfOdds[30]%></td>
    </tr>
    </tbody>
  </table>
</div>