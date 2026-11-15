
const Question = require("../models/Question");
const Exam = require("../models/Exam");

// ADD QUESTION TO AN EXAM (ADMIN ONLY)
const addQuestion = async (req, res) => {
  try {
    const {
      questionText,
      options,
      correctAnswer,
      marks
    } = req.body;

    const { examId } = req.params;

    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({
        message: "Question, options and correct answer are required"
      });
    }

    if (!Array.isArray(options) || options.length !== 4 ||
        options.some(option => typeof option !== "string" || !option.trim())) {
      return res.status(400).json({
        message: "Exactly 4 non-empty options are required"
      });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        message: "Correct answer must match one of the options"
      });
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    const question = await Question.create({
      exam: examId,
      questionText,
      options,
      correctAnswer,
      marks: marks || 1
    });

    res.status(201).json({
      message: "Question added successfully",
      question
    });

  } catch (error) {
    console.error("Add Question Error:", error);

    res.status(500).json({
      message: "Server error while adding question"
    });
  }
};


// UPDATE QUESTION (ADMIN ONLY)
const updateQuestion = async (req, res) => {
  try {
    const {
      questionText,
      options,
      correctAnswer,
      marks
    } = req.body;

    if (options && (
      !Array.isArray(options) ||
      options.length !== 4 ||
      options.some(option => typeof option !== "string" || !option.trim())
    )) {
      return res.status(400).json({
        message: "Exactly 4 non-empty options are required"
      });
    }

    if (options && correctAnswer && !options.includes(correctAnswer)) {
      return res.status(400).json({
        message: "Correct answer must match one of the options"
      });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        questionText,
        options,
        correctAnswer,
        marks
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    res.status(200).json({
      message: "Question updated successfully",
      question
    });

  } catch (error) {
    console.error("Update Question Error:", error);

    res.status(500).json({
      message: "Server error while updating question"
    });
  }
};


// DELETE QUESTION (ADMIN ONLY)
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    res.status(200).json({
      message: "Question deleted successfully"
    });

  } catch (error) {
    console.error("Delete Question Error:", error);

    res.status(500).json({
      message: "Server error while deleting question"
    });
  }
};


module.exports = {
  addQuestion,
  updateQuestion,
  deleteQuestion
};
