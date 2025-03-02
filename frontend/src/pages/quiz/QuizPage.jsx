import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);

  // ✅ Fetch 10 Trivia Questions from DB or API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quiz/questions/${category}`);
        if (!response.ok) throw new Error("Failed to fetch questions");

        const data = await response.json();
        if (Array.isArray(data)) {
          setQuestions(data.slice(0, 10)); // ✅ Take only 10 questions
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category]);

  // ✅ Timer Effect
  useEffect(() => {
    if (quizStarted && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (quizStarted && timer === 0) {
      handleNextQuestion();
    }
  }, [timer, quizStarted]);

  // ✅ Start Quiz
  const handleStartQuiz = () => {
    setShowModal(false);
    setQuizStarted(true);
  };

  // ✅ Handle Answer Selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // ✅ Move to Next Question
  const handleNextQuestion = () => {
    if (selectedOption === questions[currentIndex]?.correct_option) {
      setScore((prev) => prev + 1); // ✅ Increase Score if Correct
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimer(30);
    } else {
      alert(`🎉 Quiz completed! Your score: ${score + 1}/10`);
      navigate("/categories");
    }
  };

  // ✅ Move to Previous Question
  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setTimer(30);
    }
  };

  return (
    <div style={styles.container}>
      {/* ✅ Show Confirmation Modal Before Quiz Starts */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>🚀 Ready for your {category} quiz?</h2>
            <p>You'll have 30 seconds per question. Choose wisely!</p>
            <button style={styles.startButton} onClick={handleStartQuiz}>
              🎯 Start Quiz
            </button>
            <button style={styles.cancelButton} onClick={() => navigate("/categories")}>
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* ✅ Display Quiz Questions One by One */}
      {quizStarted && questions.length > 0 ? (
        <>
          <h2>Question {currentIndex + 1}/10</h2>
          <p style={styles.question}>{questions[currentIndex]?.question_text}</p>

          {/* ✅ Radio Button Options */}
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

          {/* ✅ Timer Display */}
          <p>⏳ Time Left: {timer}s</p>

          {/* ✅ Navigation Buttons */}
          <div style={styles.navigationButtons}>
            {currentIndex > 0 && (
              <button onClick={handlePreviousQuestion} style={styles.navButton}>
                ⬅ Previous
              </button>
            )}
            {currentIndex < questions.length - 1 ? (
              <button onClick={handleNextQuestion} style={styles.navButton}>
                Next ➡
              </button>
            ) : (
              <button onClick={handleNextQuestion} style={styles.submitButton}>
                ✅ Submit Quiz
              </button>
            )}
          </div>
        </>
      ) : (
        !showModal && <h3>{loading ? "Loading questions..." : "No questions found."}</h3>
      )}
    </div>
  );
};

/* ✅ Styles for Quiz */
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
    maxWidth: "400px",
  },
  startButton: {
    padding: "10px 20px",
    margin: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  cancelButton: {
    padding: "10px 20px",
    margin: "10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  question: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
  optionLabel: {
    display: "block",
    backgroundColor: "#f4f4f4",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px 0",
  },
  navigationButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  navButton: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default QuizPage;
