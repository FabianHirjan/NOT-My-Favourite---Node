<%@ page import="java.util.List" %>
<%@ page import="org.example.demo.Article" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    request.setAttribute("activePage", "articles");
%>
<jsp:include page="header.jsp" />
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Articles</title>
    <link rel="stylesheet" href="misc/style.css">
</head>
<body>

<center>
    <div class="article" id="search">
        <form action="article-servlet" method="get">
            <div>
                <label for="type"><font size="+1">Select type: </font></label>
                <select name="type">
                    <option value="physical">Physical Object</option>
                    <option value="non-physical">Non-Physical Object</option>
                </select>
            </div>
            <br>
            <button type="submit">Apply filters</button>
        </form>
    </div>
</center>

<div class="article-container">
    <%
        List<Article> articles = (List<Article>) request.getAttribute("articles");
        if (articles != null && !articles.isEmpty()) {
            for (Article article : articles) {
    %>
    <div class="article">
        <h3><a href="view-article-servlet?id=<%= article.getId() %>"><%= article.getTitle() %></a></h3>
        <p><%= article.getContent() %></p>
        <p>Posted by: <%= article.getPoster() %></p>
        <p>Stars: <%= article.getStars() %></p>
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


</body>
</html>