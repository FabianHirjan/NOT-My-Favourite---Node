const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    create: (name, email, password, role, callback) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return callback(err);
            const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
            db.query(sql, [name, email, hash, role], (err, result) => {
                if (err) return callback(err);
                callback(null, result);
            });
        });
    },
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    }
};

module.exports = User;
