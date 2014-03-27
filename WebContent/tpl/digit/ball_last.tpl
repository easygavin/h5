<% _.each(data, function (d) {
var reds = [], blues = [], numbers = d.lotteryNumbers.split(",");
switch(lot) {
  case "ssq": // 双色球
    if (numbers.length > 6) {
      reds = numbers.slice(0, 6);
      blues = numbers.slice(6, 7);
    }
    break;
  case "dlt": // 大乐透
    if (numbers.length > 6) {
      reds = numbers.slice(0, 5);
      blues = numbers.slice(5, 7);
    }
    break;
  case "f3d": // 福彩3D
  case "pl3": // 大乐透
    reds = numbers;
    break;
}
%>
<p>
  第<%=d.issueNo %>期开奖:

  <% _.each(reds, function (r) { %>
  <b class="cdd1049"><%=r %></b>
  <% }); %>

  <% _.each(blues, function (b) { %>
  <b class="c0cc"><%=b %></b>
  <% }); %>
</p>
<% }); %>