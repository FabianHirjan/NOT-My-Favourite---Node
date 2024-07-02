const {
    getCategories,
    getCategory,
} = require('../controllers/categoryController');

const categoryRoutes = (req, res) => {
    const urlParts = req.url.split('/');
    const id = urlParts.length > 3 ? urlParts[3] : null;

    if (req.method === "GET" && req.url === "/api/categories") {
        getCategories(req, res);
    } else if (req.method === "GET" && urlParts[2] === "categories" && id) {
        getCategory(req, res, id);
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
};

module.exports = categoryRoutes;
