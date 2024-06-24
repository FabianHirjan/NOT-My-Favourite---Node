const { User, Post } = require("../models");
const { hashPassword, handleRequestBody, validateEmail, verifyToken } = require("../utils");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  getUserById: async (req, res, id) => {
    try {
      const user = await User.findByPk(id);
      if (user) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, email, password, is_admin = false } = await handleRequestBody(req);
      if (!username || !email || !password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing fields" }));
        return;
      }

      const conditions = { where: { [Op.or]: [{ username }, { email }] } };
      const existingUser = await User.findOne(conditions);

      if (existingUser) {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Username or email already exists" }));
        return;
      }

      const hashedPassword = hashPassword(password);
      await User.create({ username, email, password: hashedPassword, is_admin });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User created successfully" }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User creation failed" }));
    }
  },

  updateUser: async (req, res, id) => {
    try {
      const { username, email, password, is_admin } = await handleRequestBody(req);
      const user = await User.findByPk(id);

      if (user) {
        const updateData = { username, email, is_admin };
        if (password) updateData.password = hashPassword(password);
        await user.update(updateData);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  deleteUser: async (req, res, id) => {
    try {
      const user = await User.findByPk(id);
      if (user) {
        await user.destroy();
        res.writeHead(204, { "Content-Type": "application/json" });
        res.end();
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  updateUserEmail: async (req, res) => {
    try {
      const { email, password } = await handleRequestBody(req);
      const { id: userId } = verifyToken(req);

      const user = await User.findByPk(userId);
      if (user && user.password === hashPassword(password)) {
        await user.update({ email });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Email updated successfully" }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid credentials" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Email update failed" }));
    }
  },

  updateUserPassword: async (req, res) => {
    try {
      const { newPassword, oldPassword } = await handleRequestBody(req);
      const { id: userId } = verifyToken(req);

      const user = await User.findByPk(userId);
      if (user && user.password === hashPassword(oldPassword)) {
        await user.update({ password: hashPassword(newPassword) });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Password updated successfully" }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid credentials" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Password update failed" }));
    }
  },

  getUserPosts: async (req, res, userId) => {
    try {
      const posts = await Post.findAll({ where: { user_id: userId } });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(posts));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  }
};

module.exports = userController;
