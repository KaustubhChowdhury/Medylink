const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = "medlink_secret_2024";

function sendError(res, status, message) {
  res.writeHead(status);
  res.end(JSON.stringify({ error: message }));
  return true;
}

module.exports = function authRoutes(method, path, body, req, res) {
  if (method === 'POST' && path === '/signup') {
    try {
      const { name, email, password, role } = body;
      if (!name || !email || !password) {
        return sendError(res, 400, "Missing required fields");
      }
      
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existing) {
        return sendError(res, 400, "Email already in use");
      }

      const hash = bcrypt.hashSync(password, 10);
      const insert = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
      insert.run(name, email, hash, role || 'patient');

      res.writeHead(201);
      res.end(JSON.stringify({ message: "User created" }));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  if (method === 'POST' && path === '/login') {
    try {
      const { email, password } = body;
      if (!email || !password) {
        return sendError(res, 400, "Missing required fields");
      }

      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return sendError(res, 401, "Invalid email or password");
      }

      const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, SECRET);
      
      res.writeHead(200);
      res.end(JSON.stringify({
        token,
        user: { id: user.id, name: user.name, role: user.role, email: user.email }
      }));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  return false; // Route not matched
};
