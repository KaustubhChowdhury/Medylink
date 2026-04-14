const db = require('../db');

/**
 * GET /patient-reports
 * Auth: returns current patient's reports
 */
function getPatientReports(user) {
  if (!user) return { status: 401, data: { error: 'Auth required' } };

  const reports = db.prepare(
    `SELECT pr.*, u.name AS uploader_name 
     FROM patient_reports pr 
     LEFT JOIN users u ON pr.uploaded_by = u.id 
     WHERE pr.user_id = ? 
     ORDER BY pr.id DESC`
  ).all(user.id);

  return { status: 200, data: reports };
}

/**
 * POST /patient-reports
 * Body: { name, type, date, data }
 * Auth: patient uploads their own report
 */
function uploadPatientReport(body, user) {
  if (!user) return { status: 401, data: { error: 'Auth required' } };

  const { name, type, date, data } = body;
  if (!name || !type || !date) {
    return { status: 400, data: { error: 'name, type, date required' } };
  }

  const result = db.prepare(
    'INSERT INTO patient_reports (user_id, uploaded_by, name, type, date, data) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(user.id, user.id, name, type, date, data || '');

  return { status: 201, data: { id: result.lastInsertRowid, success: true } };
}

/**
 * GET /doctor/patient-reports/:userId
 * Auth: doctor only — view a patient's reports
 */
function getPatientReportsForDoctor(patientUserId, user) {
  if (!user || user.role !== 'doctor') {
    return { status: 403, data: { error: 'Unauthorized' } };
  }

  const reports = db.prepare(
    `SELECT pr.*, u.name AS uploader_name 
     FROM patient_reports pr 
     LEFT JOIN users u ON pr.uploaded_by = u.id 
     WHERE pr.user_id = ? 
     ORDER BY pr.id DESC`
  ).all(patientUserId);

  return { status: 200, data: reports };
}

/**
 * POST /doctor/upload-patient-report
 * Body: { patient_user_id, name, type, date, data }
 * Auth: doctor only
 */
function uploadReportByDoctor(body, user) {
  if (!user || user.role !== 'doctor') {
    return { status: 403, data: { error: 'Unauthorized' } };
  }

  const { patient_user_id, name, type, date, data } = body;
  if (!patient_user_id || !name || !type || !date) {
    return { status: 400, data: { error: 'Required fields missing' } };
  }

  db.prepare(
    'INSERT INTO patient_reports (user_id, uploaded_by, name, type, date, data) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(patient_user_id, user.id, name, type, date, data || '');

  return { status: 201, data: { success: true } };
}

module.exports = { 
  getPatientReports, 
  uploadPatientReport, 
  getPatientReportsForDoctor, 
  uploadReportByDoctor 
};
