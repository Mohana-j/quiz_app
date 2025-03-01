import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useQuizStore from "../../store/userQuizStore";
import { calculateScore } from "../../utils/calculateScore";

const ResultPage = () => {
  const { answers, questions, resetQuiz } = useQuizStore();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [unanswered, setUnanswered] = useState(0);

  useEffect(() => {
    const { correct, incorrect, skipped } = calculateScore(answers, questions);
    setScore(correct);
    setWrong(incorrect);
    setUnanswered(skipped);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎯 Quiz Completed!</h2>
      <p>✅ Correct Answers: {score}</p>
      <p>❌ Wrong Answers: {wrong}</p>
      <p>⏳ Unanswered: {unanswered}</p>
      <button onClick={() => { resetQuiz(); navigate("/quiz-list"); }} style={buttonStyle}>
        🔄 Try Again
      </button>
      <button onClick={() => navigate("/leaderboard")} style={buttonStyle}>
        🏆 View Leaderboard
      </button>
    </div>
  );
};

const buttonStyle = { background: "#E94560", border: "none", padding: "10px", color: "white", cursor: "pointer", margin: "10px" };

export default ResultPage; // ✅ Ensure this export is present
