<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    request.setAttribute("activePage", "home");
%>
<jsp:include page="header.jsp" />

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>NoF</title>
    <link rel="stylesheet" href="misc/style.css">
</head>

<body>
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
