<% _.each(items, function (i, index) { %>
  <tr>
    <td><%=i.issueNo.substring(4) %></td>
    <td><input type="tel" class="shoutinp" value="<%=i.muls %>" maxlength="4" id="i_<%=index %>"></td>
    <td><%=i.totalPay %></td>
    <td class="cdd1049">
      <%=i.minIncome %>
      <% if (i.maxIncome > 0) {%>
        <br>~<%=i.maxIncome %>
      <% } %>
    </td>
    <td class="cdd1049">
      <%=i.minRate.toFixed(2) %>%
      <% if (i.maxRate > 0) {%>
      <br>~<%=i.maxRate.toFixed(2) %>%
      <% } %>
    </td>
  </tr>
<% });%>