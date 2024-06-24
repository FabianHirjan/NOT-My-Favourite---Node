const { Op } = require('sequelize');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const secretKey = "abc1234";

const hashPassword = (password) => {
    return crypto.createHash("sha256").update(password).digest("hex");
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const handleRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => resolve(JSON.parse(body)));
        req.on('error', reject);
    });
};

const verifyToken = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Authorization token missing');
    return jwt.verify(token, secretKey);
};

module.exports = {
    hashPassword,
    validateEmail,
    handleRequestBody,
    verifyToken,
    secretKey
};
