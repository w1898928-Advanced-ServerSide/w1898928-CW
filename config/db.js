const sqlite3 = require("sqlite3").verbose();
const path = require('path');

const db = new sqlite3.Database(__dirname,"../../database.db",sqlite3.OPEN_READWRITE, (err)=>{
    if(err) return console.error(err.message);

    console.log("Connection Successful");
});


db.serialize(() => {

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS apiKeys (
    apiId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    apiKey TEXT UNIQUE,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);

  console.log("Tables initialized");
});

module.exports = db;
