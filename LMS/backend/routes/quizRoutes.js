const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createQuiz,
  getCourseQuizzes,
  getQuiz,
} = require("../controllers/quizController");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("instructor", "admin"),
  createQuiz
);

router.get(
  "/course/:courseId",
  protect,
  getCourseQuizzes
);

router.get(
  "/:id",
  protect,
  authorize("student"),
  getQuiz
);

module.exports = router;
