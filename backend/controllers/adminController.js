const { User, Post } = require('../models');
const { validateEmail, handleRequestBody, Op } = require('../utils');

const adminController = {
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

    updateUser: async (req, res, id) => {
        try {
            const { username, email, is_admin } = await handleRequestBody(req);
            if (!validateEmail(email)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid email format' }));
                return;
            }

            const conditions = { where: { id: { [Op.ne]: id } } };
            const existingUser = await User.findOne({ ...conditions, where: { username } });
            const existingEmail = await User.findOne({ ...conditions, where: { email } });

            if (existingUser || existingEmail) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: existingUser ? 'Username already exists' : 'Email already exists' }));
                return;
            }

            await User.update({ username, email, is_admin }, { where: { id } });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User updated successfully' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

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

    approvePost: async (req, res, id) => {
        try {
            await Post.update({ approved: true }, { where: { id } });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Post approved successfully' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

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

    updatePost: async (req, res, id) => {
        try {
            const { title, content } = await handleRequestBody(req);
            await Post.update({ title, content }, { where: { id } });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Post updated successfully' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
};

module.exports = adminController;
