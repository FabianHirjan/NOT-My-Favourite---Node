const userController = require('../controllers/userController');
const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');

function handleUserRoutes(req, res, sessions, username) {
    const url = require('url').parse(req.url);
    console.log(`Received ${req.method} request for ${url.pathname}`);
    if (req.method === 'POST' && url.pathname === '/register') {
        userController.register(req, res);
    } else if (req.method === 'POST' && url.pathname === '/login') {
        userController.login(req, res, sessions);
    } else if (req.method === 'GET' && url.pathname === '/logout') {
        userController.logout(req, res, sessions);
    } else if (req.method === 'POST' && url.pathname === '/filter') {
        articleController.filter(req, res);
    } else if (req.method === 'POST' && url.pathname === '/add-article') {
        articleController.addArticle(req, res);
    } else if (req.method === 'GET' && url.pathname === '/categories') {
        categoryController.getAll(req, res);
    } else {
        return false;
    }
    return true;
}

module.exports = handleUserRoutes;
