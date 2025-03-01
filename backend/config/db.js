const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mona1025!",  // Change this in production
  database: "quiz_app",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed: ", err);
    return;
  }
  console.log("✅ Connected to MySQL Database.");
});

module.exports = db;
