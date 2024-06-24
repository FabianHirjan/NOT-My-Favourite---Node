const { User, Post } = require('../models');
const { Op } = require('sequelize');

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

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

module.exports = adminController;
