<!--竞彩篮球混合投注模板-->
<div class="showhide more_odds" data-match-id="<%=matchId%>">
  <table class="lBTable" cellpadding="0" cellspacing="0" width="100%">
    <% var dxfOdds = spDatas.dxf.split(','); %>
    <colgroup>
      <col width="50%"/>
      <col width="50%"/>
    </colgroup>
    <thead>
    <tr>
      <td colspan="4" class="tab"><b>大小分(<%=dxfOdds[0]%>)</b></td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>大<br/><%=dxfOdds[1]%></td>
      <td>小<br/><%=dxfOdds[2]%></td>
    </tr>
    </tbody>
  </table>
  <table class="lRTable" cellpadding="0" cellspacing="0" width="100%">
    <% var sfcOdds = spDatas.sfc.split(','); %>
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
    <tr>
      <td rowspan="2" class="tab">主胜</td>
      <td>1-5<br/><%=sfcOdds[0]%></td>
      <td>6-10<br/><%=sfcOdds[1]%></td>
      <td>11-15<br/><%=sfcOdds[2]%></td>
    </tr>
    <tr>
      <td>16-20<br/><%=sfcOdds[3]%></td>
      <td>21-25<br/><%=sfcOdds[4]%></td>
      <td>26+<br/><%=sfcOdds[5]%></td>
    </tr>
    <tr>
      <td rowspan="2" class="tab">客胜</td>
      <td>1-5<br/><%=sfcOdds[6]%></td>
      <td>6-10<br/><%=sfcOdds[7]%></td>
      <td>11-15<br/><%=sfcOdds[8]%></td>
    </tr>
    <tr>
      <td>16-20<br/><%=sfcOdds[9]%></td>
      <td>21-25<br/><%=sfcOdds[10]%></td>
      <td>26+<br/><%=sfcOdds[11]%></td>
    </tr>
    </tbody>
  </table>
</div>