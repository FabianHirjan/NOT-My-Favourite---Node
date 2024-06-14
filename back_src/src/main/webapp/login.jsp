<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="header.jsp" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Web Practice</title>
    <link rel="stylesheet" href="misc/style.css">
    <script src="misc/script.js"></script>
    <script>
        function validateForm() {
            return true;
        }

        async function handleFormSubmit(event) {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            const data = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    window.location.href = 'index.jsp';
                } else {
                    const errorData = await response.json();
                    alert(errorData.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            const form = document.getElementById('loginForm');
            form.addEventListener('submit', handleFormSubmit);
        });
    </script>
</head>
<body>
<section>
    <form id="loginForm" name="loginform" onsubmit="return validateForm()" method="post" action="api/login">
        <label for="email">Email: </label>
        <input type="email" name="email" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" id="bigger" name="password" required>
        <p><em>Don't have an account? <a href="register.jsp">Register here</a></em></p>
        <center><button type="submit">Login</button></center>
    </form>
</section>
</body>
</html>
