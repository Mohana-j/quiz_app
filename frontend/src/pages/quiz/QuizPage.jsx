import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

const QuizPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [unanswered, setUnanswered] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/quiz/questions/${category}`);
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        if (Array.isArray(data)) {
          setQuestions(data.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [category]);

  useEffect(() => {
    if (quizStarted && timer > 0 && !quizEnded) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (quizStarted && timer === 0) {
      handleNextQuestion();
    }
  }, [timer, quizStarted, quizEnded]);

  const handleStartQuiz = () => {
    setShowModal(false);
    setQuizStarted(true);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      const correctAnswer = questions[currentIndex]?.options.find((opt) => opt.is_correct)?.option_id;
      if (selectedOption === correctAnswer) {
        setScore((prev) => prev + 1);
      } else {
        setWrong((prev) => prev + 1);
      }
    } else {
      setUnanswered((prev) => prev + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimer(30);
    } else {
      setQuizEnded(true);
      setShowResultModal(true);
    }
  };

  return (
    <div style={styles.container}>
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>🚀 Ready for your {category} quiz?</h2>
            <p>You'll have 30 seconds per question. Choose wisely!</p>
            <button style={styles.startButton} onClick={handleStartQuiz}>🎯 Start Quiz</button>
            <button style={styles.cancelButton} onClick={() => navigate("/categories")}>❌ Cancel</button>
          </div>
        </div>
      )}

      {quizStarted && questions.length > 0 && !showResultModal ? (
        <div style={styles.quizContent}>
          <h2 style={styles.questionHeader}>Question {currentIndex + 1}/10</h2>
          <p style={styles.question}>{questions[currentIndex]?.question_text}</p>
          <div style={styles.optionsContainer}>
            {questions[currentIndex]?.options.map((option) => (
              <label key={option.option_id} style={styles.optionLabel}>
                <input
                  type="radio"
                  name="answer"
                  value={option.option_id}
                  checked={selectedOption === option.option_id}
                  onChange={() => handleOptionSelect(option.option_id)}
                />
                {option.text}
              </label>
            ))}
          </div>
          <p style={styles.timer}>⏳ Time Left: {timer}s</p>
          <div style={styles.navigationButtons}>
            {currentIndex > 0 && (
              <button onClick={() => setCurrentIndex((prev) => prev - 1)} style={styles.navButton}>⬅ Previous</button>
            )}
            <button onClick={handleNextQuestion} style={styles.navButton}>
              {currentIndex < questions.length - 1 ? "Next ➡" : "✅ Submit Quiz"}
            </button>
          </div>
        </div>
      ) : (
        !showModal && <h3>Loading questions...</h3>
      )}

      {showResultModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>🎯 Quiz Completed!</h2>
            <p>✅ Correct Answers: {score}</p>
            <p>❌ Wrong Answers: {wrong}</p>
            <p>⏳ Unanswered: {unanswered}</p>
            <button onClick={() => navigate("/categories")} style={styles.startButton}>🏆 View Leaderboard</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f0f4f8",
  },
  quizContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
    width: "90%",
    maxWidth: "600px",
    textAlign: "center",
  },
  questionHeader: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  },
  question: {
    fontSize: "20px",
    fontWeight: "500",
    marginBottom: "20px",
    color: "#444",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
    maxWidth: "400px",
    marginBottom: "20px",
  },
  optionLabel: {
    fontSize: "18px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #ddd",
    cursor: "pointer",
  },
};

export default QuizPage;
