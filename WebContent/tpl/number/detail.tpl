<div class="detail">
  <p>方案编号：<%=lotteryNo %></p>

  <p>发起人：<%=createUser %></p>

  <p>发起时间：<%=createDate %></p>

  <p>方案金额：<%=totalAmount %>元</p>

  <p>认购金额：<%=(parseInt(oneAmount, 10) * userBuyVolume).toFixed(2) %>元</p>

  <p>方案状态：<%=projectState %>
    <% if (projectType == "1") { %>
      <a id="hmOrder" class="clearall fr">查看本单合买</a>
    <% } %>
  </p>

  <p>个人奖金：<%=bonus + (isNaN(bonus) ? "" : "元") %></p>
</div>

<div class="detailList bt3">
  <ul>
    <% if (hasWithdraw > 1) { %>
    <li class="title">
      <p><i id="pullBtn" class="fr fm down">&#xf003;</i><%=title %></p>
    </li>
    <li>
      <p id="allIssueList" class="hidden"></p>
    </li>
    <% } else { %>
    <li class="title">
      <p><%=title %></p>
    </li>
    <% } %>
    <li><p class="wb"><%=detail == "" ? "不公开" : detail %></p></li>
    <% if (openNumber) { %>
    <li class="title"><p class="wb">
      <%=issueNo %>期开奖号码:
      <% if (reds) { %>
      <span class="cdd1049"><%=reds %></span>
      <% } %>
      <% if (blues) { %>
      <span class="c0cc"><%=blues %></span>
      <% } %>
    </p></li>
    <% } %>
  </ul>
</div>