<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    request.setAttribute("activePage", "postIssue");
%>

<%
    if (session.getAttribute("loggedIn") == null) {
        session.setAttribute("errorMessage", "Trebuie sa te loghezi");
        response.sendRedirect("login.jsp");
        return;
    }
%>
<jsp:include page="header.jsp" />

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Web Practice</title>
    <link rel="stylesheet" href="misc/style.css">
    <script src="misc/script.js"></script>
</head>
<body>
<section>
    <h3>The user has to be logged in, //TODO login and register</h3>
</section>

<section>
    <form id="addForm" action="post-servlet" method="post">
        <label for="title">Title:</label>
        <input type="text" name="title" id="title">
        <br>
        <label for="content">Problem:</label>
        <input type="text" id="bigger" name="content">
        <input type="hidden" id="stars" name="stars">
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
        <button type="submit">Send</button>
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
            event.preventDefault();
            const inputs = addForm.getElementsByTagName("input");
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].value === '' && inputs[i].type !== 'hidden') {
                    alert("Please fill in all fields.");
                    return false;
                }
            }
            addForm.submit(); // Consider using AJAX for form submission to avoid page reloads
        });
    });
</script>
</body>
</html>
