
const express = require("express");
const router = express.Router();

const {
  getSentences,
  getSentenceById,
  createSentence
} = require("../controllers/sentenceController");

// Get all sentence lessons
router.get("/", getSentences);

// Get one sentence lesson
router.get("/:id", getSentenceById);

// Create a sentence lesson
router.post("/", createSentence);

module.exports = router;
