const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); // ✅ Import Auth Routes
const quizRoutes = require("./routes/quizRoutes"); 


const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Register Routes with `/api` prefix
app.use("/api", authRoutes);
app.use("/api/quiz", quizRoutes);
// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
