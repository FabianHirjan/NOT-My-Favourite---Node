const { Comment, User } = require("../models");
const { handleRequestBody } = require("../utils");

const commentController = {
  getAllComments: async (req, res) => {
    try {
      const comments = await Comment.findAll({
        include: { model: User, attributes: ['username'] }
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(comments));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  getCommentsByPostId: async (req, res, postId) => {
    try {
      const comments = await Comment.findAll({
        where: { post_id: postId },
        include: { model: User, attributes: ['username'] }
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(comments));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  getCommentById: async (req, res, id) => {
    try {
      const comment = await Comment.findByPk(id, {
        include: { model: User, attributes: ['username'] }
      });
      if (comment) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(comment));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Comment not found" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  createComment: async (req, res) => {
    try {
      const { content, post_id, user_id } = await handleRequestBody(req);
      const comment = await Comment.create({ content, post_id, user_id });
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(comment));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  updateComment: async (req, res, id) => {
    try {
      const { content, post_id, user_id } = await handleRequestBody(req);
      const comment = await Comment.findByPk(id);

      if (comment) {
        comment.content = content;
        comment.post_id = post_id;
        comment.user_id = user_id;
        await comment.save();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(comment));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Comment not found" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  deleteComment: async (req, res, id) => {
    try {
      const comment = await Comment.findByPk(id);
      if (comment) {
        await comment.destroy();
        res.writeHead(204);
        res.end();
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Comment not found" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  }
};

module.exports = commentController;
