const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserEmail,
    updateUserPassword,
    getUserPosts
} = require('../controllers/userController');

const userRoutes = (req, res) => {
    const urlParts = req.url.split('/');
    const id = urlParts.length > 3 ? urlParts[3] : null;

    if (req.method === "GET" && req.url === "/api/user") {
        getAllUsers(req, res);
    } else if (req.method === "GET" && urlParts[2] === "user" && id && urlParts[4] === "posts") {
        getUserPosts(req, res, id);
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
