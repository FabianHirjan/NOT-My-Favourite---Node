<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="header.jsp" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Register form</title>
    <link rel="stylesheet" href="misc/style.css">
    <script>
        function validateForm() {
            var inputs = document.forms["registerForm"].getElementsByTagName("input");
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].value === '') {
                    alert("Please fill in all fields.");
                    return false;
                }
            }
            return true;
        }
    </script>
</head>
<body>
<section>
    <form id="addForm" name="registerForm" onsubmit="return validateForm()" method="post" action="${pageContext.request.contextPath}/register-servlet">
        <label for="name">Username: </label>
        <input type="text" name="name">
        <br>
        <label for="email">Email:</label>
        <input type="email" name="email">
        <br>
        <label for="password">Password:</label>
        <input type="password" id="bigger" name="password">
        <p><em>Already have an account? You can <a href = "login.jsp">login here.</a></em></p>
        <center><button>Register</button></center>
    </form>
</section>
</body>
</html>
