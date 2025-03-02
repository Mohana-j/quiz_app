const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

// ✅ Correct API Route
router.get("/questions/:category", quizController.getQuizQuestions);
router.post("/submit", quizController.submitQuiz);

module.exports = router;
