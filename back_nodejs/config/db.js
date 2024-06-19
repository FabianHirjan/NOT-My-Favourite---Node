const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'city'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectat la baza de date MySQL');
});

module.exports = db;
