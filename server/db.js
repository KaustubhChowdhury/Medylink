const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

db.exec(`
-- USERS
CREATE TABLE IF NOT EXISTS users (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT    NOT NULL,
  email    TEXT    UNIQUE NOT NULL,
  password TEXT    NOT NULL,          -- bcrypt hash
  role     TEXT    CHECK(role IN ('patient','doctor','admin'))
                   DEFAULT 'patient'
);

-- AREAS
CREATE TABLE IF NOT EXISTS areas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  doctor_count INTEGER DEFAULT 0,
  shortage     INTEGER DEFAULT 0      -- 1 = shortage flagged
);

-- DOCTORS
CREATE TABLE IF NOT EXISTS doctors (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER REFERENCES users(id),
  name         TEXT    NOT NULL,
  specialty    TEXT    NOT NULL,
  price        INTEGER NOT NULL,      -- consultation fee in INR
  area_id      INTEGER REFERENCES areas(id),
  available    INTEGER DEFAULT 1      -- 1 = available, 0 = unavailable
);

-- APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id),
  doctor_id  INTEGER REFERENCES doctors(id),
  date       TEXT    NOT NULL,        -- ISO date string YYYY-MM-DD
  time       TEXT    NOT NULL,        -- e.g. "10:30 AM"
  status     TEXT    DEFAULT 'upcoming'
             CHECK(status IN ('upcoming','completed','cancelled'))
);

-- MEDICAL_HISTORY
CREATE TABLE IF NOT EXISTS medical_history (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id),
  title      TEXT    NOT NULL,        -- e.g. "Routine Checkup"
  record     TEXT    NOT NULL,        -- free text notes
  condition  TEXT,                    -- e.g. "Hypertension"
  date       TEXT    NOT NULL         -- ISO date string
);
`);

module.exports = db;
