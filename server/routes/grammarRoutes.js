
const express = require("express");
const router = express.Router();

const {
  getGrammarLessons,
  getGrammarLessonById,
  createGrammarLesson
} = require("../controllers/grammarController");

// GET ALL GRAMMAR LESSONS
router.get("/", getGrammarLessons);

// GET SINGLE GRAMMAR LESSON
router.get("/:id", getGrammarLessonById);

// CREATE GRAMMAR LESSON
router.post("/", createGrammarLesson);

module.exports = router;
