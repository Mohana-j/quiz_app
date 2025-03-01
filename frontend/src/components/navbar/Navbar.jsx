import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>🦖 DinoCrack</h1>
      <button onClick={() => navigate("/manage-questions")} style={styles.adminButton}>⚙ Manage Questions</button>
      <button onClick={() => navigate("/")} style={styles.logoutButton}>🚪 Logout</button>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 25px",
    backgroundColor: "#2c3e50",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
  },
  adminButton: {
    backgroundColor: "#f39c12",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "14px",
    transition: "0.3s ease",
  },
};

export default Navbar;
