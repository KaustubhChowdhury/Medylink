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

module.exports = { listDoctors, getDoctor, compareDoctors };
