const { Op } = require("sequelize");
const { Post, Category, User, UserLike } = require("../models");
const { handleRequestBody, verifyToken, secretKey } = require('../utils');
const jwt = require('jsonwebtoken');
const { Parser } = require('json2csv');

const postController = {
  getAllPosts: async (req, res) => {
    const { sort, order, category, search } = req.query || {};

    let options = {
      where: {},
      order: [],
      include: [{ model: User, attributes: ['username'] }, { model: Category, attributes: ['name'] }]
    };

    if (sort && order) options.order.push([sort, order.toUpperCase()]);
    if (category) options.include.push({ model: Category, where: { name: category } });
    if (search) options.where.title = { [Op.like]: `%${search}%` };

    try {
      const posts = await Post.findAll(options);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(posts));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  filterPosts: async (req, res) => {
    const { cheie, cat, ordine } = await handleRequestBody(req);

    let options = {
      where: {},
      order: [],
      include: [{ model: User, attributes: ['username'] }, { model: Category, attributes: ['name'] }]
    };

    if (cat) options.include.push({ model: Category, where: { name: cat } });
    if (cheie) options.where = { [Op.or]: [{ title: { [Op.like]: `%${cheie}%` } }, { content: { [Op.like]: `%${cheie}%` } }] };
    if (ordine) options.order.push(['title', ordine.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']);

    try {
      const posts = await Post.findAll(options);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(posts));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Database error' }));
    }
  },

  getPostById: async (req, res, id) => {
    try {
      const { id: userId } = verifyToken(req);

      const post = await Post.findByPk(id, {
        include: [{ model: User, attributes: ['username'] }, { model: Category, attributes: ['name'] }]
      });

      if (post) {
        const likedByUser = await UserLike.findOne({ where: { user_id: userId, post_id: id } });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ...post.toJSON(), likedByUser: !!likedByUser }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  createPost: async (req, res) => {
    try {
      const { title, content, stars, type, category, user_id } = await handleRequestBody(req);
      const post = await Post.create({ title, content, stars, type, category, user_id });
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(post));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  updatePost: async (req, res, id) => {
    try {
      const { title, content, stars, type, category, user_id } = await handleRequestBody(req);
      const post = await Post.findByPk(id);

      if (post) {
        Object.assign(post, { title, content, stars, type, category, user_id });
        await post.save();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(post));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
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
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  likePost: async (req, res, id) => {
    try {
      const { id: userId } = verifyToken(req);

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
      } else {
        await UserLike.create({ user_id: userId, post_id: id });
        post.likes += 1;
      }

      await post.save();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ likes: post.likes, liked: !existingLike }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  },

  exportPostsCsv: async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [{ model: User, attributes: ['username'] }, { model: Category, attributes: ['name'] }],
        order: [['likes', 'DESC']]
      });

      const fields = ['id', 'title', 'content', 'stars', 'likes', 'username', 'category'];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(posts.map(post => ({
        ...post.toJSON(),
        username: post.User.username,
        category: post.Category.name
      })));

      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="posts.csv"'
      });
      res.end(csv);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong' }));
    }
  }
};

module.exports = postController;
