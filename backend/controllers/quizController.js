const db = require("../config/db");
const fetch = require("node-fetch"); // ✅ Ensure this is installed: `npm install node-fetch`

/* =========================================
   🚀 FETCH QUIZ QUESTIONS
========================================= */
exports.getQuizQuestions = (req, res) => {
  const category = decodeURIComponent(req.params.category);

  // ✅ Step 1: Check if questions exist in DB
  const query = `
    SELECT q.question_id, q.question_text, q.correct_option,
           o.option_id, o.option_text, o.is_correct 
    FROM questions q
    JOIN options o ON q.question_id = o.question_id
    JOIN quizzes quiz ON q.quiz_id = quiz.quiz_id
    WHERE quiz.category = ?
    LIMIT 10
  `;

  db.query(query, [category], async (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    // ✅ Step 2: If DB has questions, return them
    if (results.length > 0) {
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
          is_correct: row.is_correct, // (Don't send this in frontend)
        });
      });
      return res.json(Object.values(formattedQuestions));
    }

    // ✅ Step 3: If no questions found, fetch from API
    console.log(`ℹ️ No questions in DB for ${category}, fetching from API...`);
    fetchQuestionsFromAPI(category, res);
  });
};

/* =========================================
   🌍 FETCH QUESTIONS FROM OPEN-TDB API
========================================= */
const fetchQuestionsFromAPI = async (category, res) => {
  const openTDBCategoryMapping = {
    "general knowledge": 9,
    "science": 17,
    "history": 23,
    "geography": 22,
    "movies": 11,
    "sports": 21,
    "ai & robotics": 18,
    "world facts": 24,
  };

  const openTDBCategory = openTDBCategoryMapping[category.toLowerCase()];
  if (!openTDBCategory) {
    return res.status(400).json({ message: "Invalid category" });
  }

  try {
    const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${openTDBCategory}&type=multiple`);
    if (!response.ok) throw new Error("Failed to fetch from API");

    const data = await response.json();
    if (!data.results) throw new Error("Invalid API response");

    const questions = data.results.map((item) => ({
      question_text: item.question,
      correct_option: item.correct_answer,
      options: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
    }));

    res.json(questions);
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({ message: "Failed to fetch quiz questions" });
  }
};

/* =========================================
   ✅ SUBMIT QUIZ
========================================= */
exports.submitQuiz = (req, res) => {
  const { user_id, quiz_id, answers } = req.body;

  let score = 0;
  const totalQuestions = answers.length;

  const checkAnswersQuery = `
    SELECT question_id, correct_option 
    FROM questions WHERE quiz_id = ? AND question_id IN (?)
  `;

  db.query(checkAnswersQuery, [quiz_id, answers.map(a => a.question_id)], (err, correctAnswers) => {
    if (err) {
      console.error("❌ Error checking answers:", err);
      return res.status(500).json({ message: "Database error" });
    }

    correctAnswers.forEach((correct) => {
      const userAnswer = answers.find(a => a.question_id === correct.question_id);
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
      res.json({ message: "Quiz submitted successfully!", score, totalQuestions });
    });
  });
};
