import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (name, email, password) => {
  console.log("🔍 Sending login request with:", { name, email, password }); // Debug log

  try {
    const response = await axios.post(`${API_URL}/login`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return { error: error.response?.data?.error || "Login failed" };
  }
};
