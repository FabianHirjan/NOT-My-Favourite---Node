
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/userController");


const userRoutes = (req, res) => {
    if (req.url === "/users" && req.method === "GET") {
        getAllUsers(req, res);
    } else if (req.url.match(/\/users\/([0-9]+)/) && req.method === "GET") {
        const id = req.url.split("/")[2];
        getUserById(req, res, id);
    } else if (req.url === "/users" && req.method === "POST") {
        createUser(req, res);
    } else if (req.url.match(/\/users\/([0-9]+)/) && req.method === "PUT") {
        const id = req.url.split("/")[2];
        updateUser(req, res, id);
    } else if (req.url.match(/\/users\/([0-9]+)/) && req.method === "DELETE") {
        const id = req.url.split("/")[2];
        deleteUser(req, res, id);
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Route not found" }));
    }
    return true;
}

module.exports = userRoutes;