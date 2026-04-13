const bcrypt = require('bcryptjs');
const db = require('./db');

const areas = [
  { name: 'Koramangala', doctor_count: 8, shortage: 0 },
  { name: 'Whitefield', doctor_count: 2, shortage: 1 },
  { name: 'HSR Layout', doctor_count: 5, shortage: 0 },
  { name: 'Electronic City', doctor_count: 1, shortage: 1 },
  { name: 'Indiranagar', doctor_count: 6, shortage: 0 },
  { name: 'Bannerghatta', doctor_count: 0, shortage: 1 }
];

const users = [
  { name: 'Demo Patient', email: 'patient@demo.com', password: 'demo1234', role: 'patient' },
  { name: 'Demo Patient 2', email: 'patient2@demo.com', password: 'demo1234', role: 'patient' },
  { name: 'Admin', email: 'admin@demo.com', password: 'admin1234', role: 'admin' }
];

const doctors = [
  { name: 'Dr. Ayesha Khan', specialty: 'Cardiologist', price: 800, area: 'Koramangala', available: 1 },
  { name: 'Dr. Rohan Verma', specialty: 'General Physician', price: 300, area: 'HSR Layout', available: 1 },
  { name: 'Dr. Sneha Pillai', specialty: 'Dermatologist', price: 600, area: 'Indiranagar', available: 1 },
  { name: 'Dr. Arjun Nair', specialty: 'Orthopedic', price: 900, area: 'Whitefield', available: 1 },
  { name: 'Dr. Meera Iyer', specialty: 'Pediatrician', price: 500, area: 'Koramangala', available: 1 },
  { name: 'Dr. Kabir Singh', specialty: 'Neurologist', price: 1200, area: 'Indiranagar', available: 0 },
  { name: 'Dr. Priya Menon', specialty: 'Gynecologist', price: 700, area: 'HSR Layout', available: 1 },
  { name: 'Dr. Dev Sharma', specialty: 'General Physician', price: 250, area: 'Electronic City', available: 1 }
];

const medical_history = [
  { title: 'Annual Checkup', record: 'Routine annual checkup. Blood pressure slightly elevated.', condition: 'Hypertension', date: '2024-01-15' },
  { title: 'Follow-up Visit', record: 'Prescribed medication for BP.', condition: 'Hypertension', date: '2024-03-22' },
  { title: 'Blood Test Results', record: 'All levels normal.', condition: 'None', date: '2024-06-10' },
  { title: 'Skin Consultation', record: 'Mild eczema on arms.', condition: 'Eczema', date: '2024-09-05' }
];

const appointments = [
  { status: 'upcoming', doctorName: 'Dr. Ayesha Khan', date: '2025-02-20', time: '10:00 AM' },
  { status: 'completed', doctorName: 'Dr. Rohan Verma', date: '2024-12-01', time: '11:30 AM' },
  { status: 'cancelled', doctorName: 'Dr. Sneha Pillai', date: '2024-11-15', time: '3:00 PM' }
];

db.transaction(() => {
  // Check if users exist to make it idempotent
  const count = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (count > 0) {
    console.log('Database already seeded.');
    return;
  }

  // Seed areas
  const insertArea = db.prepare('INSERT INTO areas (name, doctor_count, shortage) VALUES (?, ?, ?)');
  areas.forEach(area => insertArea.run(area.name, area.doctor_count, area.shortage));

  // Seed users
  const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
  users.forEach(user => {
    const hash = bcrypt.hashSync(user.password, 10);
    insertUser.run(user.name, user.email, hash, user.role);
  });

  // Get patient ID
  const patientId = db.prepare('SELECT id FROM users WHERE email = ?').get('patient@demo.com').id;

  // Seed doctors
  // First, we create user entries for the doctors or just link them to null user_id (since they are only read-only)
  // For demo, we don't necessarily need to create user accounts for the doctors unless specified, but let's create users to be consistent, or just leave user_id NULL. The schema allows NULL since it's not NOT NULL.
  // Actually, I'll let user_id be null for simplicity as they aren't logging in for this demo.
  const insertDoctor = db.prepare('INSERT INTO doctors (user_id, name, specialty, price, area_id, available) VALUES (?, ?, ?, ?, ?, ?)');
  doctors.forEach(doc => {
    const areaId = db.prepare('SELECT id FROM areas WHERE name = ?').get(doc.area).id;
    insertDoctor.run(null, doc.name, doc.specialty, doc.price, areaId, doc.available);
  });

  // Seed medical history
  const insertHistory = db.prepare('INSERT INTO medical_history (user_id, title, record, condition, date) VALUES (?, ?, ?, ?, ?)');
  medical_history.forEach(mh => {
    insertHistory.run(patientId, mh.title, mh.record, mh.condition, mh.date);
  });

  // Seed appointments
  const insertAppt = db.prepare('INSERT INTO appointments (user_id, doctor_id, date, time, status) VALUES (?, ?, ?, ?, ?)');
  appointments.forEach(appt => {
    const docId = db.prepare('SELECT id FROM doctors WHERE name = ?').get(appt.doctorName).id;
    insertAppt.run(patientId, docId, appt.date, appt.time, appt.status);
  });

  console.log('Database seeded successfully.');
})();
