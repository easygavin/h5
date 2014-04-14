<!--竞彩足球[上下盘]模板-->
<div data-match-id="<%=matchId%>" class="match">
  <table width="100%" cellspacing="0" cellpadding="0" class="line50" data-number="<%=number%>"
         data-live-id="<%=gliveId%>">
    <colgroup>
      <col width="">
      <col width="10%">
      <col width="40%">
      <col width="40%">
    </colgroup>
    <tbody>
    <tr>
      <td colspan="2" class="more_odds_btn" rowspan="2">
        <%=leagueMatch%>
        <br><%=number%><br><%=time%> <br>
      </td>
      <td class="analyse" colspan="3">
        <b class="f16"><%=playAgainst.split('|').join('</b>vs<b class="f16">')%></b>
        <b class="fr">>&nbsp;&nbsp;</b>
      </td>
    </tr>
    <tr class="uad_bet">
      <%var uadOdds = spDatas.footwall.split('|');%>
      <td class="odds_aud" id="uad_0" data-text="<%=uadOdds[0]%>"><%=uadOdds[0].replace('_',' ')%></td>
      <td class="odds_aud" id="uad_1" data-text="<%=uadOdds[1]%>"><%=uadOdds[1].replace('_',' ')%></td>
    </tr>
    </tbody>
  </table>
</div>