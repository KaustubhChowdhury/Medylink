const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Create Tables ─────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT    NOT NULL,
    email    TEXT    UNIQUE NOT NULL,
    password TEXT    NOT NULL,
    role     TEXT    CHECK(role IN ('patient','doctor','admin'))
                     DEFAULT 'patient'
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS areas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    doctor_count INTEGER DEFAULT 0,
    shortage     INTEGER DEFAULT 0
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS doctors (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER REFERENCES users(id),
    name         TEXT    NOT NULL,
    specialty    TEXT    NOT NULL,
    price        INTEGER NOT NULL,
    area_id      INTEGER REFERENCES areas(id),
    available    INTEGER DEFAULT 1
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER REFERENCES users(id),
    doctor_id  INTEGER REFERENCES doctors(id),
    date       TEXT    NOT NULL,
    time       TEXT    NOT NULL,
    status     TEXT    DEFAULT 'upcoming'
               CHECK(status IN ('upcoming','completed','cancelled'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS medical_history (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER REFERENCES users(id),
    title      TEXT    NOT NULL,
    record     TEXT    NOT NULL,
    condition  TEXT,
    date       TEXT    NOT NULL
  );
`);

module.exports = db;
