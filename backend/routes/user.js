const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserEmail,
    updateUserPassword,
    getCurrentUser,
    getUserReviews
} = require('../controllers/userController');
const url = require('url');

const userRoutes = (req, res) => {
    const parsedUrl = url.parse(req.url, true); // Parse URL with query parameters
    const urlParts = parsedUrl.pathname.split('/');
    const id = urlParts.length > 3 ? urlParts[3] : null;
    const page = parsedUrl.query.page ? parseInt(parsedUrl.query.page, 10) : 1;

    console.log("URL Parts: ", urlParts);
    console.log("Page: ", page, "ID: ", id, "URL: ", req.url);

    if (req.method === "GET" && req.url === "/api/user") {
        getAllUsers(req, res);
    } else if (req.method === "GET" && req.url === "/api/user/me") {
        getCurrentUser(req, res);
    } else if (req.method === "GET" && urlParts[2] === "user" && id && urlParts[4] === "reviews") {
        console.log('user reviews');
        getUserReviews(req, res, id, page);
    } else if (req.method === "GET" && urlParts[2] === "user" && id) {
        getUserById(req, res, id);
    } else if (req.method === "POST" && req.url === "/api/user") {
        createUser(req, res);
    } else if (req.method === "PUT" && urlParts[2] === "user" && id) {
        updateUser(req, res, id);
    } else if (req.method === "DELETE" && urlParts[2] === "user" && id) {
        deleteUser(req, res, id);
    } else if (req.method === "POST" && req.url === "/api/user/updateEmail") {
        updateUserEmail(req, res);
    } else if (req.method === "POST" && req.url === "/api/user/updatePassword") {
        updateUserPassword(req, res);
    } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
};

module.exports = userRoutes;