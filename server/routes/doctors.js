const db = require('../db');

/**
 * GET /doctors
 * Query params: ?area=&specialty=&maxPrice=&available=
 */
function listDoctors(query) {
  let sql = `
    SELECT d.*, a.name AS area_name
    FROM doctors d
    LEFT JOIN areas a ON d.area_id = a.id
    WHERE 1=1
  `;
  const params = [];

  if (query.area) {
    sql += ' AND d.area_id = ?';
    params.push(query.area);
  }

  if (query.specialty) {
    sql += ' AND LOWER(d.specialty) LIKE ?';
    params.push(`%${query.specialty.toLowerCase()}%`);
  }

  if (query.maxPrice) {
    sql += ' AND d.price <= ?';
    params.push(parseInt(query.maxPrice, 10));
  }

  if (query.available === '1' || query.available === 'true') {
    sql += ' AND d.available = 1';
  }

  if (query.search) {
    sql += ' AND (LOWER(d.name) LIKE ? OR LOWER(d.specialty) LIKE ?)';
    const term = `%${query.search.toLowerCase()}%`;
    params.push(term, term);
  }

  sql += ' ORDER BY d.name ASC';

  const doctors = db.prepare(sql).all(...params);
  return { status: 200, data: doctors };
}

/**
 * GET /doctors/:id
 */
function getDoctor(id) {
  const doctor = db.prepare(`
    SELECT d.*, a.name AS area_name
    FROM doctors d
    LEFT JOIN areas a ON d.area_id = a.id
    WHERE d.id = ?
  `).get(id);

  if (!doctor) {
    return { status: 404, data: { error: 'Doctor not found' } };
  }

  return { status: 200, data: doctor };
}

/**
 * GET /compare?ids=1,2,3
 */
function compareDoctors(query) {
  const idsParam = query.ids;
  if (!idsParam) {
    return { status: 400, data: { error: 'Provide doctor IDs as ?ids=1,2,3' } };
  }

  const ids = idsParam.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
  if (ids.length === 0) {
    return { status: 400, data: { error: 'No valid doctor IDs provided' } };
  }

  if (ids.length > 5) {
    return { status: 400, data: { error: 'Maximum 5 doctors for comparison' } };
  }

  const placeholders = ids.map(() => '?').join(',');
  const doctors = db.prepare(`
    SELECT d.*, a.name AS area_name
    FROM doctors d
    LEFT JOIN areas a ON d.area_id = a.id
    WHERE d.id IN (${placeholders})
  `).all(...ids);

  return { status: 200, data: doctors };
}

/**
 * GET /doctor/me
 */
function getDoctorProfile(user) {
  if (!user || user.role !== 'doctor') {
    return { status: 403, data: { error: 'Unauthorized' } };
  }
  let doctor = db.prepare(`
    SELECT d.*, a.name AS area_name
    FROM doctors d
    LEFT JOIN areas a ON d.area_id = a.id
    WHERE d.user_id = ?
  `).get(user.id);
  
  if (!doctor) {
    // Self-healing: create the doctor entry
    db.prepare(`
      INSERT INTO doctors (user_id, name, specialty, price, area_id, available)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(user.id, user.name || 'Doctor', 'General Physician', 500, 1, 0);
    doctor = db.prepare(`
      SELECT d.*, a.name AS area_name
      FROM doctors d
      LEFT JOIN areas a ON d.area_id = a.id
      WHERE d.user_id = ?
    `).get(user.id);
  }
  return { status: 200, data: doctor };
}

/**
 * PUT /doctor/me
 */
function updateDoctorProfile(body, user) {
  if (!user || user.role !== 'doctor') {
    return { status: 403, data: { error: 'Unauthorized' } };
  }
  let doctor = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(user.id);
  if (!doctor) {
     db.prepare(`
      INSERT INTO doctors (user_id, name, specialty, price, area_id, available)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(user.id, user.name || 'Doctor', 'General Physician', 500, 1, 0);
  }

  const { available, price, specialty, area_id } = body;
  
  let updates = [];
  let params = [];
  if (available !== undefined) {
    updates.push('available = ?');
    params.push(available ? 1 : 0);
  }
  if (price !== undefined) {
    updates.push('price = ?');
    params.push(parseInt(price, 10));
  }
  if (specialty !== undefined) {
    updates.push('specialty = ?');
    params.push(specialty);
  }
  if (area_id !== undefined) {
    updates.push('area_id = ?');
    params.push(parseInt(area_id, 10));
  }

  if (updates.length > 0) {
    const sql = `UPDATE doctors SET ${updates.join(', ')} WHERE user_id = ?`;
    params.push(user.id);
    db.prepare(sql).run(...params);
  }

  return getDoctorProfile(user);
}

module.exports = { listDoctors, getDoctor, compareDoctors, getDoctorProfile, updateDoctorProfile };
