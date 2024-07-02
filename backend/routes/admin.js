const { getAllUsers, deleteUser, updateUser, getAllPosts, deletePost, updatePost } = require("../controllers/adminController");

/**
 * Handles admin routes.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const adminRoutes = (req, res) => {
    const { method, url } = req;

    if (method === "GET" && url === "/api/admin/users") {
        getAllUsers(req, res);
    } else if (method === "DELETE" && url.startsWith("/api/admin/users/")) {
        const id = url.split("/")[4];
        deleteUser(req, res, id);
    } else if (method === "PUT" && url.startsWith("/api/admin/users/")) {
        const id = url.split("/")[4];
        updateUser(req, res, id);
    } else if (method === "GET" && url === "/api/admin/posts") {
        getAllPosts(req, res);
    } else if (method === "DELETE" && url.startsWith("/api/admin/posts/")) {
        const id = url.split("/")[4];
        deletePost(req, res, id);
    } else if (method === "PUT" && url.startsWith("/api/admin/posts/")) {
        const id = url.split("/")[4];
        updatePost(req, res, id);
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Route not found" }));
    }
};

module.exports = adminRoutes;
