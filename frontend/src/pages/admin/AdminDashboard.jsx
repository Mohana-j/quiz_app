import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar"; // ✅ Full-width Navbar

const API_BASE_URL = "http://localhost:5000"; // ✅ Backend URL

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "" });
  const [newQuestion, setNewQuestion] = useState({
    quiz_id: "",
    question_text: "",
    options: ["", "", "", ""],
    correct_option: "",
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // ✅ Fetch quizzes from backend
  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/quizzes`);
      setQuizzes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("❌ Error fetching quizzes:", error);
      setQuizzes([]);
    }
  };

  // ✅ Add a new quiz
  const createQuiz = async () => {
    if (!newQuiz.title.trim()) {
      alert("⚠️ Please enter a quiz title!");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/quizzes`, newQuiz, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201 || response.status === 200) {
        alert("✅ Quiz created successfully!");
        setNewQuiz({ title: "", description: "" });
        fetchQuizzes();
      } else {
        alert("❌ Failed to create quiz.");
      }
    } catch (error) {
      console.error("❌ Error creating quiz:", error);
      alert("❌ Server Error: Check console for details.");
    }
  };

  // ✅ Add a question to a quiz
  const addQuestion = async () => {
    if (!newQuestion.quiz_id || !newQuestion.question_text.trim() || !newQuestion.correct_option) {
      alert("⚠️ Please fill in all fields and select a correct option.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/questions`, newQuestion, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201 || response.status === 200) {
        alert("✅ Question added successfully!");
        setNewQuestion({ quiz_id: "", question_text: "", options: ["", "", "", ""], correct_option: "" });
      } else {
        alert("❌ Failed to add question.");
      }
    } catch (error) {
      console.error("❌ Error adding question:", error);
      alert("❌ Server Error: Check console for details.");
    }
  };

  // ✅ Delete a quiz
  const deleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/quizzes/${quizId}`);
      fetchQuizzes();
    } catch (error) {
      console.error("❌ Error deleting quiz:", error);
      alert("❌ Error deleting quiz.");
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.content}>
        <h2 style={styles.heading}>⚙️ Admin Dashboard</h2>

        {/* ✅ Create New Quiz */}
        <div style={styles.formContainer}>
          <h3>Add New Quiz</h3>
          <input
            type="text"
            placeholder="Quiz Title"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newQuiz.description}
            onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
            style={styles.input}
          />
          <button onClick={createQuiz} style={styles.button}>➕ Add Quiz</button>
        </div>

        {/* ✅ Add Question */}
        <div style={styles.formContainer}>
          <h3>Add New Question</h3>
          <select
            value={newQuestion.quiz_id}
            onChange={(e) => setNewQuestion({ ...newQuestion, quiz_id: e.target.value })}
            style={styles.input}
          >
            <option value="">Select Quiz</option>
            {quizzes.map((quiz) => (
              <option key={quiz.quiz_id} value={quiz.quiz_id}>
                {quiz.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter Question"
            value={newQuestion.question_text}
            onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
            style={styles.input}
          />
          {newQuestion.options.map((opt, idx) => (
            <div key={idx} style={styles.optionContainer}>
              <input
                type="text"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  let updatedOptions = [...newQuestion.options];
                  updatedOptions[idx] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: updatedOptions });
                }}
                style={styles.input}
              />
              <input
                type="radio"
                name="correct_option"
                value={opt}
                onChange={(e) => setNewQuestion({ ...newQuestion, correct_option: e.target.value })}
              />
            </div>
          ))}
          <button onClick={addQuestion} style={styles.button}>➕ Add Question</button>
        </div>

        {/* ✅ List of Quizzes */}
        <h3 style={styles.subHeading}>📚 Quizzes</h3>
        <div style={styles.quizList}>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div key={quiz.quiz_id} style={styles.quizCard}>
                <h4>{quiz.title}</h4>
                <p>{quiz.description}</p>
                <button onClick={() => deleteQuiz(quiz.quiz_id)} style={styles.deleteButton}>🗑️ Delete</button>
              </div>
            ))
          ) : (
            <p style={styles.noQuizText}>No quizzes available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Styles
const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#F4F7FB" },
  content: { width: "100%", maxWidth: "800px", padding: "20px", marginTop: "80px", textAlign: "center" },
  heading: { fontSize: "28px", fontWeight: "600", color: "#2C3E50" },
  formContainer: { padding: "15px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#fff" },
  input: { width: "100%", padding: "10px", margin: "5px 0", borderRadius: "5px" },
  button: { width: "100%", padding: "10px", backgroundColor: "#00C49F", color: "#fff", border: "none", borderRadius: "5px" },
  optionContainer: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  deleteButton: { backgroundColor: "#E94560", padding: "10px", color: "white", border: "none", borderRadius: "5px" },
};

export default AdminDashboard;
