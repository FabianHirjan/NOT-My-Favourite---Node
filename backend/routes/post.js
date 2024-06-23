const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    filterPosts,
    likePost
} = require("../controllers/postController");

const postRoutes = (req, res) => {
    const urlParts = req.url.split('/');
    const id = urlParts.length > 3 ? urlParts[3] : null;

    if (req.method === "GET" && req.url === "/api/posts") {
        getAllPosts(req, res);
    } else if (req.method === "POST" && req.url === "/api/posts/create") {
        createPost(req, res);
    } else if (req.method === "POST" && req.url === "/api/posts/filter") {
        filterPosts(req, res);
    } else if (req.method === "GET" && urlParts[2] === "posts" && id) {
        getPostById(req, res, id);
    } else if (req.method === "PUT" && urlParts[2] === "posts" && id) {
        updatePost(req, res, id);
    } else if (req.method === "DELETE" && urlParts[2] === "posts" && id) {
        deletePost(req, res, id);
    } else if (req.method === "POST" && urlParts[2] === "posts" && urlParts[3] === id && urlParts[4] === 'like') {
        likePost(req, res, id);
    } else {
        res.statusCode = 404;
        res.end("Not found");
    }
};

module.exports = postRoutes;
