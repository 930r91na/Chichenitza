const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, ".")));

/**
 * Login Endpoint
 */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.get(sql, [email, password], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
      return;
    }
    if (row) {
      // Remove password from response
      const { password, ...user } = row;
      // Map 'role' to 'tipo' for compatibility with existing frontend code
      user.tipo = user.role;
      user.nivel = user.membership_level;
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

/**
 * Get Zones
 */
app.get("/api/zones", (req, res) => {
  const sql = "SELECT * FROM zones";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

/**
 * Get Guides
 */
app.get("/api/guides", (req, res) => {
  const sql = "SELECT * FROM guides";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

/**
 * Get Events
 */
app.get("/api/events", (req, res) => {
  const sql = "SELECT * FROM events";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

/**
 * Get Tourists
 */
app.get("/api/tourists", (req, res) => {
  const sql = "SELECT * FROM users WHERE role = 'tourist'";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

/**
 * Register Endpoint
 */
app.post("/api/register", (req, res) => {
  const {
    nombre,
    email,
    password,
    nombreAvatar,
    membresia,
    avatarImage,
    pais,
  } = req.body;
  const role = "tourist";
  const fechaRegistro = new Date().toISOString();

  const sql = `INSERT INTO users (name, email, password, role, membership_level, avatar_name, avatar_image, country, registration_date) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [
      nombre,
      email,
      password,
      role,
      membresia,
      nombreAvatar,
      avatarImage,
      pais,
      fechaRegistro,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ success: false, message: err.message });
        return;
      }
      res.json({
        success: true,
        user: {
          id: this.lastID,
          nombre,
          email,
          tipo: role,
          nivel: membresia,
          nombreAvatar,
          avatarImage,
          fechaRegistro,
        },
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
