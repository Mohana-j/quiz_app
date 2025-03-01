const db = require("../config/db");

// Submit score after a quiz
exports.submitScore = async (req, res) => {
  const { userId, quizId, score } = req.body;

  if (!userId || !quizId || score === undefined) {
    return res.status(400).json({ error: "User ID, Quiz ID, and Score are required" });
  }

  try {
    await db.query("INSERT INTO scores (user_id, quiz_id, score) VALUES (?, ?, ?)", [userId, quizId, score]);
    res.status(201).json({ message: "Score submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting score" });
  }
};

// Get all scores for a user
exports.getUserScores = async (req, res) => {
  const { userId } = req.params;

  try {
    const [scores] = await db.query("SELECT * FROM scores WHERE user_id = ?", [userId]);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user scores" });
  }
};

// Get top scores for leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const [leaders] = await db.query(`
      SELECT users.name, scores.score, scores.attempted_at
      FROM scores
      JOIN users ON scores.user_id = users.user_id
      ORDER BY scores.score DESC
      LIMIT 10
    `);
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
};
