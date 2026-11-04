const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  enrollCourse,
  myEnrollments,
  courseStudents,
} = require("../controllers/enrollmentController");

const router = express.Router();

router.post(
  "/:courseId",
  protect,
  authorize("student"),
  enrollCourse
);

router.get(
  "/my",
  protect,
  authorize("student"),
  myEnrollments
);

router.get(
  "/course/:courseId/students",
  protect,
  authorize("instructor", "admin"),
  courseStudents
);

module.exports = router;
