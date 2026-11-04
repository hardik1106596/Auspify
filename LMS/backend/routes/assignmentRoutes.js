const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createAssignment,
  getAssignments,
  submitAssignment,
  gradeSubmission,
} = require("../controllers/assignmentController");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("instructor", "admin"),
  createAssignment
);

router.get(
  "/course/:courseId",
  protect,
  getAssignments
);

router.post(
  "/:assignmentId/submit",
  protect,
  authorize("student"),
  submitAssignment
);

router.put(
  "/submissions/:submissionId/grade",
  protect,
  authorize("instructor", "admin"),
  gradeSubmission
);

module.exports = router;
