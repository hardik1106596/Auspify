const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },

  options: {
    type: [String],
    required: true,
  },

  correctAnswer: {
    type: Number,
    required: true,
  },

  marks: {
    type: Number,
    default: 1,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    questions: [questionSchema],

    duration: {
      type: Number,
      default: 30,
    },

    passingPercentage: {
      type: Number,
      default: 40,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
