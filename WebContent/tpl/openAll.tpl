<% _.each(datas, function (d) { %>
  <%
  var lotteryType = d.lotteryType + "", lotteryName = "";
  var numbers = d.lotteryNumbers.split(","),
  reds = [], blues = [], desc = "";
  switch (lotteryType) {
    case "11": // 双色球
      lotteryName = "双色球";
      if (numbers.length > 6) {
        reds = numbers.slice(0, 6);
        blues = numbers.slice(6, 7);
      } else {
        reds = numbers;
      }
    break;
    case "13": // 大乐透
      lotteryName = "大乐透";
      if (numbers.length > 6) {
        reds = numbers.slice(0, 5);
        blues = numbers.slice(5, 7);
      } else {
        reds = numbers;
      }
      break;
    case "12": // 福彩3D
      lotteryName = "福彩3D";
      reds = numbers;
      break;
    case "4": // 排列3
      lotteryName = "排列3";
      reds = numbers;
      break;
    case "34": // 11选5
      lotteryName = "11选5";
      reds = numbers;
      break;
    case "31": // 十一运夺金
      lotteryName = "十一运夺金";
      reds = numbers;
      break;
    case "46": // 竞彩足球
      lotteryName = "竞彩足球";
      desc = "查看开奖详情";
      break;
    case "36": // 竞彩篮球
      lotteryName = "竞彩篮球";
      desc = "查看开奖详情";
      break;
  }
  %>
  <% if(lotteryType != '89' && lotteryType != '92' &&  lotteryType !='1' && lotteryType !='88' ){%>
<table cellpadding="0" cellspacing="0" width="100%" class="line30 kjList bt4 mt10">
  <tr>
    <td>
      <i class="fl"><%=lotteryName %></i>
      <i class="fr">第<%=d.issueNo %>期</i></td>
  </tr>
  <tr>
    <td class="kjBall">
      <i class="fm fr" id="m_<%=d.lotteryType %>">&#xf059;</i>
      <% _.each(reds, function (r) { %>
      <span class="red"><%=r %></span>
      <% });%>
      <% _.each(blues, function (b) { %>
      <span class="blue"><%=b %></span>
      <% });%>
      <% if (desc != "") { %>
        <i class="cdd1049"><%=desc %></i>
      <% } %>
    </td>
  </tr>
</table>
<%}%>
<% });%>