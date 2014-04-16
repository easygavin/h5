<!--竞彩篮球对阵模板-->
<div data-match-id="<%=matchId%>" class="match">
  <table width="100%" cellspacing="0" cellpadding="0" class="line50" data-number="<%=number%>" data-live-id="<%=gliveId%>">
    <colgroup>
      <col width="">
      <col width="10%">
      <col width="23%">
      <col width="23%">
      <col width="23%">
    </colgroup>
    <tbody>
    <tr>
      <td class="more_odds_btn" rowspan="3">
        <span class="leagueT"><%=leagueMatch%></span>
        <br><%=number%><br><%=time%> <br>
        <i class="fm arr"></i>
      </td>
      <td class="c257ab3" colspan="3">
        <b class="f16"><%=playAgainst.split('|').join('</b>vs<b class="f16">')%></b>
      </td>
      <td class="analyse">析</td>
    </tr>
    <tr class="spf_bet">
      <% var spfOdds = spDatas.spf.split(','); %>
      <td>0</td>
      <td class="odds_spf" id="spf_0">胜<%=spfOdds[0]%></td>
      <td class="odds_spf" id="spf_1">平<%=spfOdds[1]%></td>
      <td class="odds_spf" id="spf_2">负<%=spfOdds[2]%></td>
    </tr>
    <tr class="rqspf_bet">
      <% var rqspfOdds = spDatas.rqspf.split(',');%>
      <td><%=rqspfOdds[0] %></td>
      <td class="odds_rqspf" id="rqspf_1">胜<%=rqspfOdds[1]%></td>
      <td class="odds_rqspf" id="rqspf_2">平<%=rqspfOdds[2]%></td>
      <td class="odds_rqspf" id="rqspf_3">负<%=rqspfOdds[3]%></td>
    </tr>
    </tbody>
  </table>
</div>