<div class="detail">
  <p>方案编号：<%=projectInfo.projectNo %></p>

  <p>发起人：<%=projectInfo.userName %></p>

  <p>发起时间：<%=projectInfo.projectDate %></p>

  <p>方案金额：<%=projectInfo.totalAmout %>元</p>

  <p>认购金额：<%=projectInfo.oneAmount %>元</p>

  <p>方案状态：<%=projectInfo.projectState %></p>

  <p>方案奖金：<%=projectInfo.awardAmount %>元</p>
</div>

<div class="detailList bt3">
  <ul>
    <li class="title">
      <p>
        <%
        var event = "";
        if (matchInfo.length) {
          event = matchInfo[0].event;
        }
        %>
        <%=event %>
        冠军竞猜</p>
    </li>
    <li>
      <p>
      <table cellpadding='0' cellspacing='0' width='100%' class='line30'>
        <colgroup>
          <col width="10%">
          <col width="10%">
          <col width="40%">
          <col width="20%">
          <col width="20%">
        </colgroup>
        <tbody>
        <% _.each(matchInfo, function (m) { %>
        <tr>
          <td>&nbsp;</td>
          <td><%=(m.gameId.length == 1 ? "0" + m.gameId : m.gameId) %></td>
          <td><%=m.team %></td>
          <td><%=m.promul %>倍</td>
          <td><%=m.sp %></td>
        </tr>
        <% });%>
        </tbody>
      </table>
      </p>
    </li>
  </ul>
</div>