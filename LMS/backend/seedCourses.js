
require("dotenv").config();

const mongoose = require("mongoose");
const Course = require("./models/Course");
const User = require("./models/User");

const demoCourses = [
  {
    title: "Complete React Developer Course",
    description: "Master React, hooks, components, routing and modern frontend development.",
    category: "Web Development",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    lessons: [
      { title: "Introduction to React", videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk", duration: "12 min" },
      { title: "Components and JSX", videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk", duration: "20 min" },
      { title: "React Hooks", videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk", duration: "25 min" }
    ]
  },
  {
    title: "Full Stack MERN Development",
    description: "Build powerful applications using MongoDB, Express, React and Node.js.",
    category: "Web Development",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    lessons: [
      { title: "MERN Introduction", videoUrl: "https://www.youtube.com/embed/7CqJlxBYj-M", duration: "15 min" },
      { title: "Building REST APIs", videoUrl: "https://www.youtube.com/embed/7CqJlxBYj-M", duration: "30 min" },
      { title: "MongoDB Integration", videoUrl: "https://www.youtube.com/embed/7CqJlxBYj-M", duration: "25 min" }
    ]
  },
  {
    title: "Python Programming Masterclass",
    description: "Learn Python from fundamentals to practical programming.",
    category: "Programming",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
    lessons: [
      { title: "Python Introduction", videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8", duration: "15 min" },
      { title: "Variables and Data Types", videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8", duration: "20 min" },
      { title: "Functions and Modules", videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8", duration: "30 min" }
    ]
  },
  {
    title: "Java Programming Fundamentals",
    description: "Understand Java, OOP, classes, objects and exception handling.",
    category: "Programming",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
    lessons: [
      { title: "Introduction to Java", videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34", duration: "15 min" },
      { title: "Object Oriented Programming", videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34", duration: "30 min" },
      { title: "Exception Handling", videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34", duration: "25 min" }
    ]
  },
  {
    title: "UI UX Design Fundamentals",
    description: "Learn interface design, user experience, wireframes and prototyping.",
    category: "Design",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    lessons: [
      { title: "Design Principles", videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU", duration: "15 min" },
      { title: "Wireframing", videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU", duration: "20 min" },
      { title: "Prototyping", videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU", duration: "25 min" }
    ]
  },
  {
    title: "Data Structures and Algorithms",
    description: "Learn arrays, linked lists, trees, graphs and algorithmic problem solving.",
    category: "Computer Science",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800",
    lessons: [
      { title: "Arrays and Strings", videoUrl: "https://www.youtube.com/embed/8hly31xKli0", duration: "25 min" },
      { title: "Linked Lists", videoUrl: "https://www.youtube.com/embed/8hly31xKli0", duration: "30 min" },
      { title: "Trees and Graphs", videoUrl: "https://www.youtube.com/embed/8hly31xKli0", duration: "40 min" }
    ]
  },
  {
    title: "Node.js Backend Development",
    description: "Create scalable backend services using Node.js and Express.",
    category: "Backend Development",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    lessons: [
      { title: "Node.js Fundamentals", videoUrl: "https://www.youtube.com/embed/Oe421EPjeBE", duration: "20 min" },
      { title: "Express REST APIs", videoUrl: "https://www.youtube.com/embed/Oe421EPjeBE", duration: "30 min" },
      { title: "Authentication", videoUrl: "https://www.youtube.com/embed/Oe421EPjeBE", duration: "30 min" }
    ]
  },
  {
    title: "MongoDB Database Mastery",
    description: "Learn document databases, CRUD operations, aggregation and indexing.",
    category: "Database",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
    lessons: [
      { title: "MongoDB Introduction", videoUrl: "https://www.youtube.com/embed/c2M-rlkkT5o", duration: "15 min" },
      { title: "CRUD Operations", videoUrl: "https://www.youtube.com/embed/c2M-rlkkT5o", duration: "25 min" },
      { title: "Aggregation Pipeline", videoUrl: "https://www.youtube.com/embed/c2M-rlkkT5o", duration: "30 min" }
    ]
  }
];

async function seed()
{
  try
  {
    await mongoose.connect(process.env.MONGODB_URI);

    let instructor = await User.findOne({ role: "instructor" });

    if (!instructor) {
      instructor = await User.findOne({ role: "admin" });
    }

    if (!instructor) {
      if (!instructor)
        {
          instructor = await User.create({
            name: "Demo Instructor",
            email: "instructor@learnify.com",
            password: "Demo123456",
            role: "instructor"
          });
      }
    }
    console.log("Demo instructor created!");

    await Course.deleteMany({ title: { $in: demoCourses.map(c => c.title) } });

    await Course.insertMany(
      demoCourses.map(course => ({
        ...course,
        instructor: instructor._id,
        published: true
      }))
    );

    console.log("Demo courses inserted successfully!");
    process.exit(0);
  }
  catch (error)
  {
    console.error(error);
    process.exit(1);
  }
}

seed();
