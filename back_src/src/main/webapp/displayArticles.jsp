<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="org.example.demo.dto.ArticleDTO" %>
<%@ page import="java.util.List" %>

<%
    request.setAttribute("activePage", "articles");
%>
<jsp:include page="header.jsp" />

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Display Articles</title>
    <link rel="stylesheet" href="misc/style.css">
</head>
<body>

<section class="article-section">
    <%
        List<ArticleDTO> articles = (List<ArticleDTO>) request.getAttribute("articles");
        if (articles != null && !articles.isEmpty()) {
            for (ArticleDTO article : articles) {
    %>
    <div class="article">
        <h3><%= article.getTitle() %></h3>
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
</section>

</body>
</html>
