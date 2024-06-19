const User = require('../models/user');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cookie = require('cookie');

const userController = {
    register: (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { user, email, password } = require('querystring').parse(body);
            User.create(user, email, password, 'user', (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('Eroare la înregistrare');
                } else {
                    res.writeHead(302, { 'Location': '/login.html' });
                    res.end();
                }
            });
        });
    },
    login: (req, res, sessions) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { email, password } = require('querystring').parse(body);
            User.findByEmail(email, (err, user) => {
                if (err) throw err;
                if (user) {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (result) {
                            const sessionId = uuidv4();
                            sessions[sessionId] = user.name;
                            res.setHeader('Set-Cookie', cookie.serialize('session', sessionId, {
                                httpOnly: true,
                                maxAge: 60 * 60 * 24 // 1 zi
                            }));
                            res.writeHead(302, { 'Location': '/index.html' });
                            res.end();
                        } else {
                            res.writeHead(401, { 'Content-Type': 'text/html' });
                            res.end('Autentificare eșuată');
                        }
                    });
                } else {
                    res.writeHead(401, { 'Content-Type': 'text/html' });
                    res.end('Autentificare eșuată');
                }
            });
        });
    },
    logout: (req, res, sessions) => {
        const cookies = cookie.parse(req.headers.cookie || '');
        if (cookies.session && sessions[cookies.session]) {
            delete sessions[cookies.session];
            res.setHeader('Set-Cookie', cookie.serialize('session', '', {
                httpOnly: true,
                maxAge: 0
            }));
        }
        res.writeHead(302, { 'Location': '/index.html' });
        res.end();
    }
};

module.exports = userController;
