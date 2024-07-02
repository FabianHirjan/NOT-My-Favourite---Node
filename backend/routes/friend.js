const url = require('url');
const { sendFriendRequest, respondToFriendRequest, getIncomingFriendRequests, getFriends, getFriendReviews } = require('../controllers/friendController');

const parseRequestBody = (req, callback) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        callback(JSON.parse(body));
    });
};

const extractParams = (req) => {
    const parsedUrl = url.parse(req.url, true);
    const urlParts = parsedUrl.pathname.split('/');
    req.params = {
        userId: urlParts[3],
        requestId: urlParts[3],
        friendId: urlParts[3]
    };
    req.query = parsedUrl.query || {};
};

const friendRoutes = (req, res) => {
    extractParams(req);

    if (req.method === "POST" && req.url === "/api/friends/request") {
        parseRequestBody(req, (body) => {
            req.body = body;
            sendFriendRequest(req, res);
        });
    } else if (req.method === "POST" && req.url === "/api/friends/respond") {
        parseRequestBody(req, (body) => {
            req.body = body;
            respondToFriendRequest(req, res);
        });
    } else if (req.method === "GET" && req.url.startsWith("/api/friends") && req.url.endsWith("/requests")) {
        getIncomingFriendRequests(req, res);
    } else if (req.method === "GET" && req.url.match(/^\/api\/friends\/\d+\/reviews/)) {
        getFriendReviews(req, res);
    } else if (req.method === "GET" && req.url.match(/^\/api\/friends\/\d+$/)) {
        getFriends(req, res);
    } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
};

module.exports = friendRoutes;
