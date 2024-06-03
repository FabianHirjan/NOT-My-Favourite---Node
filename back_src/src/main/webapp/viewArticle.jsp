<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>   <!-- Import the List interface -->
<%@ page import="org.example.demo.Article" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>View Article</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<%-- Retrieving the article object set in request by servlet --%>
<jsp:useBean id="article" type="org.example.demo.Article" scope="request" />

<div class="article-details">
    <h1><%= article.getTitle() %></h1>
    <h3>Content:</h3>
    <p><%= article.getContent() %></p>
    <p><strong>Posted by:</strong> <%= article.getPoster() %></p>
    <p><strong>Stars:</strong> <%= article.getStars() %></p>
    <p><strong>Type:</strong> <%= article.getType() %></p>
</div>

<h2>Comments</h2>
<div class="comments">
    <%
        List<String> comments = (List<String>) request.getAttribute("articleComments");
        if (comments != null && !comments.isEmpty()) {
            for (String comment : comments) {
    %>
    <div class="comment">
        <p><%= comment %></p>
    </div>
    <%
        }
    } else {
    %>
    <p>No comments found.</p>
    <%
        }
    %>
</div>

</body>
</html>
