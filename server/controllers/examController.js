
const Exam = require("../models/Exam");
const Question = require("../models/Question");

// GET ALL ACTIVE EXAMS
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true })
      .select("title description duration totalMarks createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Exams fetched successfully",
      count: exams.length,
      exams
    });

  } catch (error) {
    console.error("Get Exams Error:", error);

    res.status(500).json({
      message: "Server error while fetching exams"
    });
  }
};


// GET SINGLE EXAM WITH QUESTIONS
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found or inactive"
      });
    }

    // Never send correct answers to students
    const questions = await Question.find({
      exam: exam._id
    }).select("-correctAnswer");

    res.status(200).json({
      message: "Exam fetched successfully",
      exam,
      questions
    });

  } catch (error) {
    console.error("Get Exam Error:", error);

    res.status(500).json({
      message: "Server error while fetching exam"
    });
  }
};


// CREATE EXAM (ADMIN ONLY)
const createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      totalMarks
    } = req.body;

    if (!title || !duration || !totalMarks) {
      return res.status(400).json({
        message: "Title, duration and total marks are required"
      });
    }

    const exam = await Exam.create({
      title,
      description,
      duration,
      totalMarks,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Exam created successfully",
      exam
    });

  } catch (error) {
    console.error("Create Exam Error:", error);

    res.status(500).json({
      message: "Server error while creating exam"
    });
  }
};


// UPDATE EXAM (ADMIN ONLY)
const updateExam = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      totalMarks,
      isActive
    } = req.body;

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        duration,
        totalMarks,
        isActive
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    res.status(200).json({
      message: "Exam updated successfully",
      exam
    });

  } catch (error) {
    console.error("Update Exam Error:", error);

    res.status(500).json({
      message: "Server error while updating exam"
    });
  }
};


// DEACTIVATE EXAM (ADMIN ONLY)
const deactivateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    res.status(200).json({
      message: "Exam deactivated successfully",
      exam
    });

  } catch (error) {
    console.error("Deactivate Exam Error:", error);

    res.status(500).json({
      message: "Server error while deactivating exam"
    });
  }
};


module.exports = {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deactivateExam
};
