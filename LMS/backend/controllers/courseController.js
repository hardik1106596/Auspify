const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ published: true })
      .populate("instructor", "name");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name");

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    if (!course.published && req.user?.role !== "admin") {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

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
        message: "You cannot modify this course.",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "thumbnail",
      "lessons",
      "price",
      "level",
      "published",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

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
        message: "You cannot delete this course.",
      });
    }

    await Enrollment.deleteMany({ course: course._id });
    await course.deleteOne();

    res.json({ message: "Course deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
