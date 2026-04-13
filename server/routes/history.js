const db = require('../db');

/**
 * GET /patient-history
 * Auth: returns current user's medical history
 */
function getHistory(user) {
  if (!user) {
    return { status: 401, data: { error: 'Authentication required' } };
  }

  const records = db.prepare(
    'SELECT * FROM medical_history WHERE user_id = ? ORDER BY date DESC'
  ).all(user.id);

  return { status: 200, data: records };
}

/**
 * POST /add-record
 * Body: { title, record, condition, date }
 * Auth: patient only
 */
function addRecord(body, user) {
  if (!user) {
    return { status: 401, data: { error: 'Authentication required' } };
  }

  if (user.role !== 'patient') {
    return { status: 403, data: { error: 'Only patients can add medical records' } };
  }

  const { title, record, condition, date } = body;
  if (!title || !record || !date) {
    return { status: 400, data: { error: 'title, record, and date are required' } };
  }

  const result = db.prepare(
    'INSERT INTO medical_history (user_id, title, record, condition, date) VALUES (?, ?, ?, ?, ?)'
  ).run(user.id, title, record, condition || null, date);

  const newRecord = db.prepare('SELECT * FROM medical_history WHERE id = ?').get(result.lastInsertRowid);

  return { status: 201, data: newRecord };
}

module.exports = { getHistory, addRecord };
