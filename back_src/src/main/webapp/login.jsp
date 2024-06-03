<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    request.setAttribute("activePage", "login");
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
        <form id="addForm" name="loginform" onsubmit="return validateForm()" method="post" action="login-servlet">
            <label for="email">Email: </label>
            <input type="email" name="email">
            <br>
            <label for="password">Password:</label>
            <input type="password" id = "bigger" name="password">
            <p><em>you don't have an account? you can <a href = "register.jsp">register here</a></em></p>
            <center><button>Login</button></center>
          </form>
    </section>
</body>