const db = require("../config/db");

/* =========================================
   🚀 FETCH QUIZ QUESTIONS FROM DATABASE
========================================= */
exports.getQuizQuestions = (req, res) => {
  const category = decodeURIComponent(req.params.category);
  console.log(`🟢 Fetching quiz for category: ${category}`);

  // ✅ Step 1: Get `quiz_id` from quizzes table
  const quizQuery = "SELECT quiz_id FROM quizzes WHERE category = ?";
  
  db.query(quizQuery, [category], (quizErr, quizResult) => {
    if (quizErr) {
      console.error("❌ Error fetching quiz:", quizErr);
      return res.status(500).json({ message: "Database error", error: quizErr });
    }

    if (quizResult.length === 0) {
      console.warn(`⚠️ No quiz found for category: ${category}`);
      return res.status(404).json({ message: "No quiz found for this category" });
    }

    const quizId = quizResult[0].quiz_id;

    // ✅ Step 2: Fetch Questions with Options
    const questionQuery = `
      SELECT q.question_id, q.question_text, q.correct_option, 
             o.option_id, o.option_text, o.is_correct
      FROM questions q
      LEFT JOIN options o ON q.quiz_id = o.quiz_id  -- ✅ FIXED JOIN
      WHERE q.quiz_id = ?
      ORDER BY RAND()
      LIMIT 10;
    `;

    db.query(questionQuery, [quizId], (err, results) => {
      if (err) {
        console.error("❌ Error fetching questions:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        console.warn(`⚠️ No questions found for category: ${category}`);
        return res.status(404).json({ message: "No questions available for this quiz" });
      }

      // ✅ Step 3: Organize Questions and Options
      const formattedQuestions = {};
      results.forEach((row) => {
        if (!formattedQuestions[row.question_id]) {
          formattedQuestions[row.question_id] = {
            question_id: row.question_id,
            question_text: row.question_text,
            correct_option: row.correct_option,
            options: [],
          };
        }
        if (row.option_id) { // Ensure option exists
          formattedQuestions[row.question_id].options.push({
            option_id: row.option_id,
            text: row.option_text,
            is_correct: row.is_correct,
          });
        }
      });

      console.log(`✅ Sending ${Object.values(formattedQuestions).length} questions for ${category}`);
      res.json(Object.values(formattedQuestions));
    });
  });
};

/* =========================================
   ✅ SUBMIT QUIZ (SAVE USER ATTEMPT)
========================================= */
exports.submitQuiz = (req, res) => {
  const { user_id, quiz_id, answers } = req.body;

  if (!user_id || !quiz_id || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  let score = 0;
  const totalQuestions = answers.length;

  // ✅ Fix: Convert `answers.map((a) => a.question_id)` into a properly formatted list
  const questionIds = answers.map((a) => a.question_id);

  if (questionIds.length === 0) {
    return res.status(400).json({ message: "No questions submitted." });
  }

  // ✅ Dynamic placeholders for safe SQL execution
  const placeholders = questionIds.map(() => "?").join(", ");
  const checkAnswersQuery = `
    SELECT question_id, correct_option 
    FROM questions WHERE quiz_id = ? AND question_id IN (${placeholders})
  `;

  db.query(checkAnswersQuery, [quiz_id, ...questionIds], (err, correctAnswers) => {
    if (err) {
      console.error("❌ Error checking answers:", err);
      return res.status(500).json({ message: "Database error" });
    }

    correctAnswers.forEach((correct) => {
      const userAnswer = answers.find((a) => a.question_id === correct.question_id);
      if (userAnswer && userAnswer.answer === correct.correct_option) {
        score++;
      }
    });

    // ✅ Store user score
    const insertAttemptQuery = `
      INSERT INTO user_attempts (user_id, quiz_id, score) VALUES (?, ?, ?)
    `;

    db.query(insertAttemptQuery, [user_id, quiz_id, score], (err) => {
      if (err) {
        console.error("❌ Error saving attempt:", err);
        return res.status(500).json({ message: "Error saving quiz result" });
      }
      console.log(`✅ Quiz submitted! Score: ${score}/${totalQuestions}`);
      res.json({ message: "Quiz submitted successfully!", score, totalQuestions });
    });
  });
};  

