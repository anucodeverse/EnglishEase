
const express = require("express");
const router = express.Router();

const {
  getVocabulary,
  getVocabularyById,
  createVocabulary
} = require("../controllers/vocabularyController");

// GET ALL VOCABULARY WORDS
router.get("/", getVocabulary);

// GET SINGLE VOCABULARY WORD
router.get("/:id", getVocabularyById);

// CREATE VOCABULARY WORD
router.post("/", createVocabulary);

module.exports = router;
