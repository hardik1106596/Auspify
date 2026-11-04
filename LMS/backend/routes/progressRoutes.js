const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getMyProgress,
  completeLesson,
} = require("../controllers/progressController");

const router = express.Router();

router.get(
  "/my",
  protect,
  authorize("student"),
  getMyProgress
);

router.post(
  "/:courseId/lessons/:lessonId/complete",
  protect,
  authorize("student"),
  completeLesson
);

module.exports = router;
