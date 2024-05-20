<%
    String activePage = (String) request.getAttribute("activePage");
    String name = (String) session.getAttribute("name");
%>
<div class="header">
    <a class="logo" href="index.jsp">NoF</a>
    <a href="index.jsp" <%= activePage.equals("home") ? "class='active'" : "" %>>Home</a>
    <a href="filter-servlet" <%= activePage.equals("physicalProducts") ? "class='active'" : "" %>>Physical Products</a>
    <a href="nonphysical-servlet" <%= activePage.equals("nonPhysicalProducts") ? "class='active'" : "" %>>Non-Physical Products</a>
    <a href="post.jsp" <%= activePage.equals("postIssue") ? "class='active'" : "" %>>Post my Issue</a>
    <div class="header-right">
        <a href="myaccount.jsp" <%= activePage.equals("myAccount") ? "class='active'" : "" %>>My account</a>

        <%
            if (session.getAttribute("loggedIn") == null) {
                String activeClass = activePage.equals("login") ? "class='active'" : "";
        %>
        <a href="login.jsp" <%= activeClass %>>Login</a>
        <%
        } else {
        %>
        <a>Welcome, <%= name %></a>
        <%
            }
        %>
    </div>
    <%
        String errorMessage = (String) session.getAttribute("errorMessage");
        if (errorMessage != null) {
            session.removeAttribute("errorMessage");
    %>
    <script>
        showError('<%= errorMessage %>');
    </script>
    <%
        }
    %>
</div>