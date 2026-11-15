
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const grammarRoutes = require("./routes/grammarRoutes");
const vocabularyRoutes = require("./routes/vocabularyRoutes");
const sentenceRoutes = require("./routes/sentenceRoutes");
const examRoutes = require("./routes/examRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("EnglishEase API is running successfully!");
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Grammar routes
app.use("/api/learning/grammar", grammarRoutes);

// Vocabulary routes
app.use("/api/learning/vocabulary", vocabularyRoutes);

// Sentence Practice routes
app.use("/api/learning/sentences", sentenceRoutes);
app.use("/api/exams", examRoutes);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`EnglishEase server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
