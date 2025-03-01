const db = require("../config/db");

const createQuizTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS quizzes (
      quiz_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
    );
  `;
  await db.query(sql);
};

createQuizTable();

module.exports = db;
