<table cellpadding='0' cellspacing='0' width='100%' class='line30'>
  <colgroup>
    <col width="60%">
    <col width="20%">
    <col width="20%">
  </colgroup>
  <tbody>
  <% _.each(issues, function (i) { %>
  <tr>
    <td><%=i.issueNo %>期,<%=i.proBets %>注,<%=i.proMul %>倍</td>
    <td><span class="cdd1049">¥<%=parseFloat(i.oneAmount).toFixed(1) %></span></td>
    <td><%=i.status %></td>
  </tr>
  <% });%>
  </tbody>
</table>