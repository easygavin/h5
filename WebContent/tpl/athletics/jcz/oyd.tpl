<table class="line50" cellpadding="0" cellspacing="0" width="100%"
       style="border-top:none;margin-top:0;">
  <thead>
  <tr>
    <td>公司</td>
    <td colspan="3">即时</td>
    <td colspan="3">初盘</td>
  </tr>
  </thead>
  <tbody>
  <% for(var i= 0, l=data.length; i < l; i++ ){%>
  <tr>
    <td><%=data[i].company%></td>
    <td><%=data[i].oddsNow1%></td>
    <td><%=data[i].oddsNow2%></td>
    <td><%=data[i].oddsNow3%></td>
    <td><%=data[i].oddsFirst1%></td>
    <td><%=data[i].oddsFirst2%></td>
    <td><%=data[i].oddsFirst3%></td>
  </tr>
  <%}%>
  </tbody>
</table>