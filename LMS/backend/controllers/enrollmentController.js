const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course || !course.published) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: course._id,
    });

    res.status(201).json({
      message: "Enrollment successful.",
      enrollment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Already enrolled in this course.",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

exports.myEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    }).populate({
      path: "course",
      populate: { path: "instructor", select: "name" },
    });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.courseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

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

    const students = await Enrollment.find({
      course: course._id,
    }).populate("student", "name email");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
