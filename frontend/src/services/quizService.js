import axios from "axios";

const API_URL = "https://opentdb.com/api.php";

export const fetchQuizQuestions = async (category, amount = 10) => {
  try {
    const response = await axios.get(`${API_URL}?amount=${amount}&category=${category}&type=multiple`);
    return response.data.results; // Returns an array of questions
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return [];
  }
};
