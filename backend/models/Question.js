const db = require("../config/db");

const createQuestionTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS questions (
      question_id INT AUTO_INCREMENT PRIMARY KEY,
      quiz_id INT NOT NULL,
      question_text TEXT NOT NULL,
      correct_option VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
    );
  `;
  await db.query(sql);
};

createQuestionTable();

module.exports = db;
