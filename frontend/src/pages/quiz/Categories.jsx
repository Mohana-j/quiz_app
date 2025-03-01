import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Academics", subcategories: ["Math", "Science", "History", "Geography"] },
  { name: "Entertainment", subcategories: ["Movies", "Music", "TV Shows"] },
  { name: "Sports", subcategories: ["Football", "Cricket", "Tennis"] },
  { name: "Technology", subcategories: ["AI & Robotics", "Software", "Gadgets"] },
  { name: "World Facts", subcategories: ["Countries", "Landmarks", "Culture"] }
];

const QuizCategories = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📚 Choose a Quiz Category 🎯</h1>
      <div style={styles.grid}>
        {categories.map((category, index) => (
          <div key={index} style={styles.categoryBox}>
            <h2 style={styles.categoryTitle}>{category.name}</h2>
            <div style={styles.subcategoryContainer}>
              {category.subcategories.map((sub, idx) => (
                <button
                  key={idx}
                  style={styles.button}
                  onClick={() => navigate(`/quiz/${sub.toLowerCase()}`)}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "50px", backgroundColor: "#f4f4f4", minHeight: "100vh" ,  marginTop:"80px" },
  heading: { fontSize: "28px", marginBottom: "20px", color: "#333" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    maxWidth: "900px",
    margin: "0 auto"
    
  },
  categoryBox: {
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s ease-in-out",
    cursor: "pointer",
    textAlign: "center"
  },
  categoryTitle: { fontSize: "22px", marginBottom: "10px", color: "#007bff" },
  subcategoryContainer: { display: "flex", flexWrap: "wrap", justifyContent: "center" },
  button: {
    padding: "10px 15px",
    margin: "5px",
    fontSize: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "background 0.3s ease-in-out"
  },
  buttonHover: { backgroundColor: "#0056b3" }
};

export default QuizCategories;
