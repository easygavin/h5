<% _.each(datas, function (d) { %>
<table cellpadding="0" cellspacing="0" width="100%" class="line30 kjList">
  <%
  var lotteryType = d.lotteryType, lotteryName = "";
  if (lotteryType == "11") {
  lotteryName = "双色球";
  }
  %>
  <tr>
    <td>
      <i class="fl"><%=lotteryName %></i>
      <i class="fr">第<%=d.issueNo %>期</i></td>
  </tr>
  <%
  var numbers = d.lotteryNumbers.split(","),
  reds = [], blues = [];
  switch(lotteryType+"") {
  case "11":
  if (numbers.length > 6) {
  reds = numbers.slice(0, 6);
  blues = numbers.slice(6, 7);
  }
  break;
  }
  %>
  <tr>
    <td class="kjBall">
      <i class="fm fr" id="m_<%=d.lotteryType %>">&#xf059;</i>
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