import db from './db.js';

const workers = [
  { id: "W1", name: "Ravi" },
  { id: "W2", name: "Amit" },
  { id: "W3", name: "Suresh" },
  { id: "W4", name: "Karan" },
  { id: "W5", name: "Imran" },
  { id: "W6", name: "Vikram" }
];

const stations = [
  { id: "S1", name: "Assembly" },
  { id: "S2", name: "Packaging" },
  { id: "S3", name: "Inspection" },
  { id: "S4", name: "Welding" },
  { id: "S5", name: "Painting" },
  { id: "S6", name: "Quality Check" }
];

db.exec("DELETE FROM workers;");
db.exec("DELETE FROM workstations;");
db.exec("DELETE FROM events;");

const insertWorker = db.prepare("INSERT INTO workers VALUES (?, ?)");
const insertStation = db.prepare("INSERT INTO workstations VALUES (?, ?)");

workers.forEach(w => insertWorker.run(w.id, w.name));
stations.forEach(s => insertStation.run(s.id, s.name));

console.log("Seeded workers & stations");