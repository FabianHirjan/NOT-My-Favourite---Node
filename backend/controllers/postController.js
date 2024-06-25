const { Op } = require("sequelize");
const { Post, Category, User, UserLike } = require("../models");
const jwt = require('jsonwebtoken');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const RSS = require('rss');

const secretKey = "abc1234";

const postController = {
  /**
   * Fetches all posts with optional sorting, ordering, category filtering, and search.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the posts are fetched.
   */
  getAllPosts: async (req, res) => {
    const query = req.query || {};
    const { sort, order, category, search } = query;

    console.log('Query parameters:', query);

    let options = {
      where: {},
      order: [],
      include: [
        { model: User, attributes: ['username'] },
        { model: Category, attributes: ['name'] }
      ]
    };

    if (sort && order) {
      options.order.push([sort, order.toUpperCase()]);
    }

    if (category) {
      options.include.push({
        model: Category,
        where: { name: category }
      });
    }

    if (search) {
      options.where.title = { [Op.like]: `%{search}%` };
    }

    try {
      const posts = await Post.findAll(options);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(posts));
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  /**
   * Filters posts based on specified criteria in the request body.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the posts are filtered.
   */
  filterPosts: async (req, res) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const { cheie, cat, ordine } = require('querystring').parse(body);
      console.log('Filter request body:', { cheie, cat, ordine });

      let options = {
        where: {},
        order: [],
        include: [
          { model: User, attributes: ['username'] },
          { model: Category, attributes: ['name'] }
        ]
      };

      if (cat) {
        options.include.push({
          model: Category,
          where: { name: cat }
        });
      }

      if (cheie) {
        options.where = {
          [Op.or]: [
            { title: { [Op.like]: `%${cheie}%` } },
            { content: { [Op.like]: `%${cheie}%` } }
          ]
        };
      }

      if (ordine === 'ascending') {
        options.order.push(['title', 'ASC']);
      } else if (ordine === 'descending') {
        options.order.push(['title', 'DESC']);
      } else if (ordine === 'most') {
        options.order.push(['stars', 'DESC']);
      }

      console.log('Sequelize Query Options:', options);

      try {
        const posts = await Post.findAll(options);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(posts));
      } catch (error) {
        console.error('Database error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Database error' }));
      }
    });
  },

  /**
   * Fetches a post by its ID and includes information on whether the post is liked by the user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {number} id - The ID of the post to fetch.
   * @returns {Promise<void>} - A promise that resolves when the post is fetched.
   */
  getPostById: async (req, res, id) => {
    try {
      const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;
      let userId = null;
      if (token) {
        const decoded = jwt.verify(token, secretKey);
        userId = decoded.id;
      }

      const post = await Post.findByPk(id, {
        include: [
          { model: User, attributes: ['username'] },
          { model: Category, attributes: ['name'] }
        ]
      });

      if (post) {
        let likedByUser = false;
        if (userId) {
          const userLike = await UserLike.findOne({ where: { user_id: userId, post_id: id } });
          likedByUser = !!userLike;
        }

        const response = {
          ...post.toJSON(),
          likedByUser: likedByUser
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  /**
   * Creates a new post.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the post is created.
   */
  createPost: async (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const { title, content, stars, type, category, user_id } = JSON.parse(body);
        const post = await Post.create({ title, content, stars, type, category, user_id });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(post));
      } catch (error) {
        console.error('Error creating post:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Something went wrong' }));
      }
    });
  },

  /**
   * Updates a post by its ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {number} id - The ID of the post to update.
   * @returns {Promise<void>} - A promise that resolves when the post is updated.
   */
  updatePost: async (req, res, id) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const post = await Post.findByPk(id);
        if (post) {
          const { title, content, stars, type, category, user_id } = JSON.parse(body);

          post.title = title !== undefined ? title : post.title;
          post.content = content !== undefined ? content : post.content;
          post.stars = stars !== undefined ? stars : post.stars;
          post.type = type !== undefined ? type : post.type;
          post.category = category !== undefined ? category : post.category;
          post.user_id = user_id !== undefined ? user_id : post.user_id;

          await post.save();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(post));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Post not found' }));
        }
      } catch (error) {
        console.error('Error updating post:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Something went wrong' }));
      }
    });
  },

  /**
   * Deletes a post by its ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {number} id - The ID of the post to delete.
   * @returns {Promise<void>} - A promise that resolves when the post is deleted.
   */
  deletePost: async (req, res, id) => {
    try {
      const post = await Post.findByPk(id);
      if (post) {
        await post.destroy();
        res.writeHead(204);
        res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  /**
   * Likes or unlikes a post by its ID based on the user's like status.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {number} id - The ID of the post to like or unlike.
   * @returns {Promise<void>} - A promise that resolves when the like status is updated.
   */
  likePost: async (req, res, id) => {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.id;

      const post = await Post.findByPk(id);
      if (!post) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
        return;
      }

      const existingLike = await UserLike.findOne({ where: { user_id: userId, post_id: id } });

      if (existingLike) {
        await existingLike.destroy();
        post.likes -= 1;
        await post.save();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ likes: post.likes, liked: false }));
      } else {
        await UserLike.create({ user_id: userId, post_id: id });
        post.likes += 1;
        await post.save();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ likes: post.likes, liked: true }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  /**
   * Exports all posts to a CSV file.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the posts are exported.
   */
  exportPostsCsv: async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [
          { model: User, attributes: ['username'] },
          { model: Category, attributes: ['name'] }
        ],
        order: [['likes', 'DESC']]
      });

      const fields = ['id', 'title', 'content', 'stars', 'likes', 'Username', 'Category Name'];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        stars: post.stars,
        likes: post.likes,
        Username: post.User ? post.User.username : 'Unknown',
        'Category Name': post.Category ? post.Category.name : 'Uncategorized'
      })));

      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="posts.csv"'
      });
      res.end(csv);
    } catch (error) {
      console.error('Error exporting posts to CSV:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  /**
   * Exports minimal information of all posts to a JSON file.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the posts are exported.
   */
  exportPostsMinimalJson: async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [
          { model: User, attributes: ['username'] },
          { model: Category, attributes: ['name'] }
        ],
        order: [['likes', 'DESC']]
      });

      const minimalPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        likes: post.likes
      }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(minimalPosts));
    } catch (error) {
      console.error('Error exporting posts to minimal JSON:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  /**
   * Exports all posts to a DocBook XML file.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the posts are exported.
   */
  exportPostsDocBook: async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [
          { model: User, attributes: ['username'] },
          { model: Category, attributes: ['name'] }
        ],
        order: [['likes', 'DESC']]
      });

      let docBookContent = `<?xml version="1.0" encoding="UTF-8"?>\n<book>\n`;
      posts.forEach(post => {
        const postObj = post.toJSON();
        const username = postObj.User ? postObj.User.username : 'Unknown';
        const categoryName = postObj.Category ? postObj.Category.name : 'Uncategorized';

        docBookContent += `
        <chapter>
          <title>${postObj.title}</title>
          <para>${postObj.content}</para>
          <para>Stars: ${postObj.stars}</para>
          <para>Likes: ${postObj.likes}</para>
          <para>User: ${username}</para>
          <para>Category: ${categoryName}</para>
        </chapter>\n`;
      });
      docBookContent += `</book>`;

      res.writeHead(200, {
        'Content-Type': 'application/xml',
        'Content-Disposition': 'attachment; filename="posts.xml"'
      });
      res.end(docBookContent);
    } catch (error) {
      console.error('Error exporting posts to DocBook:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  /**
   * Exports all posts to a PDF file.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the posts are exported.
   */
  exportPostsPdf: async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [
          { model: User, attributes: ['username'] },
          { model: Category, attributes: ['name'] }
        ],
        order: [['likes', 'DESC']]
      });

      const doc = new PDFDocument();
      const filePath = '/tmp/posts.pdf';

      doc.pipe(fs.createWriteStream(filePath));

      posts.forEach(post => {
        const postObj = post.toJSON();
        const username = postObj.User ? postObj.User.username : 'Unknown';
        const categoryName = postObj.Category ? postObj.Category.name : 'Uncategorized';

        doc.fontSize(25).text(postObj.title, { underline: true });
        doc.fontSize(12).text(postObj.content);
        doc.fontSize(12).text(`Stars: ${postObj.stars}`);
        doc.fontSize(12).text(`Likes: ${postObj.likes}`);
        doc.fontSize(12).text(`User: ${username}`);
        doc.fontSize(12).text(`Category: ${categoryName}`);
        doc.moveDown();
      });

      doc.end();

      doc.on('finish', () => {
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="posts.pdf"'
        });
        fs.createReadStream(filePath).pipe(res);
      });
    } catch (error) {
      console.error('Error exporting posts to PDF:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  /**
   * Fetches the top 10 most liked posts.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the posts are fetched.
   */
  getMostLikedPosts: async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [
          { model: User, attributes: ['username'] },
          { model: Category, attributes: ['name'] }
        ],
        order: [['likes', 'DESC']],
        limit: 10
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(posts));
    } catch (error) {
      console.error('Error fetching most liked posts:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  /**
   * Exports the top 10 most liked posts to an RSS feed.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the posts are exported.
   */
  exportMostLikedPostsRSS: async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [
          { model: User, attributes: ['username'] },
          { model: Category, attributes: ['name'] }
        ],
        order: [['likes', 'DESC']],
        limit: 10
      });

      const feed = new RSS({
        title: 'Most Liked Posts',
        description: 'Top 10 most liked posts',
        feed_url: 'http://example.com/rss',
        site_url: 'http://example.com',
        language: 'en',
        pubDate: new Date(),
        ttl: '60'
      });

      posts.forEach(post => {
        feed.item({
          title: post.title,
          description: post.content,
          url: `http://example.com/posts/${post.id}`,
          author: post.User.username,
          date: post.created_at,
          categories: [post.Category.name]
        });
      });

      res.writeHead(200, { 'Content-Type': 'application/rss+xml' });
      res.end(feed.xml({ indent: true }));
    } catch (error) {
      console.error('Error exporting most liked posts to RSS:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  /**
   * Exports the top 10 most liked posts to an HTML file.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the posts are exported.
   */
  exportMostLikedPostsHTML: async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [
          { model: User, attributes: ['username'] },
          { model: Category, attributes: ['name'] }
        ],
        order: [['likes', 'DESC']],
        limit: 10
      });

      let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Most Liked Posts</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .post { margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; }
          .title { font-size: 20px; font-weight: bold; }
          .meta { font-size: 14px; color: #555; }
          .content { margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Top 10 Most Liked Posts</h1>`;

      posts.forEach(post => {
        const username = post.User ? post.User.username : 'Unknown';
        const categoryName = post.Category ? post.Category.name : 'Uncategorized';
        htmlContent += `
        <div class="post">
          <div class="title">${post.title}</div>
          <div class="meta">By ${username} in ${categoryName} - ${post.likes} likes</div>
          <div class="content">${post.content}</div>
        </div>`;
      });

      htmlContent += `
      </body>
      </html>`;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlContent);
    } catch (error) {
      console.error('Error exporting most liked posts to HTML:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },
};

module.exports = postController;
