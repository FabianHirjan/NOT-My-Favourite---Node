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

<div class="header">
    <a href="index.jsp" class="logo">NoF</a>
    <a href="index.jsp">Home</a>
    <a href="filter.jsp">Physical Products</a>
    <a href="N/A">About us</a>
    <a href="nonphy.jsp">Non Physical Products</a>
    <a href="post.jsp">Post my Issue</a>
    <div class="header-right">
        <a href="myaccount.jsp">My account</a>
        <a href="login.jsp" class="active">Log in</a>
    </div>
</div>

<body>
    <section>
    <form id="addForm" name="registerForm" onsubmit="return validateForm()" method="post" action="../index.html">
        <label for="user">Username: </label>
        <input type="text" name="user">
        <br>
        <label for="email">Email:</label>
        <input type="email" name="email">
        <br>
        <label for="password">Password:</label>
        <input type="password" id = "bigger" name="password">
        <p><em>Already have an account? You can <a href = "login.jsp">login here.</a></em></p>
     
        <center><button>Register</button></center>
      </form>

    </section>
      
</body>