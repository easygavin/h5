<%_.each(matchs, function (m) {%>
<table id="m_<%=m.gameId %>" cellpadding="0" cellspacing="0" width="50%" class="line50 fl">
  <colgroup>
    <col width="25%">
    <col width="25%">
  </colgroup>
  <tbody>
  <tr>
    <td><img src="<%=flags[m.team] %>" width="5em"><br><%=m.team %></td>
    <% if (m.status == "销售中") {%>
      <td class="matchSp">赔率<br><%=m.sp %></td>
    <%} else {%>
      <td class="matchSp rs_u c0cc"><%=m.status %></td>
    <%}%>
  </tr>
  </tbody>
</table>
<%});%>
<% if (matchs.length == 0){ %>
  暂无赛事数据
<%} %>