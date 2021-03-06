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
    <%
      var zjqOdds = spDatas.zjq.split(',');
      if((zjqOdds[0]+zjqOdds[1]+zjqOdds[2]+zjqOdds[3]+zjqOdds[4]+zjqOdds[5]+zjqOdds[6]+zjqOdds[7]).indexOf('null')!=-1){
    %>
      <tr>
        <td colspan="4">该玩法未开售</td>
      </tr>
    <%}else{%>
      <tr>
        <td class="odds_zjq" data-result="zjq_0">0球<br/><%=zjqOdds[0]%></td>
        <td class="odds_zjq" data-result="zjq_1">1球<br/><%=zjqOdds[1]%></td>
        <td class="odds_zjq" data-result="zjq_2">2球<br/><%=zjqOdds[2]%></td>
        <td class="odds_zjq" data-result="zjq_3">3球<br/><%=zjqOdds[3]%></td>
      </tr>
      <tr>
        <td class="odds_zjq" data-result="zjq_4">4球<br/><%=zjqOdds[4]%></td>
        <td class="odds_zjq" data-result="zjq_5">5球<br/><%=zjqOdds[5]%></td>
        <td class="odds_zjq" data-result="zjq_6">6球<br/><%=zjqOdds[6]%></td>
        <td class="odds_zjq" data-result="zjq_7">7+<br/><%=zjqOdds[7]%></td>
      </tr>
    <%}%>
    </tbody>
  </table>
  <table cellpadding="0" cellspacing="0" width="100%" class="bqc_bet">
    <colgroup>
      <col width="33.33333%" />
      <col width="33.33333%" />
      <col width="33.33333%" />
    </colgroup>
    <thead>
    <tr>
      <td colspan="4"><b>半全场胜平负</b></td>
    </tr>
    </thead>
    <tbody>
    <%
      var bqcOdds = spDatas.bqc.split(',');
      if((bqcOdds[0]+bqcOdds[1]+bqcOdds[2]+bqcOdds[3]+bqcOdds[4]+bqcOdds[5]+bqcOdds[6]+bqcOdds[7]+bqcOdds[8]).indexOf('null')!=-1){
    %>
      <tr>
        <td colspan="4">该玩法未开售</td>
      </tr>
    <%}else{%>
      <tr>
        <td class="odds_bqc" data-result="bqc_0">胜胜<br /><%=bqcOdds[0]%></td>
        <td class="odds_bqc" data-result="bqc_1">胜平<br /><%=bqcOdds[1]%></td>
        <td class="odds_bqc" data-result="bqc_2">胜负<br /><%=bqcOdds[2]%></td>
      </tr>
      <tr>
        <td class="odds_bqc" data-result="bqc_3">平胜<br /><%=bqcOdds[3]%></td>
        <td class="odds_bqc" data-result="bqc_4">平平<br /><%=bqcOdds[4]%></td>
        <td class="odds_bqc" data-result="bqc_5">平负<br /><%=bqcOdds[5]%></td>
      </tr>
      <tr>
        <td class="odds_bqc" data-result="bqc_6">负胜<br /><%=bqcOdds[6]%></td>
        <td class="odds_bqc" data-result="bqc_7">负平<br /><%=bqcOdds[7]%></td>
        <td class="odds_bqc" data-result="bqc_8">负负<br /><%=bqcOdds[8]%></td>
      </tr>
    <%}%>
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
    <%
      var bfOdds=spDatas.bf.split(',');
      var rs = '';
      for(var i=0,l=bfOdds.length; i< l; i++){
        rs += bfOdds[i];
      }
      if(rs.indexOf('null')==-1){
    %>
      <tr>
        <td class="odds_bf" data-result="bf_0"> 1:0 <br><%=bfOdds[0]%></td>
        <td class="odds_bf" data-result="bf_1"> 2:0 <br><%=bfOdds[1]%></td>
        <td class="odds_bf" data-result="bf_2"> 2:1 <br><%=bfOdds[2]%></td>
        <td class="odds_bf" data-result="bf_3"> 3:0 <br><%=bfOdds[3]%></td>
        <td class="odds_bf" data-result="bf_4"> 3:1 <br><%=bfOdds[4]%></td>
        <td class="odds_bf" data-result="bf_5"> 3:2 <br><%=bfOdds[5]%></td>
        <td class="odds_bf" data-result="bf_6"> 4:0 <br><%=bfOdds[6]%></td>
      </tr>
      <tr>
        <td class="odds_bf" data-result="bf_7"> 4:1 <br><%=bfOdds[7]%></td>
        <td class="odds_bf" data-result="bf_8"> 4:2 <br><%=bfOdds[8]%></td>
        <td class="odds_bf" data-result="bf_9"> 5:0 <br><%=bfOdds[9]%></td>
        <td class="odds_bf" data-result="bf_10"> 5:1 <br><%=bfOdds[10]%></td>
        <td class="odds_bf" data-result="bf_11"> 5:2 <br><%=bfOdds[11]%></td>
        <td class="odds_bf" data-result="bf_12" colspan="2">胜其他<br><%=bfOdds[12]%></td>
      </tr>
      <tr>
        <td class="odds_bf" data-result="bf_13"> 0:0 <br><%=bfOdds[13]%></td>
        <td class="odds_bf" data-result="bf_14"> 1:1 <br><%=bfOdds[14]%></td>
        <td class="odds_bf" data-result="bf_15"> 2:2 <br><%=bfOdds[15]%></td>
        <td class="odds_bf" data-result="bf_16"> 3:3 <br><%=bfOdds[16]%></td>
        <td class="odds_bf" data-result="bf_17" colspan="3">平其他<br><%=bfOdds[17]%></td>
      </tr>
      <tr>
        <td class="odds_bf" data-result="bf_18"> 0:1 <br><%=bfOdds[18]%></td>
        <td class="odds_bf" data-result="bf_19"> 0:2 <br><%=bfOdds[19]%></td>
        <td class="odds_bf" data-result="bf_20"> 1:2 <br><%=bfOdds[20]%></td>
        <td class="odds_bf" data-result="bf_21"> 0:3 <br><%=bfOdds[21]%></td>
        <td class="odds_bf" data-result="bf_22"> 1:3 <br><%=bfOdds[22]%></td>
        <td class="odds_bf" data-result="bf_23"> 2:3 <br><%=bfOdds[23]%></td>
        <td class="odds_bf" data-result="bf_24"> 0:4 <br><%=bfOdds[24]%></td>
      </tr>
      <tr>
        <td class="odds_bf" data-result="bf_25"> 1:4 <br><%=bfOdds[25]%></td>
        <td class="odds_bf" data-result="bf_26"> 2:4 <br><%=bfOdds[26]%></td>
        <td class="odds_bf" data-result="bf_27"> 0:5 <br><%=bfOdds[27]%></td>
        <td class="odds_bf" data-result="bf_28"> 1:5 <br><%=bfOdds[28]%></td>
        <td class="odds_bf" data-result="bf_29"> 2:5 <br><%=bfOdds[29]%></td>
        <td class="odds_bf" data-result="bf_30" colspan="2">负其他<br><%=bfOdds[30]%></td>
      </tr>
    <%}else{%>
      <tr>
        <td colspan="6">该玩法未开售</td>
      </tr>
    <%}%>
    </tbody>
  </table>
</div>