
const mongoose = require("mongoose");

const grammarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    topic: {
      type: String,
      required: true,
      trim: true
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },

    explanation: {
      type: String,
      required: true
    },

    rules: [
      {
        type: String
      }
    ],

    examples: [
      {
        incorrect: {
          type: String
        },
        correct: {
          type: String
        },
        explanation: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Grammar = mongoose.model("Grammar", grammarSchema);

module.exports = Grammar;
