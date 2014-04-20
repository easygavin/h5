<%_.each(data.datas,function(data){%>
    <tr>
      <td>
        <div class="hmBox">

          <p class="bl3"> <b class="c257ab3"><%=map[data.lotteryType].title%></b> </p>

          <p>发起人：<%=data.createUserName%>&nbsp;
            <%=honour(parseInt(data.goldStar),parseInt(data.silverStar))%>
          </p>

          <p>总金额：<%=data.totalAmount%>元，剩余<%=data.restVolume%>份</p>
          <p>进度：<i class="jdbox"><i style="width:<%=data.percent%>%"></i> </i><%=data.percent%>%+<%=data.holdPercent%>%(保)
          </p>
          <a id='more_<%=data.lotteryType%>_<%=data.projectId%>' class='fm rightJ c257ab3'>&#xf059;</a>
        </div>
      </td>
    </tr>
<%});%>