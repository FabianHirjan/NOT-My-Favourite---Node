<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="org.example.demo.dto.CategoryDTO" %>
<%@ include file="header.jsp" %>

<%
    if (session.getAttribute("loggedIn") == null) {
        session.setAttribute("errorMessage", "Trebuie sa te loghezi");
        response.sendRedirect("login.jsp");
        return;
    }
%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Post Article</title>
    <link rel="stylesheet" href="misc/style.css">
</head>
<body>

<section>
    <form id="addForm" action="post-servlet" method="post">
        <label for="title">Title:</label>
        <input type="text" name="title" id="title">
        <br>
        <label>Content:</label>
        <textarea id="content" name="content"></textarea>
        <input type="hidden" id="stars" name="stars">

        <!-- Adăugăm selectul pentru categorii -->
        <label for="category">Category:</label>
        <select name="category" id="category">
            <%-- Iterăm prin categoriile disponibile și le afișăm ca opțiuni --%>
            <%
                List<CategoryDTO> categories = (List<CategoryDTO>) request.getAttribute("categories");
                if (categories != null && !categories.isEmpty()) {
                    for (CategoryDTO category : categories) {
            %>
            <option value="<%= category.getId() %>"><%= category.getName() %></option>
            <%
                    }
                }
            %>
        </select>
        <br>

        <!-- Restul formularului -->
        <div id="ratingStars">
            <span class="star" data-value="1">★</span>
            <span class="star" data-value="2">★</span>
            <span class="star" data-value="3">★</span>
            <span class="star" data-value="4">★</span>
            <span class="star" data-value="5">★</span>
        </div>
        <label for="type"><font size="+1">Type: </font></label>
        <select name="type" id="type">
            <option value="physical">Physical</option>
            <option value="nonphy">Non-Physical</option>
        </select>
        <br>
        <button type="submit">Post</button>
    </form>
    <h1><p id="message"></p></h1>
</section>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const stars = document.querySelectorAll('.star');
        const starsInput = document.getElementById('stars');

        stars.forEach(star => {
            star.addEventListener('click', function () {
                const value = parseInt(star.getAttribute('data-value'));
                highlightStars(value);
                starsInput.value = value;
            });
        });

        function highlightStars(value) {
            stars.forEach(star => {
                star.classList.toggle('active', parseInt(star.getAttribute('data-value')) <= value);
            });
        }

        const addForm = document.forms["addForm"];
        addForm.addEventListener('submit', function (event) {
            const inputs = addForm.getElementsByTagName("input");
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].value === '' && inputs[i].type !== 'hidden') {
                    alert("Please fill in all fields.");
                    event.preventDefault();
                    return false;
                }
            }
        });
    });
</script>
</body>
</html>
