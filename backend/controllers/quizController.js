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
      SELECT q.question_id, q.question_text,  
       o.option_id, o.option_text, o.is_correct
FROM questions q
LEFT JOIN options o ON q.question_id = o.question_id  
WHERE q.quiz_id = ?
ORDER BY q.question_id, RAND();

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

      const finalQuestions = Object.values(formattedQuestions).filter(q => q.options.length === 4);

      console.log(`✅ Sending ${finalQuestions.length} questions with 4 options each for ${category}`);
      res.json(finalQuestions);
    });
  });
};

/* =========================================
   ✅ SUBMIT QUIZ (SAVE USER ATTEMPT)
========================================= */
exports.submitQuiz = (req, res) => {
  const { user_id, answers } = req.body;

  if (!user_id || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  let score = 0;
  let wrong = 0;
  let unanswered = 0;
  const totalQuestions = answers.length;
  const responseDetails = [];

  console.log("🟢 Submitted Answers: ", answers);

  const questionIds = answers.map((a) => a.question_id);

  if (questionIds.length === 0) {
    return res.status(400).json({ message: "No questions submitted." });
  }

  // ✅ Fetch `is_correct` value of selected options
  const placeholders = answers.map(() => "?").join(", ");
  const checkAnswersQuery = `
    SELECT option_id, is_correct 
    FROM options 
    WHERE option_id IN (${placeholders});
  `;

  const selectedOptionIds = answers.map(a => a.answer); // Fetch selected option_ids

  db.query(checkAnswersQuery, [...selectedOptionIds], (err, optionResults) => {
    if (err) {
      console.error("❌ Error checking answers:", err);
      return res.status(500).json({ message: "Database error" });
    }

    console.log("🟢 Retrieved Options Data:", optionResults);

    // ✅ Create a map of `option_id -> is_correct`
    const optionCorrectMap = new Map(optionResults.map(opt => [opt.option_id, opt.is_correct]));

    // ✅ Process Each User Answer
    answers.forEach((userAnswer) => {
      const isCorrect = optionCorrectMap.get(userAnswer.answer); // Fetch `is_correct` for selected option

      console.log(`🔍 Checking Q${userAnswer.question_id}: Selected ${userAnswer.answer}, isCorrect: ${isCorrect}`);

      if (userAnswer.answer === null) {
        unanswered++;
      } else if (isCorrect === 1) {
        score++;
      } else {
        wrong++;
      }

      responseDetails.push({
        question_id: userAnswer.question_id,
        selected_option: userAnswer.answer || "Not Answered",
        correct: isCorrect === 1 ? "Correct" : "Incorrect",
      });
    });

    console.log(`✅ Score Breakdown -> Correct: ${score}, Wrong: ${wrong}, Unanswered: ${unanswered}`);

    // ✅ Store user score
    const insertAttemptQuery = `
      INSERT INTO scores(user_id, score, total_questions, correct_answers, wrong_answers, unanswered) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertAttemptQuery, [user_id, score, totalQuestions, score, wrong, unanswered], (err) => {
      if (err) {
        console.error("❌ Error saving attempt:", err);
        return res.status(500).json({ message: "Error saving quiz result" });
      }
      console.log(`✅ Quiz submitted! Score: ${score}/${totalQuestions}`);
      res.json({ message: "Quiz submitted successfully!", score, wrong, unanswered, totalQuestions });
    });
  });
};
