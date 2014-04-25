<!--竞彩足球[上下盘]模板-->
<div data-match-id="<%=matchId%>" class="match">
  <table width="100%" cellspacing="0" cellpadding="0" class="line50" data-number="<%=number%>"
         data-live-id="<%=gliveId%>">
    <colgroup>
      <col width="24%">
      <col width="12%">
      <col width="26%">
      <col width="26%">
      <col width="12%">
    </colgroup>
    <tbody>
    <tr>
      <td rowspan="2">
        <span class="leagueT"><%=leagueMatch%></span>
        <br><%=number%><br><%=time%> <br>
      </td>
      <td colspan="3">
        <b class="f16 c257ab3"><%=playAgainst.split('|').join('vs')%></b>
      </td>
      <td class="analyse">析</td>
    </tr>
    <tr class="uad_bet">
      <%var uadOdds = spDatas.footwall.split('|');%>
      <td colspan="2" class="odds_aud" data-result="uad_0" data-text="<%=uadOdds[0]%>"><%=uadOdds[0].replace('_',' ')%></td>
      <td colspan="2" class="odds_aud" data-result="uad_1" data-text="<%=uadOdds[1]%>"><%=uadOdds[1].replace('_',' ')%></td>
    </tr>
    </tbody>
  </table>
</div>


