const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'jobs.db');

// Ensure data folder exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// Initialize DB
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open DB:', err);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref_no TEXT,
    client_name TEXT,
    date_received TEXT,
    allocated_to TEXT,
    status TEXT,
    remarks TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: list jobs
app.get('/api/jobs', (req, res) => {
  const q = `SELECT * FROM jobs ORDER BY id DESC`;
  db.all(q, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: add job
app.post('/api/jobs', (req, res) => {
  const { ref_no, client_name, date_received, allocated_to, status, remarks } = req.body;
  const stmt = db.prepare(`INSERT INTO jobs (ref_no, client_name, date_received, allocated_to, status, remarks) VALUES (?,?,?,?,?,?)`);
  stmt.run(ref_no, client_name, date_received, allocated_to, status, remarks, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM jobs WHERE id = ?', [this.lastID], (e, row) => {
      if (e) return res.status(500).json({ error: e.message });
      res.json(row);
    });
  });
});

// API: update job
app.put('/api/jobs/:id', (req, res) => {
  const id = req.params.id;
  const { ref_no, client_name, date_received, allocated_to, status, remarks } = req.body;
  const q = `UPDATE jobs SET ref_no=?, client_name=?, date_received=?, allocated_to=?, status=?, remarks=? WHERE id=?`;
  db.run(q, [ref_no, client_name, date_received, allocated_to, status, remarks, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM jobs WHERE id = ?', [id], (e, row) => {
      if (e) return res.status(500).json({ error: e.message });
      res.json(row);
    });
  });
});

// API: delete job
app.delete('/api/jobs/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM jobs WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Simple Job Tracker running on port ${PORT}`);
});
