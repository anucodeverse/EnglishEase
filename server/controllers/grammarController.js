
const Grammar = require("../models/Grammar");

// GET ALL GRAMMAR LESSONS
const getGrammarLessons = async (req, res) => {
  try {
    const { topic, level, search } = req.query;

    let filter = {};

    if (topic) {
      filter.topic = { $regex: topic, $options: "i" };
    }

    if (level) {
      filter.level = level;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { topic: { $regex: search, $options: "i" } }
      ];
    }

    const lessons = await Grammar.find(filter).sort({
      createdAt: -1
    });

    res.status(200).json({
      message: "Grammar lessons fetched successfully",
      count: lessons.length,
      lessons
    });

  } catch (error) {
    console.error("Get Grammar Lessons Error:", error);

    res.status(500).json({
      message: "Server error while fetching grammar lessons"
    });
  }
};


// GET SINGLE GRAMMAR LESSON
const getGrammarLessonById = async (req, res) => {
  try {
    const lesson = await Grammar.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        message: "Grammar lesson not found"
      });
    }

    res.status(200).json({
      message: "Grammar lesson fetched successfully",
      lesson
    });

  } catch (error) {
    console.error("Get Grammar Lesson Error:", error);

    res.status(500).json({
      message: "Server error while fetching grammar lesson"
    });
  }
};


// CREATE GRAMMAR LESSON
const createGrammarLesson = async (req, res) => {
  try {
    const {
      title,
      topic,
      level,
      explanation,
      rules,
      examples
    } = req.body;

    if (!title || !topic || !explanation) {
      return res.status(400).json({
        message: "Title, topic and explanation are required"
      });
    }

    const lesson = await Grammar.create({
      title,
      topic,
      level,
      explanation,
      rules,
      examples
    });

    res.status(201).json({
      message: "Grammar lesson created successfully",
      lesson
    });

  } catch (error) {
    console.error("Create Grammar Lesson Error:", error);

    res.status(500).json({
      message: "Server error while creating grammar lesson"
    });
  }
};


module.exports = {
  getGrammarLessons,
  getGrammarLessonById,
  createGrammarLesson
};
