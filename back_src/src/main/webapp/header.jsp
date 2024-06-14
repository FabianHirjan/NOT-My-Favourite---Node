<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String activePage = (String) request.getAttribute("activePage");
    if (activePage == null) {
        activePage = "";
    }
    String name = (String) session.getAttribute("name");
%>
<div class="header">
    <a class="logo" href="index.jsp">NoF</a>
    <a href="index.jsp" <%= "home".equals(activePage) ? "class='active'" : "" %>>Home</a>
    <a href="article-servlet" <%= "articles".equals(activePage) ? "class='active'" : "" %>>Articles</a>
    <a href="post-servlet" <%= "postIssue".equals(activePage) ? "class='active'" : "" %>>Post my Issue</a>
    <div class="header-right">
        <%
            if (session.getAttribute("loggedIn") == null) {
                String activeClass = "login".equals(activePage) ? "class='active'" : "";
        %>
        <a href="login.jsp" <%= activeClass %>>Login</a>
        <%
        } else {

        %>
        <a>Welcome, <%= name %></a>
        <a href="view-user-profile-servlet" <%= "myAccount".equals(activePage) ? "class='active'" : "" %>>My account</a>
        <a href="api/logout">Logout</a>
        <%
            }
        %>
        <%
            if (session.getAttribute("admin") != null) {
                String activeClass = "admin".equals(activePage) ? "class='active'" : "";
        %>
        <a href="view-users-servlet" <%= activeClass %>>Admin</a>
        <%
            }
        %>
    </div>
</div>
