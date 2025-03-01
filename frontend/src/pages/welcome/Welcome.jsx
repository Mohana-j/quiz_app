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
            ? "http://localhost:5000/api/register"  // ✅ Corrected API Path
            : "http://localhost:5000/api/login";  

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
      <h1 style={styles.title}>🎉 Welcome to DinoCrack - Ultimate Quiz 🎯</h1>
      <p style={styles.subtitle}>Test your knowledge, compete with others, and become a champion! 🏆</p>

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
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span style={styles.toggleLink} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

// ✅ Define the styles object
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "20px",
  },
  formContainer: {
    width: "350px",
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  toggleText: {
    marginTop: "12px",
    fontSize: "14px",
    color: "#333",
  },
  toggleLink: {
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  message: {
    marginTop: "12px",
    color: "red",
    fontSize: "14px",
  },
};

export default Welcome;
