const db = require('./db');
const bcrypt = require('bcryptjs');

console.log('🌱 Seeding MedLink database...\n');

// ── Helper: check if data exists ────────────────────────────

const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
if (userCount > 0) {
  console.log('⚠️  Database already seeded. Delete database.sqlite to re-seed.');
  process.exit(0);
}

// ── AREAS (6 total) ─────────────────────────────────────────

const insertArea = db.prepare(
  'INSERT INTO areas (name, doctor_count, shortage) VALUES (?, ?, ?)'
);

const areas = [
  ['Koramangala',     8, 0],
  ['Whitefield',      2, 1],
  ['HSR Layout',      5, 0],
  ['Electronic City', 1, 1],
  ['Indiranagar',     6, 0],
  ['Bannerghatta',    0, 1],
];

const insertAreas = db.transaction(() => {
  for (const a of areas) {
    insertArea.run(...a);
  }
});
insertAreas();
console.log(`✅ Inserted ${areas.length} areas`);

// ── USERS (2 patients + 1 admin) ────────────────────────────

const insertUser = db.prepare(
  'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
);

const salt = bcrypt.genSaltSync(10);

const users = [
  ['Demo Patient',   'patient@demo.com',  bcrypt.hashSync('demo1234', salt),  'patient'],
  ['Demo Patient 2', 'patient2@demo.com', bcrypt.hashSync('demo1234', salt),  'patient'],
  ['Admin User',     'admin@demo.com',    bcrypt.hashSync('admin1234', salt), 'admin'],
];

const insertUsers = db.transaction(() => {
  for (const u of users) {
    insertUser.run(...u);
  }
});
insertUsers();
console.log(`✅ Inserted ${users.length} users`);

// ── DOCTORS (8 total) ───────────────────────────────────────

const insertDoctor = db.prepare(
  'INSERT INTO doctors (user_id, name, specialty, price, area_id, available) VALUES (?, ?, ?, ?, ?, ?)'
);

// area_id mapping: 1=Koramangala, 2=Whitefield, 3=HSR, 4=Electronic City, 5=Indiranagar, 6=Bannerghatta
const doctors = [
  [null, 'Dr. Ayesha Khan',  'Cardiologist',       800,  1, 1],
  [null, 'Dr. Rohan Verma',  'General Physician',  300,  3, 1],
  [null, 'Dr. Sneha Pillai', 'Dermatologist',      600,  5, 1],
  [null, 'Dr. Arjun Nair',   'Orthopedic',         900,  2, 1],
  [null, 'Dr. Meera Iyer',   'Pediatrician',       500,  1, 1],
  [null, 'Dr. Kabir Singh',  'Neurologist',        1200, 5, 0],
  [null, 'Dr. Priya Menon',  'Gynecologist',       700,  3, 1],
  [null, 'Dr. Dev Sharma',   'General Physician',  250,  4, 1],
];

const insertDoctors = db.transaction(() => {
  for (const d of doctors) {
    insertDoctor.run(...d);
  }
});
insertDoctors();
console.log(`✅ Inserted ${doctors.length} doctors`);

// ── MEDICAL HISTORY (for patient@demo.com = user_id 1) ──────

const insertHistory = db.prepare(
  'INSERT INTO medical_history (user_id, title, record, condition, date) VALUES (?, ?, ?, ?, ?)'
);

const historyRecords = [
  [1, 'Annual Checkup',     'Full body checkup completed. All vitals normal. BP: 130/85.',           'Hypertension',  '2024-01-15'],
  [1, 'Follow-up Visit',    'Blood pressure still elevated. Adjusted medication dosage.',             'Hypertension',  '2024-03-22'],
  [1, 'Blood Test Results', 'CBC and lipid panel normal. Vitamin D slightly low. Supplements advised.', null,           '2024-06-10'],
  [1, 'Skin Consultation',  'Diagnosed with mild eczema on forearms. Prescribed topical cream.',       'Eczema',        '2024-09-05'],
];

const insertHistoryRecords = db.transaction(() => {
  for (const h of historyRecords) {
    insertHistory.run(...h);
  }
});
insertHistoryRecords();
console.log(`✅ Inserted ${historyRecords.length} medical history records`);

// ── APPOINTMENTS (for patient@demo.com = user_id 1) ─────────

const insertAppointment = db.prepare(
  'INSERT INTO appointments (user_id, doctor_id, date, time, status) VALUES (?, ?, ?, ?, ?)'
);

const appointmentRecords = [
  [1, 1, '2025-02-20', '10:00 AM',  'upcoming'],
  [1, 2, '2024-12-01', '11:30 AM',  'completed'],
  [1, 3, '2024-11-15', '3:00 PM',   'cancelled'],
];

const insertAppointments = db.transaction(() => {
  for (const a of appointmentRecords) {
    insertAppointment.run(...a);
  }
});
insertAppointments();
console.log(`✅ Inserted ${appointmentRecords.length} appointments`);

console.log('\n🎉 Database seeded successfully!');
console.log('   Demo credentials:');
console.log('   Patient:  patient@demo.com  / demo1234');
console.log('   Patient:  patient2@demo.com / demo1234');
console.log('   Admin:    admin@demo.com    / admin1234');
