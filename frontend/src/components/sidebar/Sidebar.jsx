import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore"; // ✅ Corrected import

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore(); // ✅ Zustand store to get user data

  return (
    <div style={styles.sidebar}>
      <h3>📌 Menu</h3>
      <button style={styles.button} onClick={() => navigate("/categories")}>📚 Categories</button>
      <button style={styles.button} onClick={() => navigate("/leaderboard")}>🏆 Leaderboard</button>

      {/* ✅ Show "Manage Questions" only for Admins */}
      {user?.role === "admin" && (
        <button style={styles.adminButton} onClick={() => navigate("/admin/manage-questions")}>
          ⚙️ Manage Questions
        </button>
      )}
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    height: "calc(100vh - 60px)",
    backgroundColor: "#333",
    color: "#fff",
    padding: "20px",
    position: "fixed",
    top: "60px",
    left: 0,
    overflowY: "auto",
    marginTop:"100px"
  },
  button: {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    background: "#555",
    border: "none",
    color: "white",
    cursor: "pointer",
    textAlign: "left",
    borderRadius: "5px",
  },
  adminButton: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#FF5733",
    border: "none",
    color: "white",
    cursor: "pointer",
    textAlign: "left",
    borderRadius: "5px",
  }
};

export default Sidebar;
