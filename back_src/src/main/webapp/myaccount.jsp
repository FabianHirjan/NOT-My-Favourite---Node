<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    request.setAttribute("activePage", "myAccount");
%>
<jsp:include page="header.jsp" />
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Account</title>
    <link rel="stylesheet" href="misc/style.css">
</head>
<body>

    <div class="account-container">
        <div class="account-info">
            <h2>My Account</h2>
            <img src="misc/photos/maimu.jpeg" alt="Profile Picture" class="profile-picture">
            <h3>Change email</h3>
            <form id="accountForm">
                <label for="email">New email</label>
                <input type="email" id="email" name="email" placeholder="Enter your new email">

                <label for="email">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password">

                <button type="submit">Update email</button>
            </form>
            <h3>Change password</h3>
            <form id="accountForm">
                <label for="password">New Password</label>
                <input type="password" id="password" name="password" placeholder="Enter new password">

                <label for="email">Current email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email">

                <button type="submit">Update password</button>
            </form>
        </div>

        <div class="reviews-container">
            <h2>My Reviews</h2>
            <div class="review">
                <h3>Review Title 1</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit libero at ultrices malesuada.</p>
                <button>Update</button>
                <button>Delete</button>
            </div>
            <div class="review">
                <h3>Review Title 2</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit libero at ultrices malesuada.</p>
                <button>Update</button>
                <button>Delete</button>
            </div>
        </div>
    </div>
</body>
</html>