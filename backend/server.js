const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const quizRoutes = require("./routes/quizRoutes"); // ✅ Import quiz routes

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Ensure API Route is Mounted Correctly
app.use("/api", quizRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
