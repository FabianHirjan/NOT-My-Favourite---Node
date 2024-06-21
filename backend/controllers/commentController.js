const { Op } = require("sequelize");
const { Comment, User } = require("../models");

const commentController = {
  getAllComments: async (req, res) => {
    try {
      const comments = await Comment.findAll({
        include: {
          model: User,
          attributes: ['username']
        }
      });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(comments));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  getCommentsByPostId: async (req, res, postId) => {
    try {
      const comments = await Comment.findAll({
        where: { post_id: postId },
        include: {
          model: User,
          attributes: ['username']
        }
      });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(comments));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  getCommentById: async (req, res, id) => {
    try {
      const comment = await Comment.findByPk(id, {
        include: {
          model: User,
          attributes: ['username']
        }
      });
      if (comment) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(comment));
      } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Comment not found" }));
      }
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  createComment: async (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const { content, post_id, user_id } = JSON.parse(body);
        const comment = await Comment.create({ content, post_id, user_id });
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(comment));
      } catch (error) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  },

  updateComment: async (req, res, id) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const comment = await Comment.findByPk(id);
        if (comment) {
          const { content, post_id, user_id } = JSON.parse(body);
          comment.content = content;
          comment.post_id = post_id;
          comment.user_id = user_id;
          await comment.save();
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(comment));
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Comment not found" }));
        }
      } catch (error) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  },

  deleteComment: async (req, res, id) => {
    try {
      const comment = await Comment.findByPk(id);
      if (comment) {
        await comment.destroy();
        res.statusCode = 204;
        res.end();
      } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Comment not found" }));
      }
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message }));
    }
  }
};

module.exports = commentController;
