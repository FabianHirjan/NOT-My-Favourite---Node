<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="org.example.demo.dto.CategoryDTO" %>
<%@ page import="java.util.List" %>
<%@ page import="org.example.demo.dto.ArticleDTO" %>
<%@ include file="header.jsp" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Articles</title>
    <link rel="stylesheet" href="misc/style.css">
</head>
<body>
<section>
    <form action="article-servlet" method="get">
        <h2>Articles</h2>
        <select name="category">
            <%
                List<CategoryDTO> categories = (List<CategoryDTO>) request.getAttribute("categories");
                if (categories != null && !categories.isEmpty()) {
                    for (CategoryDTO category : categories) {
            %>
            <option value="<%= category.getId() %>"><%= category.getName() %></option>
            <%
                }
            } else {
            %>
            <p>No categories found.</p>
            <%
                }
            %>
        </select>
        <select name="type">
            <option value="physical">Physical</option>
            <option value="nonphy">Non physical</option>
        </select>
        <br>
        <br>
        <button type="submit">Filter by category</button>
    </form>
</section>
<div class="article-container">
    <!-- Content to display articles -->
    <%-- Here you can display the filtered articles --%>
    <%
        List<ArticleDTO> articles = (List<ArticleDTO>) request.getAttribute("articles");
        Boolean isAdmin = (Boolean) session.getAttribute("admin");
        if (articles != null && !articles.isEmpty()) {
            for (ArticleDTO article : articles) {
                if (article.getIsApproved() == 1 || (isAdmin != null && isAdmin)) {
    %>
    <div class="article">
        <h3><%= article.getTitle() %></h3>
        <p><%= article.getContent() %></p>
        <p>Category: <%= article.getCategoryName() %></p>
        <p><a href="view-article-servlet?articleId=<%= article.getId() %>">View Article</a></p>
        <%
            if (isAdmin != null && isAdmin) {
        %>
        <form action="delete-article-servlet" method="post">
            <input type="hidden" name="articleId" value="<%= article.getId() %>">
            <button type="submit">Delete post</button>
        </form>
        <%
            if (article.getIsApproved() == 0) {
        %>
        <form action="approve-article-servlet" method="post">
            <input type="hidden" name="articleId" value="<%= article.getId() %>">
            <button type="submit">Approve</button>
        </form>
        <%
                }
            }
        %>
    </div>
    <%
            }
        }
    } else {
    %>
    <p>No articles found.</p>
    <%
        }
    %>
</div>
</body>
</html>
