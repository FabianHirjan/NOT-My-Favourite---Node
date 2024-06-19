const { Op } = require("sequelize");
const { Post } = require("../models");

const postController = {
  getAllPosts: async (req, res) => {
    const query = req.query || {};
    const { sort, order, category, search } = query;

    console.log('Query parameters:', query); // Adăugat pentru debug

    let options = {
      where: {},
      order: []
    };

    if (sort && order) {
      options.order.push([sort, order.toUpperCase()]);
    }

    if (category) {
      options.where.category = category;
    }

    if (search) {
      options.where.title = { [Op.like]: `%${search}%` };
    }

    try {
      const posts = await Post.findAll(options);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(posts));
    } catch (error) {
      console.error('Error fetching posts:', error); // Adăugat pentru debug
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },
  getPostById: async (req, res, id) => {
    try {
      const post = await Post.findByPk(id);
      if (post) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(post));
      } else {
        res.statusCode = 404;
        res.end("Not found");
      }
    } catch (error) {
      console.error('Error fetching post by ID:', error); // Adăugat pentru debug
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },
  createPost: async (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const { title, content, stars, type, category, user_id } = JSON.parse(body);
        const post = await Post.create({ title, content, stars, type, category, user_id });
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(post));
      } catch (error) {
        console.error('Error creating post:', error); // Adăugat pentru debug
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Something went wrong' }));
      }
    });
  },
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
          post.title = title;
          post.content = content;
          post.stars = stars;
          post.type = type;
          post.category = category;
          post.user_id = user_id;
          await post.save();
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(post));
        } else {
          res.statusCode = 404;
          res.end("Not found");
        }
      } catch (error) {
        console.error('Error updating post:', error); // Adăugat pentru debug
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Something went wrong' }));
      }
    });
  },
  deletePost: async (req, res, id) => {
    try {
      const post = await Post.findByPk(id);
      if (post) {
        await post.destroy();
        res.statusCode = 204;
        res.end();
      } else {
        res.statusCode = 404;
        res.end("Not found");
      }
    } catch (error) {
      console.error('Error deleting post:', error); // Adăugat pentru debug
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  }
};

module.exports = postController;
