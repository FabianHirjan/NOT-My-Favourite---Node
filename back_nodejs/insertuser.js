const mysql = require('mysql');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'city'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectat la baza de date MySQL');

    const email = 'testuser@example.com';
    const name = 'Test User';
    const plainPassword = '1234';
    const role = 'user';

    bcrypt.hash(plainPassword, 10, (err, hash) => {
        if (err) throw err;

        const sql = 'INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [email, name, hash, role], (err, result) => {
            if (err) throw err;
            console.log('Utilizator inserat cu succes');
            db.end();
        });
    });
});
