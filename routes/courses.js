const router = require('express').Router();
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const authMiddleware = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single course with lessons and quizzes
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });
    const quizzes = await Quiz.find({ courseId: course._id });
    
    res.json({ course, lessons, quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get enrolled courses for a user
router.get('/enrolled/my', authMiddleware, async (req, res) => {
  try {
    const user = await req.user.populate('enrolledCourses');
    res.json(user.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
