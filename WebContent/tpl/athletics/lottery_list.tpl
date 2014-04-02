<div class="lotteryNum">
  <p class="f16"><%=data.matchArray[0].date%> <%=data.matchArray.length%>场比赛已开奖</p>
</div>
<table cellpadding="0" cellspacing="0" width="100%" class="line50">
  <colgroup><col width="25%"><col width="25%"><col width="25%"><col width="25%"></colgroup>
  <tbody>
  <%
    var arr= data.matchArray,classArr=['rs_s','rs_p','rs_f','rs_u'],rsArr=['胜','平','负','未开售'];
    for(var i=0, l=arr.length; i < l; i++ ){
      var player=arr[i].playAgainst.split('|'), rs=arr[i].result[0].spf;
  %>
  <tr class="match" data-match-id="<%=arr[i].matchId%>">
    <td class="first"><%=arr[i].number%><br><%=arr[i].leagueMatch%><br><%=arr[i].time%></td>
    <td class="bnone"><b class="f16 c257ab3"><%=player[0]%></b></td>
    <td class="bnone">
      <div class="lqkj">
        <div class="lqkjtitle <%=classArr[rsArr.indexOf(rs)] %>"><%=rs%></div>
        <p><%=arr[i].goalscore%></p>
      </div>
    </td>
    <td class="bnone"><b class="f16 c257ab3"><%=player[0]%></b></td>
  </tr>
  <%}%>
  </tbody>
</table>

