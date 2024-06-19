const db = require('../config/db');
const querystring = require('querystring');

const articleController = {
    addArticle: (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { title, content, stars, type, cat } = querystring.parse(body);
            console.log('Add article request body:', { title, content, stars, type, cat });

            if (!title || !content || !stars || !type || !cat) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'All fields are required' }));
                return;
            }

            const sql = 'INSERT INTO posts (title, content, stars, type, category_id, poster) VALUES (?, ?, ?, ?, ?, ?)';
            const params = [title, content, stars, type, cat, 'default_poster_value']; // 'default_poster_value' trebuie înlocuit cu valoarea corespunzătoare

            db.query(sql, params, (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Database error' }));
                } else {
                    console.log('Article added:', results);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Article added successfully' }));
                }
            });
        });
    },
    filter: (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { cheie, cat, ordine } = querystring.parse(body);
            console.log('Filter request body:', { cheie, cat, ordine });

            let sql = 'SELECT a.*, c.name as category FROM posts a JOIN categories c ON a.category_id = c.id WHERE c.name = ?';
            let params = [cat];
            if (cheie) {
                sql += ' AND (a.title LIKE ? OR a.content LIKE ?)';
                params.push(`%${cheie}%`, `%${cheie}%`);
            }
            if (ordine === 'ascending') {
                sql += ' ORDER BY a.title ASC';
            } else if (ordine === 'descending') {
                sql += ' ORDER BY a.title DESC';
            } else if (ordine === 'most') {
                sql += ' ORDER BY a.stars DESC';
            }
            console.log('SQL Query:', sql, params);
            db.query(sql, params, (err, results) => {
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
        });
    }
};

module.exports = articleController;
