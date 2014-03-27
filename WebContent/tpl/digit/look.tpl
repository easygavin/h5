<div class="detail">
  <p><%=issueTitle %>第<%=issueNo %>期</p>

  <p>开奖号码：<%=lotteryNumber.replace(/,/g, ' ') %></p>

  <p>开奖时间：<%=openDate %></p>

  <p>本期销量：<%=betAmount %></p>

  <p>奖池滚存：<%=bonusAmount %></p>
</div>

<%
var levelMap = {
  "ssq":{
    "1":"一等奖",
    "2":"二等奖",
    "3":"三等奖",
    "4":"四等奖",
    "5":"五等奖",
    "6":"六等奖"
  },
  "dlt":{
    "1":"一等奖基本",
    "2":"一等奖追加",
    "3":"二等奖基本",
    "4":"二等奖追加",
    "5":"三等奖基本",
    "6":"三等奖追加",
    "7":"四等奖基本",
    "8":"四等奖追加",
    "9":"五等奖基本",
    "10":"五等奖追加",
    "11":"六等奖基本",
    "12":"六等奖追加",
    "13":"七等奖基本",
    "14":"七等奖追加",
    "15":"八等奖基本",
    "16":"12选2"
  },
  "f3d":{
    "1":"直选",
    "2":"组选3",
    "3":"组选6"
  },
  "pl3":{
    "1":"直选",
    "2":"组选3",
    "3":"组选6"
  }
};
%>
<div class="lookBox">
  <table cellpadding="0" cellspacing="0" width="100%" class="mLine30">
    <colgroup>
      <col width="33%">
      <col width="33%">
      <col width="34%">
    </colgroup>
    <thead>
    <tr>
      <td>奖项</td>
      <td>中奖注数</td>
      <td>每注奖金</td>
    </tr>
    </thead>
    <tbody>
    <% _.each(winDatas, function (w) {
    var levelName = levelMap[lot][w.level];
    %>
    <tr>
      <td><%=levelName %></td>
      <td><%=w.count %></td>
      <td><%=w.bonus %></td>
    </tr>
    <% });%>
    </tbody>
  </table>
</div>