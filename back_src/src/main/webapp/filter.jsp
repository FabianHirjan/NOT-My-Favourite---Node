<%@ page import="java.util.List" %>
<%@ page import="org.example.demo.Article" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    request.setAttribute("activePage", "physicalProducts");
%>
<jsp:include page="header.jsp" />
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harta Iași</title>
    <link rel="stylesheet" href="misc/style.css">
</head>
<body>

<center>
    <div class="article" id="search">
        <form action="filter-servlet" method="post">
            <div>
                <label for="cheie"><font size="+1">Search keywords: </font></label>
                <input type="text" id="cheie" name="cheie">
            </div>
            <br>
            <div class="custom-select">
                <label for="cat"><font size="+1">Select category: </font></label>
                <select name="cat" id="cat">
                    <option value="masina">Masina</option>
                </select>
            </div>
            <br>
            <div>
                <label for="subcat"><font size="+1">Select subcategory: </font></label>
                <select name="subcat" id="subcat">
                    <option value="verde">Verde</option>
                </select>
            </div>
            <br>
            <label for="ordine"><font size="+1">Order by: </font></label>
            <select name="ordine" id="ordine">
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
                <option value="most">Most Reviews</option>
            </select>
            <br>
            <button type="submit">Apply filters</button>
        </form>
    </div>
</center>

<div class="article-container">
    <%
        List<Article> physicalArticles = (List<Article>) request.getAttribute("physicalArticles");
        if (physicalArticles != null && !physicalArticles.isEmpty()) {
            for (Article article : physicalArticles) {
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
    <p>No physical articles found.</p>
    <%
        }
    %>
</div>

</body>
</html>