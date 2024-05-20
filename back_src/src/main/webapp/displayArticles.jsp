<%@ page import="org.example.demo.Article" %>
<%@ page import="java.util.List" %><%--
  Created by IntelliJ IDEA.
  User: fabian-andreihirjan
  Date: 20.05.2024
  Time: 18:04
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    List<Article> articles = (List<Article>) request.getAttribute("articles");
    if (articles != null && !articles.isEmpty()) {
        for (Article article : articles) {
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