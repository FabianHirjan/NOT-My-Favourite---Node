<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="header.jsp" %>
<%@ page import="java.util.List" %>
<%@ page import="org.example.demo.dto.ArticleDTO" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Account</title>
    <link rel="stylesheet" href="misc/style.css">
</head>
<body>
<div class="account-container">
    <div class="account-info">
        <h2>My Account</h2>
        <img src="misc/photos/maimu.jpeg" alt="Profile Picture" class="profile-picture">
        <h3>Change email</h3>
        <form id="accountForm">
            <label for="email">New email</label>
            <input type="email" id="email" name="email" placeholder="Enter your new email">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password">
            <button type="submit">Update email</button>
        </form>
        <h3>Change password</h3>
        <form id="accountForm">
            <label for="password">New Password</label>
            <input type="password" id="password" name="password" placeholder="Enter new password">
            <label for="email">Current email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email">
            <button type="submit">Update password</button>
        </form>
    </div>
    <div class="reviews-container">
        <h2>My Articles</h2>
        <%
            List<ArticleDTO> userArticles = (List<ArticleDTO>) request.getAttribute("userArticles");
            if (userArticles != null && !userArticles.isEmpty()) {
                for (ArticleDTO article : userArticles) {
        %>
        <div class="article">
            <h3><%= article.getTitle() %></h3>
            <p><%= article.getContent() %></p>
            <form action="delete-article-servlet" method="post">
                <input type="hidden" name="articleId" value="<%= article.getId() %>">
                <button type="submit">Delete post</button>
            </form>
        </div>
        <%
            }
        } else {
        %>
        <p>No articles found.</p>
        <%
            }
        %>
    </div>
</div>
</body>
</html>
