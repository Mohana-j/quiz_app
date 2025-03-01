import axios from "axios";

// Submit score after quiz completion
export const submitScore = async (userId, quizId, score) => {
  try {
    const response = await axios.post("/api/scores", { userId, quizId, score });
    return response.data;
  } catch (error) {
    console.error("Error submitting score:", error);
    return { error: error.response?.data?.message || "Failed to submit score" };
  }
};

// Fetch scores for a specific user
export const getUserScores = async (userId) => {
  try {
    const response = await axios.get(`/api/scores/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user scores:", error);
    return [];
  }
};

// Fetch leaderboard (Top scores)
export const getLeaderboard = async () => {
  try {
    const response = await axios.get("/api/scores/leaderboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};
