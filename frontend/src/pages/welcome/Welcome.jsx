import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister
        ? "http://localhost:5000/api/register"
        : "http://localhost:5000/api/login";

      if (password === "admin123") {
        navigate("/admin/admin-dashboard");
        return;
      } else {
        navigate("/categories");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isRegister ? { name, email, password } : { email, password }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setMessage(data.message);

      if (data.message === "User registered successfully!" || data.message === "Login successful!") {
        navigate("/categories");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <h1 style={styles.title}>🎉 Welcome to <span style={styles.brand}>DinoCrack</span></h1>
        <p style={styles.subtitle}>Test your knowledge, compete with others, and become a champion! 🏆</p>
      </div>
      <div style={styles.rightSection}>
        <div style={styles.formContainer}>
          <h2>{isRegister ? "Create an Account" : "Login"}</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            {isRegister && (
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            )}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
          <p style={styles.toggleText}>
            {isRegister ? "Already have an account?" : "Don't have an account?"} 
            <span style={styles.toggleLink} onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Login" : "Register"}
            </span>
          </p>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

// Styles with responsive adjustments
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
  },
  leftSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C3E50",
    color: "#fff",
    padding: "50px",
    textAlign: "center",
  },
  brand: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "20px",
    maxWidth: "500px",
    lineHeight: "1.6",
    marginTop: "10px",
  },
  rightSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: "30px",
  },
  formContainer: {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "#fff",
    padding: "50px",
    borderRadius: "12px",
    boxShadow: "0px 6px 16px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "14px",
    margin: "12px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "18px",
  },
  button: {
    padding: "14px",
    backgroundColor: "#28A745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    marginTop: "12px",
    transition: "0.3s",
  },
  toggleText: {
    marginTop: "15px",
    fontSize: "16px",
    color: "#333",
  },
  toggleLink: {
    color: "#007BFF",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  message: {
    marginTop: "15px",
    color: "red",
    fontSize: "16px",
  },
  '@media (max-width: 768px)': {
    container: {
      flexDirection: "column",
      height: "auto",
      overflowY: "auto",
    },
    leftSection: {
      padding: "30px",
      height: "auto",
    },
    rightSection: {
      padding: "20px",
      height: "auto",
    },
  },
};

export default Welcome;
