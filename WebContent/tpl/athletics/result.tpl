<div class="lotteryNum">
  <p class="f16">方案编号:<%=data.lotteryNo %></p>
</div>
<div class="hmBox">
  <p class="bl3">发起人：<%=hideString(data.createUser) %></p>
  <p>发起时间：<%=data.createDate %></p>
  <p>方案金额：<%=data.totalAmount %>元</p>
  <p>认购金额：<%=data.oneAmount*data.userBuyVolume %>元</p>
  <p>方案状态：<%=data.projectState %></p>
  <p>个人奖金：<span class="cdd1049"><%=+data.bonus?data.bonus+'元':data.bonus %></span></p>
</div>
<table cellpadding="0" cellspacing="0" width="100%" class="line30 tabp bt3">
  <colgroup>
    <col width='70%'>
    <col width='20%'>
    <col width='10%'>
  </colgroup>
  <thead>
  <tr>
    <td colspan="3"><%=data.title%><span class="fr"><%=data.passWay%></span></td>
  </tr>
  </thead>
  <tbody>
  <%
  if(data.detail && data.detail.length){
    for(var i = 0, len = data.detail.length; i < len; i++) {
    var item = data.detail[i];
    var content = item.content.replace(/{/g, '<span class="cdd1049">').replace(/}/g, '</span>').replace(/\n/g, '<br>');
  %>
  <tr>
    <td><%=content%></td>
    <td><%=item.score%></td>
    <td class="cdd1049"><%=item.dan%></td>
  </tr>
  <%
    }
  }else{
  %>
  <tr>
    <td colspan="3" align="center">方案不公开</td>
  </tr>
  <%}%>
  </tbody>
</table>
<div class="w45"></div>