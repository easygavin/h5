<table cellpadding="0" cellspacing="0" width="100%" class="line30">
  <colgroup><col width="25%"><col width="25%"><col width="25%"><col width="25%"></colgroup>
  <thead>
  <tr>
    <td class="tl head" colspan="4">
      &nbsp;&nbsp;<%=data.matchArray[0].date%> <%=data.matchArray.length%>场比赛已开奖
    </td>
  </tr>
  </thead>
  <tbody class="">
  <%
    var arr= data.matchArray,classArr=['rs_s','rs_p','rs_f'],rsArr=['胜','平','负'];
    for(var i=0, l=arr.length; i < l; i++ ){
      var player=arr[i].playAgainst.split('|'), rs=arr[i].result[0].spf;
  %>
  <tr>
    <td><%=arr[i].number%><br><%=arr[i].leagueMatch%></td>
    <td><%=player[0]%><br>(<%=arr[i].transfer%>)</td>
    <td class="<%=classArr[rsArr.indexOf(rs)] %>"><%=arr[i].goalscore%><br><%=rs%></td>
    <td><%=player[1]%></td>
  </tr>
  <%}%>
  </tbody>
</table>