<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Web Practice</title>
    <link rel="stylesheet" href="misc/style.css">
    <script src="misc/script.js"></script>
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
        <form id="addForm" name="loginform" onsubmit="return validateForm()" method="post" action="index.jsp">
            <label for="user">Username: </label>
            <input type="text" name="user">
            <br>
            <label for="password">Password:</label>
            <input type="password" id = "bigger" name="password">
            <p><em>you don't have an account? you can <a href = "register.jsp">register here</a></em></p>
            <center><button>Login</button></center>
          </form>
    </section>
</body>