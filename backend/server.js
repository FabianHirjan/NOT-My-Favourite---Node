const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { sequelize } = require("./models");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const categoryRoutes = require("./routes/category");  // Adăugat import pentru rutele categoriei

const hostname = "localhost";
const port = 3000;

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

/**
 * Serves a static file as a response to the client.
 *
 * @param {Object} res - The response object.
 * @param {string} filePath - The path to the file to be served.
 */
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

/**
 * The HTTP server instance.
 *
 * @type {http.Server}
 */
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
    if (parsedUrl.pathname.startsWith("/api/user")) {
      userRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/posts")) {
      postRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/categories")) {  // Adăugat verificare pentru rutele categoriei
      categoryRoutes(req, res);
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
