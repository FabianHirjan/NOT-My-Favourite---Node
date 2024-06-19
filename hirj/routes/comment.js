const { getAllComments, getCommentById, createComment, updateComment, deleteComment } = require("../controllers/commentController");

const commentRoutes = (req, res) => {
    if (req.url === "/comments" && req.method === "GET") {
        getAllComments(req, res);
    } else if (req.url.match(/\/comments\/([0-9]+)/) && req.method === "GET") {
        const id = req.url.split("/")[2];
        getCommentById(req, res, id);
    } else if (req.url === "/comments" && req.method === "POST") {
        createComment(req, res);
    } else if (req.url.match(/\/comments\/([0-9]+)/) && req.method === "PUT") {
        const id = req.url.split("/")[2];
        updateComment(req, res, id);
    } else if (req.url.match(/\/comments\/([0-9]+)/) && req.method === "DELETE") {
        const id = req.url.split("/")[2];
        deleteComment(req, res, id);
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Route not found" }));
    }
    return true;
}

module.exports = commentRoutes;
