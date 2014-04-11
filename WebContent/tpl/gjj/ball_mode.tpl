<% _.each(modes, function (m) { %>
<% if (m.key == def) { %>
<a id="mode_<%=m.key %>" class="click"><%=m.name %></a>
<% } else { %>
<a id="mode_<%=m.key %>"><%=m.name %></a>
<% } %>
<% }); %>