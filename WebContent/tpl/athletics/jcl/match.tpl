<!--竞彩篮球对阵模板-->
<div id="<%=matchId%>" data-match-id="<%=matchId%>" class="betContain">
  <table cellpadding="0" cellspacing="0" width="100%" class="line50" data-number="<%=number%>">
    <colgroup>
      <col width=""/>
      <col width="10%"/>
      <col width="30%"/>
      <col width="30%"/>
    </colgroup>
    <tr>
      <td rowspan="3" class="first bordernone">
        <span class="leagueT"><%=leagueMatch%></span>
        <br><%=number%><br><%=time%> <br>
        <i class="fm arr"></i>
      </td>
      <td colspan="3" class="c257ab3">
        <b class="f16"><%=playAgainst.split('|').join('</b>vs<b class="f16">')%></b>
      </td>
    </tr>
    <tr class="footballTz">
      <%
        var sfOdds = spDatas.sf.split(',');
        if((sfOdds[0]+sfOdds[1]).indexOf('null')==-1){
      %>
        <td class="tab">0</td>
        <td id="sf_0-<%=matchId%>">主胜<br><%=sfOdds[0]%></td>
        <td id="sf_1-<%=matchId%>">客胜<br><%=sfOdds[1]%></td>
      <%}else{%>
        <td class="tab" colspan="3">该玩法未开售</td>
      <%}%>
    </tr>
    <tr class="lYTable">
      <%
        var rfsfOdds = spDatas.rfsf.split(',');
        if((rfsfOdds[0]+rfsfOdds[1]+rfsfOdds[2]).indexOf('null')==-1){
      %>
        <td class="tab">让分<br><%=rfsfOdds[0]%></td>
        <td id="rfsf_1-<%=matchId%>">让分主胜<br><%=rfsfOdds[1]%></td>
        <td id="rfsf_2-<%=matchId%>">让分客胜<br><%=rfsfOdds[2]%></td>
      <%}else{%>
        <td  class="tab" colspan="3">该玩法未开售</td>
      <%}%>
    </tr>
  </table>
</div>