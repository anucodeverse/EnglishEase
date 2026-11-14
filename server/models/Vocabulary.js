const mongoose = require("mongoose");

const vocabularySchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true
    },

    meaning: {
      type: String,
      required: true,
      trim: true
    },

    pronunciation: {
      type: String,
      default: ""
    },

    partOfSpeech: {
      type: String,
      default: "Other"
    },

    example: {
      type: String,
      required: true
    },

    synonyms: [
      {
        type: String
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

const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);

module.exports = Vocabulary;