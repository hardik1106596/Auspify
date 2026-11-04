const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Enrollment = require("../models/Enrollment");

exports.createAssignment = async (req, res) => {
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
        message: "Access denied.",
      });
    }

    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      course: req.params.courseId,
    });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(
      req.params.assignmentId
    );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: assignment.course,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "Enroll in this course first.",
      });
    }

    const submission = await AssignmentSubmission.findOneAndUpdate(
      {
        assignment: assignment._id,
        student: req.user._id,
      },
      {
        assignment: assignment._id,
        student: req.user._id,
        text: req.body.text,
        fileUrl: req.body.fileUrl,
        submittedAt: new Date(),
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
      message: "Assignment submitted.",
      submission,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const submission = await AssignmentSubmission.findById(
      req.params.submissionId
    ).populate("assignment");

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found.",
      });
    }

    const course = await Course.findById(
      submission.assignment.course
    );

    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    submission.marks = req.body.marks;
    submission.feedback = req.body.feedback || "";
    submission.status = "graded";

    await submission.save();

    res.json({
      message: "Submission graded.",
      submission,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
