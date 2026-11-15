
const Result = require("../models/Result");
const Exam = require("../models/Exam");
const Question = require("../models/Question");

// SUBMIT EXAM AND CALCULATE RESULT
const submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers must be provided as an array"
      });
    }

    const exam = await Exam.findOne({
      _id: examId,
      isActive: true
    });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found or inactive"
      });
    }

    // Get questions and correct answers from database
    const questions = await Question.find({
      exam: examId
    });

    if (questions.length === 0) {
      return res.status(400).json({
        message: "This exam has no questions"
      });
    }

    const questionMap = new Map(
      questions.map(question => [
        question._id.toString(),
        question
      ])
    );

    let score = 0;
    const submittedAnswers = [];
    const answeredQuestionIds = new Set();

    for (const answer of answers) {
      const questionId = answer.question;
      const selectedAnswer = answer.selectedAnswer || "";

      if (!questionId || answeredQuestionIds.has(questionId)) {
        return res.status(400).json({
          message: "Invalid or duplicate question answer"
        });
      }

      answeredQuestionIds.add(questionId);

      const question = questionMap.get(questionId);

      if (!question) {
        return res.status(400).json({
          message: "Question does not belong to this exam"
        });
      }

      if (
        selectedAnswer &&
        !question.options.includes(selectedAnswer)
      ) {
        return res.status(400).json({
          message: "Invalid answer option"
        });
      }

      if (selectedAnswer === question.correctAnswer) {
        score += question.marks;
      }

      submittedAnswers.push({
        question: question._id,
        selectedAnswer
      });
    }

    const totalMarks = questions.reduce(
      (total, question) => total + question.marks,
      0
    );

    const percentage = Number(
      ((score / totalMarks) * 100).toFixed(2)
    );

    const result = await Result.create({
      student: req.user.id,
      exam: examId,
      answers: submittedAnswers,
      score,
      totalMarks,
      percentage
    });

    res.status(201).json({
      message: "Exam submitted successfully",
      result
    });

  } catch (error) {
    console.error("Submit Exam Error:", error);

    res.status(500).json({
      message: "Server error while submitting exam"
    });
  }
};


// GET LOGGED-IN STUDENT RESULTS
const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({
      student: req.user.id
    })
      .populate("exam", "title duration")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      message: "Results fetched successfully",
      count: results.length,
      results
    });

  } catch (error) {
    console.error("Get Results Error:", error);

    res.status(500).json({
      message: "Server error while fetching results"
    });
  }
};


// GET ONE RESULT FOR THE LOGGED-IN STUDENT
const getResultById = async (req, res) => {
  try {
    const result = await Result.findOne({
      _id: req.params.resultId,
      student: req.user.id
    }).populate("exam", "title duration");

    if (!result) {
      return res.status(404).json({
        message: "Result not found"
      });
    }

    res.status(200).json({
      message: "Result fetched successfully",
      result
    });

  } catch (error) {
    console.error("Get Single Result Error:", error);

    res.status(500).json({
      message: "Server error while fetching result"
    });
  }
};


// GET ALL STUDENT RESULTS (ADMIN ONLY)
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name email")
      .populate("exam", "title")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      message: "All results fetched successfully",
      count: results.length,
      results
    });

  } catch (error) {
    console.error("Get All Results Error:", error);

    res.status(500).json({
      message: "Server error while fetching all results"
    });
  }
};


module.exports = {
  submitExam,
  getMyResults,
  getResultById,
  getAllResults
};
