const db = require('../db');

/**
 * GET /areas
 * Returns all areas with shortage flag
 */
function listAreas() {
  const areas = db.prepare('SELECT * FROM areas ORDER BY name ASC').all();
  return { status: 200, data: areas };
}

/**
 * GET /areas/:id/doctors
 * Returns all doctors in a specific area
 */
function getAreaDoctors(areaId) {
  const area = db.prepare('SELECT * FROM areas WHERE id = ?').get(areaId);
  if (!area) {
    return { status: 404, data: { error: 'Area not found' } };
  }

  const doctors = db.prepare(`
    SELECT d.*, a.name AS area_name
    FROM doctors d
    LEFT JOIN areas a ON d.area_id = a.id
    WHERE d.area_id = ?
    ORDER BY d.name ASC
  `).all(areaId);

  return { status: 200, data: { area, doctors } };
}

/**
 * PUT /areas/:id/shortage
 * Toggle shortage flag (admin only)
 * Body: { shortage: 0 | 1 }
 */
function toggleShortage(areaId, body, user) {
  if (!user || user.role !== 'admin') {
    return { status: 403, data: { error: 'Admin access required' } };
  }

  const area = db.prepare('SELECT * FROM areas WHERE id = ?').get(areaId);
  if (!area) {
    return { status: 404, data: { error: 'Area not found' } };
  }

  const newShortage = body.shortage !== undefined ? (body.shortage ? 1 : 0) : (area.shortage ? 0 : 1);

  db.prepare('UPDATE areas SET shortage = ? WHERE id = ?').run(newShortage, areaId);

  const updated = db.prepare('SELECT * FROM areas WHERE id = ?').get(areaId);
  return { status: 200, data: updated };
}

module.exports = { listAreas, getAreaDoctors, toggleShortage };
