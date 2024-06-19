const http = require('http');
const fs = require('fs');
const path = require('path');
const handleUserRoutes = require('./routes/userRoutes');
const cookie = require('cookie');
const { v4: uuidv4 } = require('uuid'); // Asigură-te că uuid este importat aici

const sessions = {}; // Definim variabila sessions

const server = http.createServer((req, res) => {
    const parsedUrl = require('url').parse(req.url);
    const pathname = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;

    // Verificăm dacă utilizatorul este autentificat
    const cookies = cookie.parse(req.headers.cookie || '');
    const isAuthenticated = cookies.session && sessions[cookies.session];
    const username = isAuthenticated ? sessions[cookies.session] : null;

    // Injectăm starea de autentificare în răspunsurile HTML
    if (handleUserRoutes(req, res, sessions, username)) {
        return;
    }

    let filePath = path.join(__dirname, pathname.startsWith('/public') ? pathname : `views${pathname}`);
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, 'utf8', (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, 'views', '404.html'), 'utf8', (error, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            if (contentType === 'text/html') {
                // Injectăm starea de autentificare în conținutul HTML
                content = content.replace('{username}', username ? `<a>Welcome, ${username} </a>` : '');
                content = content.replace('{auth-links}', isAuthenticated ? '<a href="/logout">Log out</a>' : '<a href="login.html">Log in</a>');
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});
