<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Account</title>
    <link rel="stylesheet" href="misc/style.css">
</head>
<body>
    <div class="header">
        <a href="index.jsp" class="logo">NoF</a>
        <a href="index.jsp">Home</a>
        <a href="filter.jsp">Physical Products</a>
        <a href="N/A">About us</a>
        <a href="nonphy.jsp">Non Physical Products</a>
        <a href="post.jsp">Post my Issue</a>
        <div class="header-right">
            <a href="myaccount.jsp" class="active">My account</a>
            <a href="login.jsp">Log in</a>
        </div>
    </div>

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