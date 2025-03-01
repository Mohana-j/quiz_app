import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("/api/quizzes");
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const createQuiz = async () => {
    if (!newQuiz.title.trim()) return;
    try {
      await axios.post("/api/quizzes", newQuiz);
      setNewQuiz({ title: "", description: "" });
      fetchQuizzes(); // Refresh the quiz list
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      await axios.delete(`/api/quizzes/${quizId}`);
      fetchQuizzes(); // Refresh the quiz list
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>⚙️ Admin Dashboard</h2>

      {/* Create New Quiz */}
      <div style={formStyle}>
        <input type="text" placeholder="Quiz Title" value={newQuiz.title} onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })} style={inputStyle} />
        <input type="text" placeholder="Description (optional)" value={newQuiz.description} onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })} style={inputStyle} />
        <button onClick={createQuiz} style={buttonStyle}>➕ Create Quiz</button>
      </div>

      {/* List of Quizzes */}
      <div>
        <h3>📚 Quizzes</h3>
        {quizzes.length === 0 ? <p>No quizzes available.</p> : (
          quizzes.map((quiz) => (
            <div key={quiz.quiz_id} style={quizCardStyle}>
              <h4>{quiz.title}</h4>
              <p>{quiz.description}</p>
              <button onClick={() => deleteQuiz(quiz.quiz_id)} style={deleteButtonStyle}>🗑️ Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Inline Styles
const containerStyle = { textAlign: "center", padding: "20px", maxWidth: "600px", margin: "auto" };
const formStyle = { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" };
const inputStyle = { padding: "10px", border: "1px solid #ccc", borderRadius: "5px" };
const buttonStyle = { background: "#00C49F", border: "none", padding: "10px", color: "white", cursor: "pointer", borderRadius: "5px" };
const quizCardStyle = { padding: "15px", border: "1px solid #ccc", borderRadius: "5px", margin: "10px 0", background: "#F3F3F3" };
const deleteButtonStyle = { background: "#E94560", border: "none", padding: "8px", color: "white", cursor: "pointer", borderRadius: "5px" };

export default AdminDashboard;
