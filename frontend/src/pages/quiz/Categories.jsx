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
    container: {
      textAlign: "center",
      padding: "50px",
      backgroundColor: "#f4f4f4",
      minHeight: "100vh",
      marginTop: "80px",
      fontFamily: "'Roboto', sans-serif",
      color: "#333",
    },
    heading: {
      fontSize: "36px",
      marginBottom: "40px",
      color: "#333",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "30px",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
    },
    categoryBox: {
      padding: "30px",
      borderRadius: "12px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out",
      cursor: "pointer",
      textAlign: "center",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    categoryTitle: {
      fontSize: "24px",
      marginBottom: "15px",
      color: "#007bff",
      fontWeight: "500",
    },
    subcategoryContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: "20px",
    },
    button: {
      padding: "12px 20px",
      margin: "8px",
      fontSize: "16px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      borderRadius: "8px",
      transition: "background 0.3s ease-in-out, transform 0.2s",
      minWidth: "150px",
    },
    '@media (max-width: 768px)': {
      grid: {
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      },
      heading: {
        fontSize: "28px",
      },
    },
    '@media (max-width: 480px)': {
      container: {
        padding: "20px",
      },
      heading: {
        fontSize: "24px",
        marginBottom: "20px",
      },
      categoryBox: {
        padding: "20px",
      },
      button: {
        padding: "10px 15px",
        fontSize: "14px",
        minWidth: "120px",
      },
    },
  };
  
  export default QuizCategories;