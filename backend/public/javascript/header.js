document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const userNav = document.getElementById("user-nav");
    const authButtons = document.getElementById("auth-buttons");
    const adminLink = document.getElementById("admin-link");

    if (token) {
        console.log("Token exists");
        userNav.style.display = "block";
        authButtons.style.display = "none";

        const decodedToken = jwt_decode(token);
        console.log("Decoded Token:", decodedToken);

        if (decodedToken.is_admin) {
            adminLink.style.display = "inline";
        }

        document.getElementById("logout").addEventListener("click", function () {
            localStorage.removeItem("token");
            window.location.reload();
        });
    } else {
        console.log("No token found");
        userNav.style.display = "none";
        authButtons.style.display = "block";
    }
});
