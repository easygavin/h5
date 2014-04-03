<% _.each(data, function (d) {
var reds = [], blues = [],
numbers = d.lotteryNumbers.split(","),
issueNo = d.issueNo;
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
  case "pl3": // 大乐透
    reds = numbers;
    break;
  case "syx": // 11选5
  case "syy": // 十一运夺金
    reds = numbers;
    issueNo = issueNo.substring(8);
    break;
}
%>
<p>
  第<%=issueNo %>期开奖:

  <% _.each(reds, function (r) { %>
  <b class="cdd1049"><%=r %></b>
  <% }); %>

  <% _.each(blues, function (b) { %>
  <b class="c0cc"><%=b %></b>
  <% }); %>
</p>
<% }); %>