/**
 * Admin Controller
 *
 * @description Controller for managing users and posts in the application.
 */

const { User, Post } = require('../models');
const { Op } = require('sequelize');

const adminController = {
    /**
     * Get all users.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({ order: [['id', 'ASC']] });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    /**
     * Delete a user by ID.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {number} id - The ID of the user to delete.
     */
    deleteUser: async (req, res, id) => {
        try {
            await User.destroy({ where: { id } });
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end();
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    /**
     * Update a user by ID.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {number} id - The ID of the user to update.
     */
    updateUser: async (req, res, id) => {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                const { username, email, is_admin } = JSON.parse(body);

                if (!validateEmail(email)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid email format' }));
                    return;
                }

                const existingUser = await User.findOne({ where: { username, id: { [Op.ne]: id } } });
                if (existingUser) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Username already exists' }));
                    return;
                }

                const existingEmail = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
                if (existingEmail) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Email already exists' }));
                    return;
                }

                await User.update({ username, email, is_admin }, { where: { id } });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User updated successfully' }));
            });
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    /**
     * Get all posts.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.findAll();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(posts));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    /**
     * Delete a post by ID.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {number} id - The ID of the post to delete.
     */
    deletePost: async (req, res, id) => {
        try {
            await Post.destroy({ where: { id } });
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end();
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    /**
     * Update a post by ID.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {number} id - The ID of the post to update.
     */
    updatePost: async (req, res, id) => {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                const { title, content } = JSON.parse(body);
                await Post.update({ title, content }, { where: { id } });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Post updated successfully' }));
            });
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
};

/**
 * Validate email format.
 *
 * @param {string} email - The email to validate.
 * @returns {boolean} - Returns true if the email format is valid, otherwise false.
 */
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

module.exports = adminController;
