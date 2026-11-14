
const Vocabulary = require("../models/Vocabulary");

// GET ALL VOCABULARY WORDS
const getVocabulary = async (req, res) => {
  try {
    const { level, partOfSpeech, search } = req.query;

    let filter = {};

    if (level) {
      filter.level = level;
    }

    if (partOfSpeech) {
      filter.partOfSpeech = {
        $regex: partOfSpeech,
        $options: "i"
      };
    }

    if (search) {
      filter.$or = [
        { word: { $regex: search, $options: "i" } },
        { meaning: { $regex: search, $options: "i" } }
      ];
    }

    const words = await Vocabulary.find(filter).sort({
      createdAt: -1
    });

    res.status(200).json({
      message: "Vocabulary fetched successfully",
      count: words.length,
      words
    });

  } catch (error) {
    console.error("Get Vocabulary Error:", error);

    res.status(500).json({
      message: "Server error while fetching vocabulary"
    });
  }
};


// GET SINGLE VOCABULARY WORD
const getVocabularyById = async (req, res) => {
  try {
    const word = await Vocabulary.findById(req.params.id);

    if (!word) {
      return res.status(404).json({
        message: "Vocabulary word not found"
      });
    }

    res.status(200).json({
      message: "Vocabulary word fetched successfully",
      word
    });

  } catch (error) {
    console.error("Get Vocabulary Word Error:", error);

    res.status(500).json({
      message: "Server error while fetching vocabulary word"
    });
  }
};


// CREATE VOCABULARY WORD
const createVocabulary = async (req, res) => {
  try {
    const {
      word,
      meaning,
      pronunciation,
      partOfSpeech,
      example,
      synonyms,
      level
    } = req.body;

    if (!word || !meaning || !example) {
      return res.status(400).json({
        message: "Word, meaning and example are required"
      });
    }

    const newWord = await Vocabulary.create({
      word,
      meaning,
      pronunciation,
      partOfSpeech,
      example,
      synonyms,
      level
    });

    res.status(201).json({
      message: "Vocabulary word created successfully",
      word: newWord
    });

  } catch (error) {
    console.error("Create Vocabulary Error:", error);

    res.status(500).json({
      message: "Server error while creating vocabulary word"
    });
  }
};


module.exports = {
  getVocabulary,
  getVocabularyById,
  createVocabulary
};
