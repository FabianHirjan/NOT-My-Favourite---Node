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
    <a href="post.jsp" class="active">Post my Issue</a>
    <div class="header-right">
        <a href="myaccount.jsp">My account</a>
        <a href="login.jsp">Log in</a>
    </div>
</div>


<body>
<section>
    <h3>The user has to be logged in, //TODO login and register</h3>
</section>

<section>
    <form id="addForm">
        <label for="titlu">Titlu:</label>
        <input type="text" name="titlu">
        <br>
        <label for="problem">Problema:</label>
        <input type="text" id = "bigger" name="problem">
        <div id="ratingStars">
            <span class="star" data-value="1">&#9733;</span>
            <span class="star" data-value="2">&#9733;</span>
            <span class="star" data-value="3">&#9733;</span>
            <span class="star" data-value="4">&#9733;</span>
            <span class="star" data-value="5">&#9733;</span>
        </div>
        <button>Send</button>
    </form>
    
</section>
    
</body>

</html>