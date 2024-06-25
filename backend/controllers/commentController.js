const { Op } = require("sequelize");
const { Comment, User } = require("../models");

const commentController = {
  /**
   * Fetches all comments with their associated user information.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the comments are fetched.
   */
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

  /**
   * Fetches comments by post ID with their associated user information.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {number} postId - The ID of the post for which to fetch comments.
   * @returns {Promise<void>} - A promise that resolves when the comments are fetched.
   */
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

  /**
   * Fetches a comment by ID with its associated user information.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {number} id - The ID of the comment to fetch.
   * @returns {Promise<void>} - A promise that resolves when the comment is fetched.
   */
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

  /**
   * Creates a new comment.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the comment is created.
   */
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

  /**
   * Updates a comment by ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {number} id - The ID of the comment to update.
   * @returns {Promise<void>} - A promise that resolves when the comment is updated.
   */
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

  /**
   * Deletes a comment by ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {number} id - The ID of the comment to delete.
   * @returns {Promise<void>} - A promise that resolves when the comment is deleted.
   */
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
