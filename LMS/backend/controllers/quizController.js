const Quiz = require("../models/Quiz");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.createQuiz = async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot create a quiz for this course.",
      });
    }

    const quiz = await Quiz.create(req.body);

    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCourseQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      course: req.params.courseId,
    }).select("-questions.correctAnswer");

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found.",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: quiz.course,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "Enroll in this course first.",
      });
    }

    const safeQuiz = quiz.toObject();

    safeQuiz.questions = safeQuiz.questions.map(
      ({ question, options, marks, _id }) => ({
        _id,
        question,
        options,
        marks,
      })
    );

    res.json(safeQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
