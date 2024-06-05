<!--
    The admin can update/delete users
    Also he can approve, update or delete posts

    By example: 
    User X posts
    Title: Volkswagen
    Description: Is shitty and I hate it, kill yourself Volkswagen

    The admin can edit it to exclude the swears and then he can approve it
-->

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    request.setAttribute("activePage", "admin");
%>
<%@ page import="org.example.demo.User" %>
<%@ page import="java.util.List" %>
<jsp:include page="header.jsp" />

<!DOCTYPE html>
<html lang="en">
<head>
    
    <meta charset="utf-8" />
    <title>Admin</title>
    <link rel="stylesheet" href="misc/style.css">
</head>

<body>
    <br>
    <section>

            <form action="view-users-servlet">
                <h2>Users</h2>
                <button>Get users</button>
            </form>
    </section>
    <div class="article-container">
        <%
            List<User> users = (List<User>) request.getAttribute("users");
            if (users != null) {
                for (User user : users) {
        %>
        <div class="article">
            <h2><%= user.getName() %></h2>
            <p>Email: <%= user.getEmail() %></p>
            <p>Role: <%= user.getRole() %></p>
            <form action="delete-user-servlet" method="post">
                <input type="hidden" name="userId" value="<%= user.getId() %>">
                <button type="submit">Delete Account</button>
            </form>
            <form action="promote-user-servlet" method="post">
                <input type="hidden" name="userId" value="<%= user.getId() %>">
                <button type="submit"><%= user.getRole().equals("admin") ? "Demote from Admin" : "Promote to Admin" %></button>
            </form>
        </div>
        <%
                }
            }
        %>
        </div>

</body>
</html>
    