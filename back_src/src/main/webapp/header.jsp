<%
    String activePage = (String) request.getAttribute("activePage");
    String name = (String) session.getAttribute("name");
%>
<div class="header">
    <a class="logo" href="index.jsp">NoF</a>
    <a href="index.jsp" <%= activePage.equals("home") ? "class='active'" : "" %>>Home</a>
    <a href="articles.jsp" <%= activePage.equals("articles") ? "class='active'" : "" %>>Articles</a>
    <a href="post.jsp" <%= activePage.equals("postIssue") ? "class='active'" : "" %>>Post my Issue</a>

    <div class="header-right">
        <%
            if (session.getAttribute("loggedIn") == null) {
                String activeClass = activePage.equals("login") ? "class='active'" : "";
        %>
        <a href="login.jsp" <%= activeClass %>>Login</a>
        <%
        } else {
        %>
        <a>Welcome, <%= name %></a>
        <a href="myaccount.jsp" <%= activePage.equals("myAccount") ? "class='active'" : "" %>>My account</a>
        <a href="logout-servlet">Logout</a>
        <%
            }
        %>

        <%
            if (session.getAttribute("admin") != null) {
                String activeClass = activePage.equals("admin") ? "class='active'" : "";
        %>
        <a href="admin.jsp" <%= activeClass %>>Admin</a>
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