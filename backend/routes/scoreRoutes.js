const express = require("express");
const { submitScore, getUserScores, getLeaderboard } = require("../controllers/scoreController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to submit quiz score (Protected Route)
router.post("/", authMiddleware, submitScore);

// Get scores for a specific user
router.get("/user/:userId", authMiddleware, getUserScores);

// Get leaderboard (Top scores)
router.get("/leaderboard", getLeaderboard);

module.exports = router;
