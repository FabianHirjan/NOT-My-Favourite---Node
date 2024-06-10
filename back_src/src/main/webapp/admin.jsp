<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="org.example.demo.dto.UserDTO" %>
<%@ page import="java.util.List" %>
<%@ include file="header.jsp" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Admin</title>
    <link rel="stylesheet" href="misc/style.css">
</head>
<body>
<div class="article" id = "topBar">
    <h1>Users</h1>
</div>
<div class="article-container">
    <%
        List<UserDTO> users = (List<UserDTO>) request.getAttribute("users");
        if (users != null) {
            for (UserDTO user : users) {
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
