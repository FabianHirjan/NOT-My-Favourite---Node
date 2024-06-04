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

<section class="forsearch">
    <div class="article" id="search">
        <form action="article-servlet" method="get">
            <div>
                <label for="type"><font size="+1">Select type: </font></label>
                <select name="type">
                    <option value="physical">Physical Object</option>
                    <option value="non-physical">Non-Physical Object</option>
                </select>
                <br/>
                <label for="category"><font size="+1">Select category: </font></label>
                <select name="category">
                    <option value="cars">Vehicle</option>
                    <option value="restaurants">Restaurant</option>
                </select>
            </div>
            <br>
            <button type="submit">Search</button>
        </form>
    </div>
</section>

<section>
<div class="article-container">
    <%
        List<Article> articles = (List<Article>) request.getAttribute("articles");
        if (articles != null && !articles.isEmpty()) {
            for (Article article : articles) {
    %>
    <div class="article" id="postare">
        <h3><a href="view-article-servlet?id=<%= article.getId() %>"><%= article.getTitle() %></a></h3>
        <p><%= article.getContent() %></p>
        <p>Posted by: <%= article.getPoster() %></p>
        <p>Stars: <%= article.getStars() %></p>
    </div>
    <%
        }
    } else {
    %>
    <div class="article" id="search">
    <p>No articles found.</p>
    </div>
    <%
        }
    %>
</div>
</section>

</body>
</html>