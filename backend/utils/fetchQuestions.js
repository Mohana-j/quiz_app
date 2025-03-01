const db = require("../config/db");

const openTDBCategoryMapping = {
  "general knowledge": 9,
  "science": 17,
  "history": 23,
  "geography": 22,
  "movies": 11,
  "sports": 21,
  "ai & robotics": 18,
  "world facts": 24
};

// ✅ Fetch questions from external API if not found in DB
const fetchQuestionsFromAPI = async (category, res) => {
  const openTDBCategory = openTDBCategoryMapping[category.toLowerCase()];
  if (!openTDBCategory) {
    return res.status(400).json({ message: "Invalid category" });
  }

  try {
    const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${openTDBCategory}&type=multiple`);
    if (!response.ok) throw new Error("Failed to fetch from external API");

    const data = await response.json();
    if (!data.results) throw new Error("Invalid API response");

    const questions = data.results.map((item) => ({
      question_text: item.question,
      correct_option: item.correct_answer,
      options: [...item.incorrect_answers, item.correct_answer]
    }));

    // Insert fetched questions into database
    for (const q of questions) {
      await insertQuestion(q, openTDBCategory);
    }

    res.json(questions);
  } catch (apiError) {
    console.error("❌ API Error:", apiError);
    return res.status(500).json({ message: "Failed to load quiz questions" });
  }
};

module.exports = fetchQuestionsFromAPI;
