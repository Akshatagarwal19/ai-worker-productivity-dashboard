import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { timestamp, worker_id, workstation_id, event_type, confidence, count } = req.body;

  if (!timestamp || !worker_id || !event_type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const stmt = db.prepare(`
    INSERT INTO events (timestamp, worker_id, workstation_id, event_type, confidence, count)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    timestamp,
    worker_id,
    workstation_id || null,
    event_type,
    confidence || null,
    count || 0
  );

  res.status(201).json({ message: "Event stored successfully" });
});
router.post('/generate-dummy', (req, res) => {
  db.exec("DELETE FROM events;");

  const now = new Date();
  const baseTime = now.getTime();

  const insert = db.prepare(`
    INSERT INTO events (timestamp, worker_id, workstation_id, event_type, confidence, count)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (let i = 0; i < 6; i++) {
    const worker = `W${i + 1}`;
    const station = `S${i + 1}`;

    // Working event
    insert.run(
      new Date(baseTime + i * 600000).toISOString(),
      worker,
      station,
      "working",
      0.95,
      0
    );

    // Product count event
    insert.run(
      new Date(baseTime + i * 600000 + 300000).toISOString(),
      worker,
      station,
      "product_count",
      0.98,
      Math.floor(Math.random() * 10) + 1
    );

    // Idle event
    insert.run(
      new Date(baseTime + i * 600000 + 500000).toISOString(),
      worker,
      station,
      "idle",
      0.90,
      0
    );
  }

  res.json({ message: "Dummy events generated" });
});
export default router;