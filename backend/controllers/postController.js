const { Op } = require("sequelize");
const { Post, Category, User, UserLike } = require("../models");
const jwt = require('jsonwebtoken');
const { Parser } = require('json2csv');

const secretKey = "abc1234";

const postController = {
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
      options.where.title = { [Op.like]: `%${search}%` };
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
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(post));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
        }
      } catch (error) {
        console.error('Error updating post:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Something went wrong' }));
      }
    });
  },

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

  likePost: async (req, res, id) => {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const decoded = jwt.verify(token, secretKey); // Folosește aceeași cheie secretă
      const userId = decoded.id;

      const post = await Post.findByPk(id);
      if (!post) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
        return;
      }

      const existingLike = await UserLike.findOne({ where: { user_id: userId, post_id: id } });

      if (existingLike) {
        // Dacă utilizatorul a dat deja like, elimină like-ul
        await existingLike.destroy();
        post.likes -= 1;
        await post.save();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ likes: post.likes, liked: false }));
      } else {
        // Dacă utilizatorul nu a dat like, adaugă like-ul
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
      const csv = parser.parse(posts.map(post => post.toJSON())); // Transformă instanțele Sequelize în obiecte simple

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
  }
};

module.exports = postController;
