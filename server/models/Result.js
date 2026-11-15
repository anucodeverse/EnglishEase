
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true
        },

        selectedAnswer: {
          type: String,
          default: ""
        }
      }
    ],

    score: {
      type: Number,
      required: true,
      min: 0
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
