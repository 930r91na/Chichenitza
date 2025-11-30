const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "vrtourist.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database " + dbPath + ": " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT, -- 'admin', 'tourist', 'guide'
        membership_level TEXT DEFAULT 'free', -- 'free', 'premium', 'vip'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

  // Zones table
  db.run(`CREATE TABLE IF NOT EXISTS zones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        access_level TEXT,
        points INTEGER,
        image_path TEXT,
        description TEXT
    )`);

  // Events table
  db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        date TEXT,
        type TEXT,
        status TEXT,
        attendees INTEGER DEFAULT 0
    )`);

  // Guides table
  db.run(`CREATE TABLE IF NOT EXISTS guides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        status TEXT, -- 'online', 'offline', 'busy'
        languages TEXT,
        rating REAL
    )`);

  // Seed data if empty
  db.get("SELECT count(*) as count FROM users", (err, row) => {
    if (row.count === 0) {
      console.log("Seeding database...");
      const stmt = db.prepare(
        "INSERT INTO users (name, email, password, role, membership_level) VALUES (?, ?, ?, ?, ?)"
      );
      stmt.run("Admin User", "admin@vrtourist.com", "admin123", "admin", "vip");
      stmt.run(
        "Juan Pérez",
        "juan.perez@email.com",
        "password123",
        "tourist",
        "premium"
      );
      stmt.finalize();

      const zoneStmt = db.prepare(
        "INSERT INTO zones (name, access_level, points, image_path, description) VALUES (?, ?, ?, ?, ?)"
      );
      zoneStmt.run(
        "Pirámide de Kukulcán",
        "free",
        100,
        "images/zones/kukulcan.jpg",
        "La pirámide principal."
      );
      zoneStmt.run(
        "Juego de Pelota",
        "premium",
        200,
        "images/zones/juego-pelota.jpg",
        "El campo de juego de pelota más grande."
      );
      zoneStmt.finalize();

      const guideStmt = db.prepare(
        "INSERT INTO guides (name, status, languages, rating) VALUES (?, ?, ?, ?)"
      );
      guideStmt.run("Dr. Carlos López", "online", "Español, Inglés", 4.8);
      guideStmt.run("Ana García", "busy", "Español, Francés", 4.9);
      guideStmt.finalize();

      const eventStmt = db.prepare(
        "INSERT INTO events (title, date, type, status, attendees) VALUES (?, ?, ?, ?, ?)"
      );
      eventStmt.run(
        "Equinoccio de Primavera",
        "2025-03-21",
        "Astronomía",
        "Programado",
        150
      );
      eventStmt.finalize();
    }
  });
});

module.exports = db;
