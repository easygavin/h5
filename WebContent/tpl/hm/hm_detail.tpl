<div class="hmBox" style="font-size: 1.0em">
  <p class="bl3">发起人：<%=hideString(data.createUser)%></p>
  <P>
    中奖总金额：<i style="color:red">
    <%=data.createUserWinAmount%></i>元
  </p>
  <p>中奖次数：<i style="color:red"><%=data.createUserWinCount%></i>次</p>
  <p class="f16">方案编号：<%=data.lotteryNo%></p>
  <p>发起时间：<%=data.createDate%></p>
  <p>方案总金额：<i style="color:red"><%=data.totalAmount%></i>元</p>
  <P>提成：<i style="color:red"><%=data.commPercent%></i>%</p>
  <p>共<i style="color:red">
    <%=data.totalCount%></i>份,剩余<i style="color:red">
    <%=data.totalCount-data.buyVolume%></i>份,&nbsp;每份金额：<i style="color:red">
    <%=data.oneAmount%></i>元</p>
  <p>
    进度：<i class="jdbox">
    <i style="width:<%=(data.buyVolume/data.totalCount).toFixed(1)*100%>%"></i> </i>
    <%=((parseInt(data.buyVolume)/parseInt(data.totalCount))*100).toFixed(2)%>%+(保)
    <%=((parseInt(data.holdVolume)/parseInt(data.totalCount))*100).toFixed(2)%>%
  </p>
</div>

<table cellpadding="0" cellspacing="0" width="100%" class="line30 tabp bt3">
  <%if(display_flag=='jc'){%>
  <colgroup>
    <col width='70%'>
    <col width='20%'>
    <col width='10%'>
  </colgroup>
  <thead>
  <tr>
    <td colspan="3"><%=data.title%><%=data.issueNo%>期<span class="fr"><%=data.passWay%></span></td>
  </tr>
  </thead>
  <tbody>

  <%
  if(typeof data.detail!='undefined'){%>
  <%
  for(var i = 0, len = data.detail.length; i < len; i++) {
  var content = data.detail[i].content.replace(/{/g, '<span class="cdd1049">').replace(/}/g, '</span>').replace(/\n/g, '<br>');
  %>
  <tr>
    <td><%=content%></td>
    <td><%=data.detail[i].score%></td>
    <td class="cdd1049"><%=data.detail[i].dan%></td>
  </tr>
  <%}%>
  <%}else {%>
  <tr>
    <%if(data.openState=='1'){%>
    <td class="cdd1049">跟单后公开</td>
    <%}else if(data.openState=='1'){%>
    <td class="cdd1049">截止后公开</td>
    <%}else if(data.openState='3'){%>
    <td class="cdd1049">不公开</td>
    <%}%>
  </tr>
  <%}%>

  </tbody>
  <%}else if(display_flag='digit'){%>

      <tr>
        <td style='text-align:center;'><%=data.title%></td>
      </tr>

      <%if(data.detail!=''){%>
          <tr>
            <td>
              <div style='overflow:auto;height:200px;'>
                <%=data.detail.replace(/\#/g,'<br>')%>
              </div>
            </td>
          </tr>
      <%}else{%>
            <tr>
               <%if(data.openState=='2'){%>
               <td class="cdd1049">跟单后公开</td>
               <%}else if(data.openState=='3'){%>
               <td class="cdd1049">截止后公开</td>
               <%}else if(data.openState='4'){%>
               <td class="cdd1049">不公开</td>
               <%}%>
             </tr>
      <%}%>
  <%}%>
</table>
