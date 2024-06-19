const { registerUser, loginUser } = require("../controllers/authController");

/**
 * Handles authentication routes.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const authRoutes = (req, res) => {
    if (req.method === "POST" && req.url === "/api/register") {
        registerUser(req, res);
    } else if (req.method === "POST" && req.url === "/api/login") {
        loginUser(req, res);
    } else {
        res.statusCode = 404;
        res.end("Not found");
    }
};

module.exports = authRoutes;
