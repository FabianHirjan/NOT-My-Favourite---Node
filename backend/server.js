const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { sequelize } = require("./models");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const categoryRoutes = require("./routes/category");
const adminRoutes = require("./routes/admin");
const commentRoutes = require("./routes/comment");
const friendRoutes = require("./routes/friend");

const hostname = "localhost";
const port = 3000;

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const serveStaticFile = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end("File not found");
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", mimeType);
      res.end(data);
    }
  });
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log("Request:", parsedUrl.pathname);
  const sanitizePath = path
    .normalize(parsedUrl.pathname)
    .replace(/^(\.\.[\/\\])+/, "");

  console.log("Sanitized path:", sanitizePath);
  let pathname = path.join(__dirname, "views", sanitizePath);

  if (sanitizePath === path.sep || sanitizePath === '') {
    pathname = path.join(__dirname, "views", "index.html");
  } else if (sanitizePath.startsWith(`${path.sep}public${path.sep}`)) {
    console.log("Public path:", sanitizePath);
    pathname = path.join(__dirname, sanitizePath);
  }

  if (fs.existsSync(pathname) && fs.lstatSync(pathname).isFile()) {
    console.log("Serving static file:", pathname);
    serveStaticFile(res, pathname);
  } else {
    console.log("API request:", parsedUrl.pathname);
    req.query = parsedUrl.query || {};  // Ensure req.query is always an object
    if (parsedUrl.pathname.startsWith("/api/user")) {
      userRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/posts")) {
      postRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/categories")) {
      categoryRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/admin")) {
      adminRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/comments")) {
      commentRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/friends")) {
      friendRoutes(req, res);
    } else {
      authRoutes(req, res);
    }
  }
});

server.listen(port, hostname, async () => {
  try {
    await sequelize.sync();
    console.log(`Server running at http://${hostname}:${port}/`);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
});
