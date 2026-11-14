
const mongoose = require("mongoose");

const sentenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    pattern: {
      type: String,
      required: true,
      trim: true
    },

    explanation: {
      type: String,
      required: true
    },

    examples: [
      {
        sentence: {
          type: String,
          required: true
        },
        meaning: {
          type: String,
          default: ""
        }
      }
    ],

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    }
  },
  {
    timestamps: true
  }
);

const Sentence = mongoose.model("Sentence", sentenceSchema);

module.exports = Sentence;
