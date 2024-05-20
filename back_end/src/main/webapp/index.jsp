<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>NoF</title>
    <link rel="stylesheet" href="misc/style.css">
</head>

<body>
<div class="header">
    <a href="index.jsp" class="logo">NoF</a>
    <a href="index.jsp" class="active">Home</a>
    <a href="filter.jsp">Physical Products</a>
    <a href="nonphy.jsp">Non Physical Products</a>
    <a href="post.jsp">Post my Issue</a>
    <div class="header-right">
        <a href="myaccount.jsp">My account</a>
        <a href="login.jsp">Log in</a>
    </div>
</div>

<div class="article-container">
    <div class="article" id="apartamente">
        <h1>Home appliances, electronics and more</h1>
        <form action="filter.jsp">
            <button class="expand">
                <img src="misc/photos/arrow-right.png" width="50px" alt="Enter" />
            </button>
        </form>
    </div>

    <div class="article" id="cartiere">
        <h1>Company, services and more</h1>
        <form action="nonphy.jsp">
            <button class="expand">
                <img src="misc/photos/arrow-right.png" width="50px" alt="Enter" />
            </button>
        </form>
    </div>
</div>
</body>

</html>
