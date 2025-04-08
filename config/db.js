const sqlite3 = require("sqlite3").verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, "../../database.db"), (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to the database.");
  }
});

db.serialize(() => {
  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create api_keys table matching your ApiKey class structure
  db.run(`CREATE TABLE IF NOT EXISTS api_keys (
    apiId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    apiKey TEXT UNIQUE NOT NULL,
    expiresAt DATETIME,
    attempts INTEGER DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error("Error creating api_keys table:", err.message);
    } else {
      console.log("api_keys table created/verified");
    }
  });

  // Create trigger to update updatedAt automatically
  db.run(`CREATE TRIGGER IF NOT EXISTS update_api_key_timestamp
    AFTER UPDATE ON api_keys
    FOR EACH ROW
    BEGIN
      UPDATE api_keys SET updatedAt = CURRENT_TIMESTAMP WHERE apiId = OLD.apiId;
    END`);

  console.log("All tables initialized");
});

module.exports = db;