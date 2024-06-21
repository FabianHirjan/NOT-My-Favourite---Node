const { getAllUsers, deleteUser, updateUser, getAllPosts, approvePost, deletePost, updatePost } = require("../controllers/adminController");

const adminRoutes = async (req, res) => {
    if (req.url === "/api/admin/users" && req.method === "GET") {
        await getAllUsers(req, res);
    } else if (req.url.match(/\/api\/admin\/users\/([0-9]+)/) && req.method === "DELETE") {
        const id = req.url.split("/")[4];
        await deleteUser(req, res, id);
    } else if (req.url.match(/\/api\/admin\/users\/([0-9]+)/) && req.method === "PUT") {
        const id = req.url.split("/")[4];
        await updateUser(req, res, id);
    } else if (req.url === "/api/admin/posts" && req.method === "GET") {
        await getAllPosts(req, res);
    } else if (req.url.match(/\/api\/admin\/posts\/([0-9]+)\/approve/) && req.method === "PUT") {
        const id = req.url.split("/")[4];
        await approvePost(req, res, id);
    } else if (req.url.match(/\/api\/admin\/posts\/([0-9]+)/) && req.method === "DELETE") {
        const id = req.url.split("/")[4];
        await deletePost(req, res, id);
    } else if (req.url.match(/\/api\/admin\/posts\/([0-9]+)/) && req.method === "PUT") {
        const id = req.url.split("/")[4];
        await updatePost(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
};

module.exports = adminRoutes;
