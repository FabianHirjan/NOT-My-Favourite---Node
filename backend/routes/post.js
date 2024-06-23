const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    filterPosts,
    likePost,
    exportPostsCsv // adaugă exportPostsCsv aici
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
    } else if (req.method === "GET" && urlParts[2] === "posts" && id && !urlParts[4]) {
        getPostById(req, res, id);
    } else if (req.method === "PUT" && urlParts[2] === "posts" && id) {
        updatePost(req, res, id);
    } else if (req.method === "DELETE" && urlParts[2] === "posts" && id) {
        deletePost(req, res, id);
    } else if (req.method === "POST" && urlParts[2] === "posts" && urlParts[3] === id && urlParts[4] === 'like') {
        likePost(req, res, id);
    } else if (req.method === "GET" && req.url === "/api/posts/export/csv") { // adaugă acest caz
        exportPostsCsv(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
};

module.exports = postRoutes;
