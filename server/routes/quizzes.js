const router = require('express').Router();
const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');
const authMiddleware = require('../middleware/auth');

// Get quiz by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit quiz
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    const existing = await Submission.findOne({ userId: req.user._id, quizId: quiz._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already taken this quiz' });
    }
    
    const { answers } = req.body; // answers: [{ questionId, selectedAnswer }] but we don't store questionId, we match by index
    let score = 0;
    const userAnswers = [];
    
    quiz.questions.forEach((question, idx) => {
      const userAnswer = answers[idx] || '';
      userAnswers.push({ questionId: idx, selectedAnswer: userAnswer });
      if (userAnswer === question.correctAnswer) {
        score++;
      }
    });
    
    const percentage = (score / quiz.questions.length) * 100;
    const submission = new Submission({
      userId: req.user._id,
      quizId: quiz._id,
      score: percentage,
      answers: userAnswers
    });
    await submission.save();
    
    res.json({ score: percentage, total: quiz.questions.length, correct: score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's submission for a quiz
router.get('/:id/my-submission', authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findOne({ userId: req.user._id, quizId: req.params.id });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
