import Database from 'better-sqlite3';

const db = new Database('factory.db');

db.exec(`
CREATE TABLE IF NOT EXISTS workers (
  worker_id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workstations (
  station_id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  worker_id TEXT,
  workstation_id TEXT,
  event_type TEXT,
  confidence REAL,
  count INTEGER DEFAULT 0
);
`);

export default db;