<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>   <!-- Import the List interface -->
<%@ page import="org.example.demo.Article" %>
<%@ page import="org.example.demo.Comment" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>View Article</title>
    <link rel="stylesheet" href="misc/style.css">
</head>
<body>

<%
    request.setAttribute("activePage", "viewArticle");
%>
<jsp:include page="header.jsp" />

<div class="article-container">
    <jsp:useBean id="article" type="org.example.demo.Article" scope="request" />

    <div class="article-details">
        <h1><%= article.getTitle() %> - <%= article.getPoster() %></h1>
        <p><%= article.getContent() %></p>
        <p><strong>Stars:</strong>
            <%
                for(int i = 0; i < article.getStars(); i++) {
            %>
            &#9733;
            <%
                }
            %>
        </p>
    </div>

    <h2 class="commentspacing">Comments</h2>
    <div class="comments">
        <%
            List<Comment> comments = (List<Comment>) request.getAttribute("articleComments");
            if (comments != null && !comments.isEmpty()) {
                for (Comment comment : comments) {
        %>
        <div class="comment">
            <p>
                <b class="usr"> <%= comment.getPoster()  %></b>
                <%= comment.getComment() %>
                <i><%= comment.getAgree() %></i>
            </p>
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

    <h2 class="commentspacing">Add Your Comment</h2>
    <div class="add-comment">
        <form action="add-comment-servlet" method="post">
            <textarea class="addcomm" name="comment" placeholder="Add your comment here.."></textarea>
            <input type="hidden" name="articleId" value="<%= article.getId() %>">
            <fieldset>
                <legend>How do you feel about this opinion?</legend>
                <div>
                    <input type="radio" id="agree" name="drone" value="agree" checked />
                    <label for="agree">Agree</label>
                </div>
                <div>
                    <input type="radio" id="disagree" name="drone" value="disagree" />
                    <label for="disagree">Disagree</label>
                </div>
            </fieldset>
            <button type="submit">Submit</button>
        </form>
    </div>
</div>

</body>
</html>