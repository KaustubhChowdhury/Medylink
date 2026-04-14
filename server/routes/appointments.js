const db = require('../db');

/**
 * POST /book-appointment
 * Body: { doctor_id, date, time }
 * Auth: patient only
 */
function bookAppointment(body, user) {
  if (!user) {
    return { status: 401, data: { error: 'Authentication required' } };
  }

  if (user.role !== 'patient') {
    return { status: 403, data: { error: 'Only patients can book appointments' } };
  }

  const { doctor_id, date, time } = body;
  if (!doctor_id || !date || !time) {
    return { status: 400, data: { error: 'doctor_id, date, and time are required' } };
  }

  // Verify doctor exists and is available
  const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(doctor_id);
  if (!doctor) {
    return { status: 404, data: { error: 'Doctor not found' } };
  }
  if (!doctor.available) {
    return { status: 400, data: { error: 'This doctor is currently unavailable' } };
  }

  // Check if slot is already booked
  const existing = db.prepare(
    "SELECT id FROM appointments WHERE doctor_id = ? AND date = ? AND time = ? AND status = 'upcoming'"
  ).get(doctor_id, date, time);

  if (existing) {
    return { status: 409, data: { error: 'This time slot is already booked' } };
  }

  const result = db.prepare(
    'INSERT INTO appointments (user_id, doctor_id, date, time, status) VALUES (?, ?, ?, ?, ?)'
  ).run(user.id, doctor_id, date, time, 'upcoming');

  const appointment = db.prepare(`
    SELECT a.*, d.name AS doctor_name, d.specialty AS doctor_specialty
    FROM appointments a
    LEFT JOIN doctors d ON a.doctor_id = d.id
    WHERE a.id = ?
  `).get(result.lastInsertRowid);

  return { status: 201, data: appointment };
}

/**
 * GET /appointments
 * Auth: returns current user's appointments
 * Query: ?status= (optional filter)
 */
function listAppointments(user, query) {
  if (!user) {
    return { status: 401, data: { error: 'Authentication required' } };
  }

  let sql = `
    SELECT a.*, d.name AS doctor_name, d.specialty AS doctor_specialty,
           d.price AS doctor_price, ar.name AS area_name, 
           u.name AS patient_name, u.email AS patient_email
    FROM appointments a
    LEFT JOIN doctors d ON a.doctor_id = d.id
    LEFT JOIN areas ar ON d.area_id = ar.id
    LEFT JOIN users u ON a.user_id = u.id
  `;
  const params = [];

  if (user.role === 'doctor') {
    const doc = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(user.id);
    if (!doc) return { status: 200, data: [] };
    sql += ' WHERE a.doctor_id = ?';
    params.push(doc.id);
  } else {
    sql += ' WHERE a.user_id = ?';
    params.push(user.id);
  }

  if (query && query.status) {
    sql += ' AND a.status = ?';
    params.push(query.status);
  }

  sql += ' ORDER BY a.date DESC, a.time DESC';

  const appointments = db.prepare(sql).all(...params);
  return { status: 200, data: appointments };
}

/**
 * PUT /appointments/:id/cancel
 * Auth: only the appointment owner
 */
function cancelAppointment(appointmentId, user) {
  if (!user) {
    return { status: 401, data: { error: 'Authentication required' } };
  }

  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(appointmentId);
  if (!appointment) {
    return { status: 404, data: { error: 'Appointment not found' } };
  }

  if (appointment.user_id !== user.id) {
    return { status: 403, data: { error: 'You can only cancel your own appointments' } };
  }

  if (appointment.status !== 'upcoming') {
    return { status: 400, data: { error: 'Only upcoming appointments can be cancelled' } };
  }

  db.prepare("UPDATE appointments SET status = 'cancelled' WHERE id = ?").run(appointmentId);

  const updated = db.prepare(`
    SELECT a.*, d.name AS doctor_name, d.specialty AS doctor_specialty
    FROM appointments a
    LEFT JOIN doctors d ON a.doctor_id = d.id
    WHERE a.id = ?
  `).get(appointmentId);

  return { status: 200, data: updated };
}

/**
 * GET /appointments/booked-slots
 * Query: ?doctor_id=&date=
 * Returns booked time slots for a given doctor on a given date
 */
function getBookedSlots(query) {
  const { doctor_id, date } = query || {};
  if (!doctor_id || !date) {
    return { status: 400, data: { error: 'doctor_id and date are required' } };
  }

  const slots = db.prepare(
    "SELECT time FROM appointments WHERE doctor_id = ? AND date = ? AND status = 'upcoming'"
  ).all(doctor_id, date);

  return { status: 200, data: slots.map(s => s.time) };
}

/**
 * PUT /appointments/:id/complete
 * Auth: doctor only
 */
function completeAppointment(appointmentId, user) {
  if (!user) {
    return { status: 401, data: { error: 'Authentication required' } };
  }

  if (user.role !== 'doctor') {
    return { status: 403, data: { error: 'Only doctors can complete appointments' } };
  }

  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(appointmentId);
  if (!appointment) {
    return { status: 404, data: { error: 'Appointment not found' } };
  }

  if (appointment.status !== 'upcoming') {
    return { status: 400, data: { error: 'Only upcoming appointments can be completed' } };
  }

  db.prepare("UPDATE appointments SET status = 'completed' WHERE id = ?").run(appointmentId);

  return { status: 200, data: { success: true } };
}

module.exports = { bookAppointment, listAppointments, cancelAppointment, completeAppointment, getBookedSlots };
