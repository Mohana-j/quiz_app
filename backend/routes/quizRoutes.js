const express = require("express");
const router = express.Router();
const db = require("../config/db"); // ✅ Ensure correct DB connection

// ✅ Fetch Questions for a Specific Quiz Category
router.get("/quiz/questions/:category", (req, res) => {
    const category = decodeURIComponent(req.params.category);
    console.log(`🟢 Fetching questions for category: ${category}`);
  
    const query = `
      SELECT q.question_id, q.question_text, o.option_id, o.option_text, o.is_correct
      FROM questions q
      JOIN options o ON q.question_id = o.question_id
      JOIN quizzes qu ON q.quiz_id = qu.quiz_id
      WHERE qu.category = ?`;
  
    db.query(query, [category], (err, results) => {
      if (err) {
        console.error("❌ Error fetching questions:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
  
      console.log("✅ Fetched Results:", results);
  
      if (results.length === 0) {
        console.warn("⚠️ No questions found for this category.");
        return res.status(404).json({ message: "No questions found for this category." });
      }
  
      const formattedQuestions = {};
      results.forEach((row) => {
        if (!formattedQuestions[row.question_id]) {
          formattedQuestions[row.question_id] = {
            question_id: row.question_id,
            question_text: row.question_text,
            options: [],
          };
        }
        formattedQuestions[row.question_id].options.push({
          option_id: row.option_id,
          text: row.option_text,
          is_correct: row.is_correct,
        });
      });
  
      console.log("✅ Formatted Questions:", formattedQuestions);
      res.json(Object.values(formattedQuestions));
    });
  });
  

module.exports = router;
