import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore"; // Zustand store for authentication

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleLogin = () => {
    if (password === "admin123") {
      setUser({ role: "admin" }); // ✅ Store admin role in Zustand
      navigate("/admin/admin-dashboard"); // ✅ Redirect to Admin Dashboard
    } else {
      alert("❌ Incorrect Password! Access Denied.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>🔑 Admin Login</h2>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>Login</button>
      </div>
    </div>
  );
};

// ✅ Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(to right,rgb(150, 186, 222),rgb(83, 177, 192))", // Gradient for a modern look
  },
  loginBox: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)", // More depth for modern effect
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "border 0.3s ease, box-shadow 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#00C49F",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  buttonHover: {
    backgroundColor: "#00b389",
    transform: "scale(1.05)",
  },
};

export default AdminLogin;
