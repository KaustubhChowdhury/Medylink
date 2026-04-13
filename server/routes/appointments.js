const db = require('../db');

function sendError(res, status, message) {
  res.writeHead(status);
  res.end(JSON.stringify({ error: message }));
  return true;
}

module.exports = function appointmentRoutes(method, path, body, req, res) {
  // GET /appointments
  if (method === 'GET' && path === '/appointments') {
    if (!req.user) return sendError(res, 401, "Unauthorized");

    try {
      let query;
      let params = [];
      if (req.user.role === 'patient') {
        query = `
          SELECT appointments.*, doctors.name as doctor_name, doctors.specialty as doctor_specialty 
          FROM appointments 
          JOIN doctors ON appointments.doctor_id = doctors.id 
          WHERE appointments.user_id = ? 
          ORDER BY appointments.date DESC
        `;
        params.push(req.user.id);
      } else if (req.user.role === 'doctor') {
        query = `
          SELECT appointments.*, users.name as patient_name 
          FROM appointments 
          JOIN users ON appointments.user_id = users.id
          WHERE appointments.doctor_id = (SELECT id FROM doctors WHERE user_id = ?)
          ORDER BY appointments.date DESC
        `;
        params.push(req.user.id);
      } else {
        return sendError(res, 403, "Admins don't have appointments");
      }

      const appointments = db.prepare(query).all(...params);
      res.writeHead(200);
      res.end(JSON.stringify(appointments));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  // POST /book-appointment
  if (method === 'POST' && path === '/book-appointment') {
    if (!req.user || req.user.role !== 'patient') return sendError(res, 403, "Patient only");

    try {
      const { doctor_id, date, time } = body;
      if (!doctor_id || !date || !time) return sendError(res, 400, "Missing fields");

      const insert = db.prepare('INSERT INTO appointments (user_id, doctor_id, date, time) VALUES (?, ?, ?, ?)');
      insert.run(req.user.id, doctor_id, date, time);
      res.writeHead(201);
      res.end(JSON.stringify({ message: "Appointment booked" }));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  // PUT /appointments/:id/cancel
  const cancelMatch = path.match(/^\/appointments\/(\d+)\/cancel$/);
  if (method === 'PUT' && cancelMatch) {
    if (!req.user) return sendError(res, 401, "Unauthorized");

    try {
      const apptId = cancelMatch[1];
      const appt = db.prepare('SELECT * FROM appointments WHERE id = ?').get(apptId);
      if (!appt) return sendError(res, 404, "Appointment not found");

      if (req.user.role === 'patient' && appt.user_id !== req.user.id) {
        return sendError(res, 403, "Forbidden");
      }

      db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run('cancelled', apptId);
      res.writeHead(200);
      res.end(JSON.stringify({ message: "Appointment cancelled" }));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  return false;
};
