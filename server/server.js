const http = require('http');
const { URL } = require('url');

// ── Route modules ─────────────────────────────────────────────
const { signup, login, verifyToken } = require('./routes/auth');
const { 
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
} = require('./routes/doctors');
const { listAreas, getAreaDoctors, toggleShortage } = require('./routes/areas');
const { bookAppointment, listAppointments, cancelAppointment, getBookedSlots } = require('./routes/appointments');
const { 
  getHistory, 
  addRecord, 
  getPatientHistoryForDoctor, 
  addRecordByDoctor 
} = require('./routes/history');
const { getAdminStats } = require('./routes/admin');

const PORT = 3001;
const ALLOWED_ORIGIN = 'http://localhost:5173';

// ── Parse JSON body helper ────────────────────────────────────
function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

// ── Parse query string from URL ───────────────────────────────
function parseQuery(urlStr) {
  try {
    const url = new URL(urlStr, `http://localhost:${PORT}`);
    const query = {};
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });
    return { pathname: url.pathname, query };
  } catch {
    return { pathname: urlStr, query: {} };
  }
}

// ── CORS helpers ──────────────────────────────────────────────
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// ── Main server ───────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const { pathname, query } = parseQuery(req.url);
  const method = req.method;

  // Extract auth user (for protected routes)
  const user = verifyToken(req.headers.authorization);

  try {
    // ── AUTH ROUTES (public) ──────────────────────────────────

    if (method === 'GET' && pathname.startsWith('/doctor/patient-history/')) {
      const patientId = pathname.split('/').pop();
      const result = getPatientHistoryForDoctor(patientId, user);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'POST' && pathname === '/doctor/add-patient-record') {
      const body = await parseBody(req);
      const result = addRecordByDoctor(body, user);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'GET' && pathname === '/admin/stats') {
      const result = getAdminStats(user);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'POST' && pathname === '/signup') {
      const body = await parseBody(req);
      const result = signup(body);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'POST' && pathname === '/login') {
      const body = await parseBody(req);
      const result = login(body);
      return sendJSON(res, result.status, result.data);
    }

    // ── DOCTOR ROUTES ────────────────────────────────────────

    if (method === 'GET' && pathname === '/admin/pending-doctors') {
      const result = listPendingDoctors(user);
      return sendJSON(res, result.status, result.data);
    }

    const approveDoctorMatch = pathname.match(/^\/admin\/approve-doctor\/(\d+)$/);
    if (method === 'PUT' && approveDoctorMatch) {
      const body = await parseBody(req);
      const result = approveDoctor(parseInt(approveDoctorMatch[1], 10), body, user);
      return sendJSON(res, result.status, result.data);
    }

    const removeDoctorMatch = pathname.match(/^\/admin\/doctors\/(\d+)$/);
    if (method === 'DELETE' && removeDoctorMatch) {
      const result = removeDoctor(parseInt(removeDoctorMatch[1], 10), user);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'GET' && pathname === '/doctor/me') {
      const result = getDoctorProfile(user);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'PUT' && pathname === '/doctor/me') {
      const body = await parseBody(req);
      const result = updateDoctorProfile(body, user);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'GET' && pathname === '/doctor/past-patients') {
      const result = getPastPatients(user);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'GET' && pathname === '/doctor/slots') {
      const result = getSlots(user, query);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'POST' && pathname === '/doctor/slots') {
      const body = await parseBody(req);
      const result = updateSlots(body, user);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'GET' && pathname === '/doctors') {
      const result = listDoctors(query);
      return sendJSON(res, result.status, result.data);
    }

    // GET /doctors/:id
    const doctorMatch = pathname.match(/^\/doctors\/(\d+)$/);
    if (method === 'GET' && doctorMatch) {
      const result = getDoctor(parseInt(doctorMatch[1], 10));
      return sendJSON(res, result.status, result.data);
    }

    // GET /compare?ids=1,2,3
    if (method === 'GET' && pathname === '/compare') {
      const result = compareDoctors(query);
      return sendJSON(res, result.status, result.data);
    }

    // ── AREA ROUTES ──────────────────────────────────────────

    if (method === 'GET' && pathname === '/areas') {
      const result = listAreas();
      return sendJSON(res, result.status, result.data);
    }

    // GET /areas/:id/doctors
    const areaDoctorsMatch = pathname.match(/^\/areas\/(\d+)\/doctors$/);
    if (method === 'GET' && areaDoctorsMatch) {
      const result = getAreaDoctors(parseInt(areaDoctorsMatch[1], 10));
      return sendJSON(res, result.status, result.data);
    }

    // PUT /areas/:id/shortage
    const shortageMatch = pathname.match(/^\/areas\/(\d+)\/shortage$/);
    if (method === 'PUT' && shortageMatch) {
      const body = await parseBody(req);
      const result = toggleShortage(parseInt(shortageMatch[1], 10), body, user);
      return sendJSON(res, result.status, result.data);
    }

    // ── APPOINTMENT ROUTES ───────────────────────────────────

    if (method === 'POST' && pathname === '/book-appointment') {
      const body = await parseBody(req);
      const result = bookAppointment(body, user);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'GET' && pathname === '/appointments') {
      const result = listAppointments(user, query);
      return sendJSON(res, result.status, result.data);
    }

    // PUT /appointments/:id/cancel
    const cancelMatch = pathname.match(/^\/appointments\/(\d+)\/cancel$/);
    if (method === 'PUT' && cancelMatch) {
      const result = cancelAppointment(parseInt(cancelMatch[1], 10), user);
      return sendJSON(res, result.status, result.data);
    }

    // GET /appointments/booked-slots?doctor_id=&date=
    if (method === 'GET' && pathname === '/appointments/booked-slots') {
      const result = getBookedSlots(query);
      return sendJSON(res, result.status, result.data);
    }

    // ── MEDICAL HISTORY ROUTES ───────────────────────────────

    if (method === 'GET' && pathname === '/patient-history') {
      const result = getHistory(user);
      return sendJSON(res, result.status, result.data);
    }

    if (method === 'POST' && pathname === '/add-record') {
      const body = await parseBody(req);
      const result = addRecord(body, user);
      return sendJSON(res, result.status, result.data);
    }

    // ── 404 ──────────────────────────────────────────────────

    sendJSON(res, 404, { error: `Route not found: ${method} ${pathname}` });

  } catch (err) {
    console.error('Server error:', err);
    sendJSON(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 MedLink API server running on http://localhost:${PORT}`);
  console.log(`   CORS allowed origin: ${ALLOWED_ORIGIN}\n`);
  console.log('   Available endpoints:');
  console.log('   POST   /signup');
  console.log('   POST   /login');
  console.log('   GET    /doctors              ?area=&specialty=&maxPrice=&available=&search=');
  console.log('   GET    /doctors/:id');
  console.log('   GET    /compare              ?ids=1,2,3');
  console.log('   GET    /areas');
  console.log('   GET    /areas/:id/doctors');
  console.log('   PUT    /areas/:id/shortage   (admin only)');
  console.log('   POST   /book-appointment     (patient only)');
  console.log('   GET    /appointments');
  console.log('   PUT    /appointments/:id/cancel');
  console.log('   GET    /appointments/booked-slots  ?doctor_id=&date=');
  console.log('   GET    /patient-history');
  console.log('   POST   /add-record           (patient only)');
  console.log('');
});
