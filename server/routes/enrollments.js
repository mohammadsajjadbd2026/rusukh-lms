const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');

// Enroll in a course
router.post('/:courseId', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (!req.user.enrolledCourses.includes(course._id)) {
      req.user.enrolledCourses.push(course._id);
      await req.user.save();
    }
    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user progress for all enrolled courses
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const user = await req.user.populate('enrolledCourses');
    const Quiz = require('../models/Quiz');
    const Submission = require('../models/Submission');
    
    const progress = [];
    for (const course of user.enrolledCourses) {
      const quizzes = await Quiz.find({ courseId: course._id });
      const submissions = await Submission.find({ userId: req.user._id, quizId: { $in: quizzes.map(q => q._id) } });
      const completedQuizzes = submissions.length;
      const totalQuizzes = quizzes.length;
      const percentage = totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0;
      progress.push({
        courseId: course._id,
        courseTitle: course.title,
        completedQuizzes,
        totalQuizzes,
        percentage
      });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
