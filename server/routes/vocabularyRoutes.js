
const express = require("express");
const router = express.Router();

const {
  getVocabulary,
  getVocabularyById,
  createVocabulary
} = require("../controllers/vocabularyController");

const { protect, admin } = require("../middleware/authMiddleware");

// GET ALL VOCABULARY WORDS
router.get("/", getVocabulary);

// GET SINGLE VOCABULARY WORD
router.get("/:id", getVocabularyById);

// CREATE VOCABULARY WORD (ADMIN ONLY)
router.post("/", protect, admin, createVocabulary);

module.exports = router;
