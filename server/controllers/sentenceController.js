
const Sentence = require("../models/Sentence");

// GET ALL SENTENCE LESSONS
const getSentences = async (req, res) => {
  try {
    const { level, search } = req.query;

    let filter = {};

    if (level) {
      filter.level = level;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { pattern: { $regex: search, $options: "i" } }
      ];
    }

    const sentences = await Sentence.find(filter).sort({
      createdAt: -1
    });

    res.status(200).json({
      message: "Sentences fetched successfully",
      count: sentences.length,
      sentences
    });

  } catch (error) {
    console.error("Get Sentences Error:", error);

    res.status(500).json({
      message: "Server error while fetching sentences"
    });
  }
};

// GET SINGLE SENTENCE LESSON
const getSentenceById = async (req, res) => {
  try {
    const sentence = await Sentence.findById(req.params.id);

    if (!sentence) {
      return res.status(404).json({
        message: "Sentence lesson not found"
      });
    }

    res.status(200).json({
      message: "Sentence fetched successfully",
      sentence
    });

  } catch (error) {
    console.error("Get Sentence Error:", error);

    res.status(500).json({
      message: "Server error while fetching sentence"
    });
  }
};

// CREATE SENTENCE LESSON
const createSentence = async (req, res) => {
  try {
    const {
      title,
      pattern,
      explanation,
      examples,
      level
    } = req.body;

    if (!title || !pattern || !explanation) {
      return res.status(400).json({
        message: "Title, pattern and explanation are required"
      });
    }

    const newSentence = await Sentence.create({
      title,
      pattern,
      explanation,
      examples,
      level
    });

    res.status(201).json({
      message: "Sentence lesson created successfully",
      sentence: newSentence
    });

  } catch (error) {
    console.error("Create Sentence Error:", error);

    res.status(500).json({
      message: "Server error while creating sentence lesson"
    });
  }
};

module.exports = {
  getSentences,
  getSentenceById,
  createSentence
};
