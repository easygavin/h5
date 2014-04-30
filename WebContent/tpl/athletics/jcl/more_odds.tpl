<!--竞彩篮球混合投注模板-->
<div class="showhide more_odds" data-match-id="<%=matchId%>">
  <table class="lBTable" cellpadding="0" cellspacing="0" width="100%">
    <colgroup>
      <col width="50%"/>
      <col width="50%"/>
    </colgroup>
    <thead>
    <%var dxfOdds = spDatas.dxf.split(',');%>
    <tr>
      <td colspan="4" class="tab"><b>大小分(<%=dxfOdds[0]%>)</b></td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <%
        if((dxfOdds[1]+dxfOdds[2]).indexOf('null')==-1){
      %>
        <td id="dxf_1-<%=matchId%>">大<br/><%=dxfOdds[1]%></td>
        <td id="dxf_2-<%=matchId%>">小<br/><%=dxfOdds[2]%></td>
      <%}else{%>
        <td class="tab" colspan="2">该玩法未出售</td>
      <%}%>
    </tr>
    </tbody>
  </table>
  <table class="lRTable" cellpadding="0" cellspacing="0" width="100%">
    <colgroup>
      <col width="25%"/>
      <col width="25%"/>
      <col width="25%"/>
    </colgroup>
    <thead>
    <tr>
      <td colspan="4" class="tab"><b>胜分差</b></td>
    </tr>
    </thead>
    <tbody>
    <%
      var sfcOdds = spDatas.sfc.split(',');
      var rs = '';
      for(var i=0,l=sfcOdds.length; i< l; i++){
      rs += sfcOdds[i];
      }
      if(rs.indexOf('null')==-1){
    %>
      <tr>
        <td rowspan="2" class="tab">主胜</td>
        <td id="sfc_0-<%=matchId%>">1-5<br/><%=sfcOdds[0]%></td>
        <td id="sfc_1-<%=matchId%>">6-10<br/><%=sfcOdds[1]%></td>
        <td id="sfc_2-<%=matchId%>">11-15<br/><%=sfcOdds[2]%></td>
      </tr>
      <tr>
        <td id="sfc_3-<%=matchId%>">16-20<br/><%=sfcOdds[3]%></td>
        <td id="sfc_4-<%=matchId%>">21-25<br/><%=sfcOdds[4]%></td>
        <td id="sfc_5-<%=matchId%>">26+<br/><%=sfcOdds[5]%></td>
      </tr>
      <tr>
        <td rowspan="2" class="tab">客胜</td>
        <td id="sfc_6-<%=matchId%>">1-5<br/><%=sfcOdds[6]%></td>
        <td id="sfc_7-<%=matchId%>">6-10<br/><%=sfcOdds[7]%></td>
        <td id="sfc_8-<%=matchId%>">11-15<br/><%=sfcOdds[8]%></td>
      </tr>
      <tr>
        <td id="sfc_9-<%=matchId%>">16-20<br/><%=sfcOdds[9]%></td>
        <td id="sfc_10-<%=matchId%>">21-25<br/><%=sfcOdds[10]%></td>
        <td id="sfc_11-<%=matchId%>">26+<br/><%=sfcOdds[11]%></td>
      </tr>
    <%}else{%>
      <tr>
        <td class="tab" colspan="3">该玩法未开售</td>
      </tr>
    <%}%>
    </tbody>
  </table>
</div>