const db = require("../config/db");

const createScoreTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS scores (
      score_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      quiz_id INT NOT NULL,
      score INT NOT NULL,
      attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
    );
  `;
  await db.query(sql);
};

createScoreTable();

module.exports = db;
