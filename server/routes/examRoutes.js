const express = require("express");
const router = express.Router();

const {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deactivateExam
} = require("../controllers/examController");

const {
  addQuestion,
  updateQuestion,
  deleteQuestion
} = require("../controllers/questionController");

const {
  submitExam,
  getMyResults,
  getAllResults
} = require("../controllers/resultController");

const { protect, admin } = require("../middleware/authMiddleware");

// STUDENT - GET OWN RESULTS
router.get("/results/my", protect, getMyResults);

// ADMIN - GET ALL RESULTS
router.get("/results/all", protect, admin, getAllResults);

// STUDENT - GET ACTIVE EXAMS
router.get("/", protect, getExams);

// ADMIN - CREATE EXAM
router.post("/", protect, admin, createExam);

// ADMIN - ADD QUESTION
router.post("/:examId/questions", protect, admin, addQuestion);

// ADMIN - UPDATE QUESTION
router.put("/questions/:id", protect, admin, updateQuestion);

// ADMIN - DELETE QUESTION
router.delete("/questions/:id", protect, admin, deleteQuestion);

// ADMIN - UPDATE EXAM
router.put("/:id", protect, admin, updateExam);

// ADMIN - DEACTIVATE EXAM
router.patch("/:id/deactivate", protect, admin, deactivateExam);

// STUDENT - SUBMIT EXAM
router.post("/:examId/submit", protect, submitExam);

// STUDENT - GET SINGLE EXAM
router.get("/:id", protect, getExamById);

module.exports = router;