const Progress = require("../models/Progress");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      student: req.user._id,
    }).populate("course", "title thumbnail");

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "Enroll in the course first.",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    const lessonExists = course.lessons.some(
      (lesson) => lesson._id.toString() === lessonId
    );

    if (!lessonExists) {
      return res.status(404).json({
        message: "Lesson not found.",
      });
    }

    let progress = await Progress.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!progress) {
      progress = await Progress.create({
        student: req.user._id,
        course: courseId,
        completedLessons: [],
      });
    }

    const alreadyCompleted = progress.completedLessons.some(
      (id) => id.toString() === lessonId
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push(lessonId);
    }

    const totalLessons = course.lessons.length;

    progress.percentage =
      totalLessons === 0
        ? 0
        : Math.round(
            (progress.completedLessons.length / totalLessons) * 100
          );

    await progress.save();

    if (progress.percentage === 100) {
      enrollment.completed = true;
      await enrollment.save();
    }

    res.json({
      message: "Lesson completed.",
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
