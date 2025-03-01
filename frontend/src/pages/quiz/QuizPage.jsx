import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QuizPage = () => {
  const { category } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(30); // 30 sec timer
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    } else {
      handleNextQuestion();
    }
  }, [timer]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/quiz/${category}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimer(30);
    } else {
      alert("Quiz completed!");
    }
  };

  const handleSubmit = () => {
    alert(`You selected: ${selectedOption}`);
    handleNextQuestion();
  };

  if (loading) return <h2>Loading questions...</h2>;

  return (
    <div style={styles.container}>
      {questions.length > 0 ? (
        <>
          <h2>{questions[currentQuestionIndex]?.question_text}</h2>
          <div style={styles.optionsContainer}>
            {questions[currentQuestionIndex]?.options.map((option) => (
              <button
                key={option.option_id}
                style={selectedOption === option.option_id ? styles.selectedOption : styles.option}
                onClick={() => setSelectedOption(option.option_id)}
              >
                {option.text}
              </button>
            ))}
          </div>
          <p>⏳ Time Left: {timer}s</p>
          <button onClick={handleSubmit} style={styles.submitButton}>
            Submit Answer
          </button>
        </>
      ) : (
        <h3>No questions found for this category</h3>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
  option: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#f4f4f4",
    border: "1px solid #ccc",
    cursor: "pointer",
    borderRadius: "5px",
  },
  selectedOption: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "1px solid #ccc",
    cursor: "pointer",
    borderRadius: "5px",
  },
  submitButton: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default QuizPage;
