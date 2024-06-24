const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const secretKey = "abc1234";

/**
 * Hashes a password using the SHA256 algorithm.
 *
 * @param {string} password - The password to be hashed.
 * @returns {string} The hashed password.
 */
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

/**
 * Registers a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the registration is complete.
 */
const registerUser = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const { username, email, password, is_admin = false } = JSON.parse(body);
    if (!username || !email || !password) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing fields" }));
      return;
    }

    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        res.statusCode = 409;
        res.setHeader("Content-Type", "application/json");
        res.end(
            JSON.stringify({
              error: "Account with the same username already exists",
            })
        );
        return;
      }

      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        res.statusCode = 409;
        res.setHeader("Content-Type", "application/json");
        res.end(
            JSON.stringify({
              error: "Account with the same email already exists",
            })
        );
        return;
      }

      const hashedPassword = hashPassword(password);
      await User.create({ username, email, password: hashedPassword, is_admin });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Registration successful" }));
    } catch (err) {
      console.error("Error during registration:", err); // Log the error
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Registration failed" }));
    }
  });
};

/**
 * Handles the login functionality for the user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 */
const loginUser = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const { username, password } = JSON.parse(body);
    if (!username || !password) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing fields" }));
      return;
    }

    try {
      const hashedPassword = hashPassword(password);
      console.log("Hashed password:", hashedPassword); // Log hashed password
      const user = await User.findOne({
        where: { username },
      });
      if (user) {
        console.log("User found:", user); // Log user details
        if (user.password === hashedPassword) {
          const token = jwt.sign(
              {
                id: user.id,
                username: user.username,
                is_admin: user.is_admin,
                email : user.email,
              },
              secretKey,
              { expiresIn: "1h" }
          );
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ token }));
        } else {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Invalid credentials" }));
        }
      } else {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Invalid credentials" }));
      }
    } catch (err) {
      console.error("Error during login:", err); // Log the error
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Login failed" }));
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
};
