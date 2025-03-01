const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router.get("/quiz/:category", quizController.getQuestionsByCategory);

module.exports = router;
