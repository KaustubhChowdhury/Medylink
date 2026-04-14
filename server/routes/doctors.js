const db = require('../db');

/**
 * GET /doctors
 * Query params: ?area=&specialty=&maxPrice=&available=
 */
/**
 * GET /doctors
 * Query params: ?area=&specialty=&maxPrice=&available=&approved=
 */
function listDoctors(query) {
  let sql = `
    SELECT d.*, a.name AS area_name
    FROM doctors d
    LEFT JOIN areas a ON d.area_id = a.id
    WHERE 1=1
  `;
  const params = [];

  // Default to showing only approved doctors unless explicitly requested otherwise (or by admin)
  if (query.approved === 'all') {
    // Show everything
  } else if (query.approved !== undefined) {
    sql += ' AND d.approved = ?';
    params.push(query.approved === '1' || query.approved === 'true' ? 1 : 0);
  } else {
    sql += ' AND d.approved = 1';
  }

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
      INSERT INTO doctors (user_id, name, specialty, price, area_id, available, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(user.id, user.name || 'Doctor', 'General Physician', 500, 1, 0, 0);
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
      INSERT INTO doctors (user_id, name, specialty, price, area_id, available, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(user.id, user.name || 'Doctor', 'General Physician', 500, 1, 0, 0);
  }

  const { available, price, specialty, area_id, name } = body;
  
  let updates = [];
  let params = [];
  if (name !== undefined) {
    updates.push('name = ?');
    params.push(name);
  }
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

/**
 * Admin: GET /admin/pending-doctors
 */
function listPendingDoctors(user) {
  if (!user || user.role !== 'admin') {
    return { status: 403, data: { error: 'Unauthorized' } };
  }
  const doctors = db.prepare(`
    SELECT d.*, a.name AS area_name
    FROM doctors d
    LEFT JOIN areas a ON d.area_id = a.id
    WHERE d.approved = 0
  `).all();
  return { status: 200, data: doctors };
}

/**
 * Admin: PUT /admin/approve-doctor/:id
 */
function approveDoctor(id, body, user) {
  if (!user || user.role !== 'admin') {
    return { status: 403, data: { error: 'Unauthorized' } };
  }
  const { approved } = body;
  db.prepare('UPDATE doctors SET approved = ? WHERE id = ?').run(approved ? 1 : 0, id);
  return { status: 200, data: { success: true } };
}

/**
 * Admin: DELETE /admin/doctors/:id
 */
function removeDoctor(id, user) {
  if (!user || user.role !== 'admin') {
    return { status: 403, data: { error: 'Unauthorized' } };
  }
  db.prepare('DELETE FROM doctors WHERE id = ?').run(id);
  return { status: 200, data: { success: true } };
}

/**
 * GET /doctor/past-patients
 */
function getPastPatients(user) {
  if (!user || user.role !== 'doctor') {
    return { status: 403, data: { error: 'Unauthorized' } };
  }
  const doc = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(user.id);
  if (!doc) return { status: 200, data: [] };

  const patients = db.prepare(`
    SELECT DISTINCT u.id, u.name, u.email, MAX(a.date) as lastVisit
    FROM users u
    JOIN appointments a ON a.user_id = u.id
    WHERE a.doctor_id = ?
    GROUP BY u.id
    ORDER BY lastVisit DESC
  `).all(doc.id);

  return { status: 200, data: patients };
}

/**
 * GET /doctor/slots
 */
function getSlots(user, query) {
  let docId;
  if (user && user.role === 'doctor' && !query.doctor_id) {
    const doc = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(user.id);
    if (!doc) return { status: 404, data: { error: 'Doctor profile not found' } };
    docId = doc.id;
  } else {
    docId = query.doctor_id;
  }

  if (!docId) return { status: 400, data: { error: 'doctor_id required' } };

  const slots = db.prepare('SELECT time, enabled FROM doctor_slots WHERE doctor_id = ?').all(docId);
  return { status: 200, data: slots };
}

/**
 * POST /doctor/slots
 */
function updateSlots(body, user) {
  if (!user || user.role !== 'doctor') {
    return { status: 403, data: { error: 'Unauthorized' } };
  }
  const doc = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(user.id);
  if (!doc) return { status: 404, data: { error: 'Doctor profile not found' } };

  const { slots } = body; // Array of {time, enabled}
  
  const deleteSlots = db.prepare('DELETE FROM doctor_slots WHERE doctor_id = ?');
  const insertSlot = db.prepare('INSERT INTO doctor_slots (doctor_id, time, enabled) VALUES (?, ?, ?)');

  const transaction = db.transaction((slotsData) => {
    deleteSlots.run(doc.id);
    for (const s of slotsData) {
      insertSlot.run(doc.id, s.time, s.enabled ? 1 : 0);
    }
  });

  transaction(slots);

  return { status: 200, data: { success: true } };
}

module.exports = { 
  listDoctors, 
  getDoctor, 
  compareDoctors, 
  getDoctorProfile, 
  updateDoctorProfile,
  listPendingDoctors,
  approveDoctor,
  removeDoctor,
  getPastPatients,
  getSlots,
  updateSlots
};

