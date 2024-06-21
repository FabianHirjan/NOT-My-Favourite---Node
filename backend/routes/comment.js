const {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByPostId
} = require('../controllers/commentController');

const commentRoutes = (req, res) => {
    const urlParts = req.url.split('/');
    const id = urlParts.length > 3 ? urlParts[3] : null;

    if (req.method === "GET" && req.url.startsWith("/api/comments")) {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const postId = urlParams.get('post_id');
        if (postId) {
            getCommentsByPostId(req, res, postId);
        } else {
            getAllComments(req, res);
        }
    } else if (req.method === "GET" && urlParts[2] === "comments" && id) {
        getCommentById(req, res, id);
    } else if (req.method === "POST" && req.url === "/api/comments") {
        createComment(req, res);
    } else if (req.method === "PUT" && urlParts[2] === "comments" && id) {
        updateComment(req, res, id);
    } else if (req.method === "DELETE" && urlParts[2] === "comments" && id) {
        deleteComment(req, res, id);
    } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
};

module.exports = commentRoutes;
