const db = require("../config/db");

const UserDAO = {
  createUser: (username, password, email, callback) => {
    const sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    db.run(sql, [username, password, email], function (err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID, username, email });
    });
  },

  getUserById: (id, callback) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  },

  getUserByUsername: (username, callback) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  },

  getAllUsers: (callback) => {
    const sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },

  deleteUser: (id, callback) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.run(sql, [id], function (err) {
      if (err) return callback(err);
      callback(null, { message: "User deleted", changes: this.changes });
    });
  }
};

module.exports = UserDAO;
