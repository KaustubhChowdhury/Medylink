const db = require('../db');

function sendError(res, status, message) {
  res.writeHead(status);
  res.end(JSON.stringify({ error: message }));
  return true;
}

module.exports = function historyRoutes(method, path, body, req, res) {
  // GET /patient-history
  if (method === 'GET' && path === '/patient-history') {
    if (!req.user) return sendError(res, 401, "Unauthorized");

    try {
      const history = db.prepare('SELECT * FROM medical_history WHERE user_id = ? ORDER BY date DESC').all(req.user.id);
      res.writeHead(200);
      res.end(JSON.stringify(history));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  // POST /add-record
  if (method === 'POST' && path === '/add-record') {
    if (!req.user || req.user.role !== 'patient') return sendError(res, 403, "Patient only");

    try {
      const { title, record, condition, date } = body;
      if (!title || !record || !date) return sendError(res, 400, "Missing required fields");

      const insert = db.prepare('INSERT INTO medical_history (user_id, title, record, condition, date) VALUES (?, ?, ?, ?, ?)');
      insert.run(req.user.id, title, record, condition || 'None', date);

      res.writeHead(201);
      res.end(JSON.stringify({ message: "Record added" }));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  return false;
};
