
const express = require("express");
const router = express.Router();

const {
  getSentences,
  getSentenceById,
  createSentence
} = require("../controllers/sentenceController");

const { protect, admin } = require("../middleware/authMiddleware");

// GET ALL SENTENCE LESSONS
router.get("/", getSentences);

// GET SINGLE SENTENCE LESSON
router.get("/:id", getSentenceById);

// CREATE SENTENCE LESSON (ADMIN ONLY)
router.post("/", protect, admin, createSentence);

module.exports = router;
