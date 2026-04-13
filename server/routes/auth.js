const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'medlink_secret_2024';

/**
 * POST /signup
 * Body: { name, email, password, role }
 */
function signup(body) {
  const { name, email, password, role } = body;

  if (!name || !email || !password) {
    return { status: 400, data: { error: 'Name, email, and password are required' } };
  }

  const validRoles = ['patient', 'doctor', 'admin'];
  const userRole = validRoles.includes(role) ? role : 'patient';

  // Check if user already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return { status: 409, data: { error: 'An account with this email already exists' } };
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const result = db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  ).run(name, email, hash, userRole);

  const user = { id: result.lastInsertRowid, name, email, role: userRole };
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

  return { status: 201, data: { token, user } };
}

/**
 * POST /login
 * Body: { email, password }
 */
function login(body) {
  const { email, password } = body;

  if (!email || !password) {
    return { status: 400, data: { error: 'Email and password are required' } };
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return { status: 401, data: { error: 'Invalid email or password' } };
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return { status: 401, data: { error: 'Invalid email or password' } };
  }

  const payload = { id: user.id, role: user.role, name: user.name };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  return {
    status: 200,
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }
  };
}

/**
 * Middleware: verify JWT and return decoded user
 */
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { signup, login, verifyToken };
