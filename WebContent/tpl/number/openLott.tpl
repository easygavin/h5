<% _.each(data, function (d) { %>
<table cellpadding="0" cellspacing="0" width="100%" class="line30 kjList">
  <tr>
    <td>
      <i class="fl">第<%=d.issueNo %>期</i>
      <i class="fr"><%=d.openDate %></i></td>
  </tr>
  <%
  var numbers = d.lotteryNumbers.split(","),
  reds = [], blues = [];
  switch(lot) {
  case "ssq": // 双色球
    if (numbers.length > 6) {
      reds = numbers.slice(0, 6);
      blues = numbers.slice(6, 7);
    } else {
      reds = numbers;
    }
    break;
  case "dlt": // 大乐透
    if (numbers.length > 6) {
      reds = numbers.slice(0, 5);
      blues = numbers.slice(5, 7);
    } else {
      reds = numbers;
    }
    break;
  case "f3d": // 福彩3D
  case "pl3": // 排列3
  case "syx": // 11选5
  case "syy": // 十一运夺金
    reds = numbers;
    break;
  }
  %>
  <tr>
    <td class="kjBall">
      <% if (lot=="ssq" || lot=="dlt" || lot=="f3d" || lot=="pl3") { %>
      <i class="fm fr" id="m_<%=d.issueNo %>">&#xf059;</i>
      <%}%>
      <% _.each(reds, function (r) { %>
      <span class="red"><%=r %></span>
      <% });%>
      <% _.each(blues, function (b) { %>
      <span class="blue"><%=b %></span>
      <% });%>
    </td>
  </tr>
</table>
<% });%>