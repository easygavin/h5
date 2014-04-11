<div class="lotteryNum">
  <p class="f16">方案编号:<%=lotteryNo %></p>
</div>
<div class="hmBox">
  <p class="bl3">发起人：<%=createUser %></p>
  <p>发起时间：<%=createDate %></p>
  <p>方案金额：<%=totalAmount %>元</p>
  <p>认购金额：<%=oneAmount %>元</p>
  <p>方案状态：<%=projectState %></p>
  <p>奖金:<span class="cdd1049"><%=+bonus?bonus+'元':bonus %></span></p>
</div>
<table cellpadding="0" cellspacing="0" width="100%" class="line30 tabp bt3">
  <colgroup>
    <col width='70%'>
    <col width='20%'>
    <col width='10%'>
  </colgroup>
  <thead>
  <tr>
    <td colspan="3"><%=title%><span class="fr"><%=passWay%></span></td>
  </tr>
  </thead>
  <tbody>
  <%
  for(var i = 0, len = detail.length; i < len; i++) {
  var content = detail[i].content.replace(/{/g, '<span class="cdd1049">').replace(/}/g, '</span>').replace(/\n/g, '<br>');
  %>
  <tr>
    <td><%=content%></td>
    <td><%=detail[i].score%></td>
    <td class="cdd1049"><%=detail[i].dan%></td>
  </tr>
  <%}%>
  </tbody>
</table>
<div class="w45"></div>