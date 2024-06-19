const db = require('../config/db');

const categoryController = {
    getAll: (req, res) => {
        console.log('Received request to /categories');
        const sql = 'SELECT DISTINCT name FROM categories';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Database error' }));
            } else {
                console.log('Database results:', results);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            }
        });
    }
};

module.exports = categoryController;
