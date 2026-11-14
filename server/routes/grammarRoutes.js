
const express = require("express");
const router = express.Router();

const {
  getGrammarLessons,
  getGrammarLessonById,
  createGrammarLesson
} = require("../controllers/grammarController");

const { protect, admin } = require("../middleware/authMiddleware");

// GET ALL GRAMMAR LESSONS
router.get("/", getGrammarLessons);

// GET SINGLE GRAMMAR LESSON
router.get("/:id", getGrammarLessonById);

// CREATE GRAMMAR LESSON (ADMIN ONLY)
router.post("/", protect, admin, createGrammarLesson);

module.exports = router;
