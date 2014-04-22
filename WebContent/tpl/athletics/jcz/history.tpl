<table class="line50" cellpadding="0" cellspacing="0" width="100%" style="border-top:none;margin-top:0;">
  <thead>
  <tr>
    <td colspan="6" align="left">/ 历史交锋</td>
  </tr>
  <tr>
    <td>时间</td>
    <td>赛事</td>
    <td>主队</td>
    <td>比分</td>
    <td>客队</td>
    <td>胜负</td>
  </tr>
  </thead>
  <tbody>
  <% for(var i= 0, l=jf.length; i < l; i++ ){%>
  <tr>
    <td><%=jf[i].time%></td>
    <td><%=jf[i].gameShortCn%></td>
    <td><%=jf[i].hostname%></td>
    <td><%=jf[i].score%></td>
    <td><%=jf[i].visitname%></td>
    <td><%=jf[i].spf%></td>
  </tr>
  <%}%>
  </tbody>
</table>
<table class="line50" cellpadding="0" cellspacing="0" width="100%" style="border-top:none;margin-top:0;">
  <thead>
  <tr>
    <td colspan="6">
      <span style="float:left;">/ 近期战绩</span>
      <span class="bold" style="margin-left: -90px;"><%=hostName%></span>
    </td>
  </tr>
  <tr>
    <td>时间</td>
    <td>赛事</td>
    <td>主队</td>
    <td>比分</td>
    <td>客队</td>
    <td>胜负</td>
  </tr>
  </thead>
  <tbody>
  <% for(var i= 0, l=host.length; i < l; i++ ){%>
  <tr>
    <td><%=host[i].time%></td>
    <td><%=host[i].gameShortCn%></td>
    <td><%=host[i].hostname%></td>
    <td><%=host[i].score%></td>
    <td><%=host[i].visitname%></td>
    <td><%=host[i].spf%></td>
  </tr>
  <%}%>
  </tbody>
</table>
<table class="line50" cellpadding="0" cellspacing="0" width="100%" style="border-top:none;margin-top:0;">
  <thead>
  <tr>
    <td colspan="6">
      <span style="float:left;">/ 近期战绩</span>
      <span class="bold" style="margin-left: -90px;"><%=visitName%></span>
    </td>
  </tr>
  <tr>
    <td>时间</td>
    <td>赛事</td>
    <td>主队</td>
    <td>比分</td>
    <td>客队</td>
    <td>胜负</td>
  </tr>
  </thead>
  <tbody>
  <% for(var i= 0, l=visit.length; i < l; i++ ){%>
  <tr>
    <td><%=visit[i].time%></td>
    <td><%=visit[i].gameShortCn%></td>
    <td><%=visit[i].hostname%></td>
    <td><%=visit[i].score%></td>
    <td><%=visit[i].visitname%></td>
    <td><%=visit[i].spf%></td>
  </tr>
  <%}%>
  </tbody>
</table>