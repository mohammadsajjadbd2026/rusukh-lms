const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

router.use(authMiddleware, adminMiddleware);

// Course Management
router.post('/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    await Lesson.deleteMany({ courseId: req.params.id });
    await Quiz.deleteMany({ courseId: req.params.id });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lesson Management
router.post('/lessons', async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/lessons/:id', async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Quiz Management
router.post('/quizzes', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/quizzes/:id', async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (for enrollment control)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('enrolledCourses');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll/Unenroll user
router.post('/enroll/:userId/:courseId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user.enrolledCourses.includes(req.params.courseId)) {
      user.enrolledCourses.push(req.params.courseId);
      await user.save();
    }
    res.json({ message: 'User enrolled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/unenroll/:userId/:courseId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.enrolledCourses = user.enrolledCourses.filter(id => id.toString() !== req.params.courseId);
    await user.save();
    res.json({ message: 'User unenrolled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
