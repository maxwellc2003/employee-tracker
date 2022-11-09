const mysql = require('mysql2/promise');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: '2202',
  database: 'employee_db'
});

module.exports = db;
