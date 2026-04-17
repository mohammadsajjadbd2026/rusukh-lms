import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/quizzes/${id}`);
        setQuiz(res.data);
        // Check existing submission
        const subRes = await axios.get(`/quizzes/${id}/my-submission`);
        if (subRes.data) setExistingSubmission(subRes.data);
      } catch (error) {
        alert('কুইজ লোড করতে ব্যর্থ');
        navigate('/dashboard');
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleAnswerChange = (qIndex, answer) => {
    setAnswers({ ...answers, [qIndex]: answer });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length !== quiz.questions.length) {
      alert('দয়া করে সব প্রশ্নের উত্তর দিন');
      return;
    }
    const answersArray = quiz.questions.map((_, idx) => answers[idx] || '');
    setSubmitting(true);
    try {
      const res = await axios.post(`/quizzes/${id}/submit`, { answers: answersArray });
      alert(`আপনার স্কোর: ${res.data.score.toFixed(0)}% (সঠিক: ${res.data.correct}/${res.data.total})`);
      navigate(`/course/${quiz.courseId}`);
    } catch (error) {
      alert(error.response?.data?.message || 'সাবমিট করতে ব্যর্থ');
    } finally {
      setSubmitting(false);
    }
  };

  if (existingSubmission) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{quiz?.title}</h2>
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-lg">আপনি ইতিমধ্যে এই {quiz?.type === 'exam' ? 'পরীক্ষা' : 'কুইজ'} সম্পন্ন করেছেন।</p>
          <p className="font-semibold">আপনার স্কোর: {existingSubmission.score.toFixed(0)}%</p>
          <button onClick={() => navigate(-1)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">পিছনে যান</button>
        </div>
      </div>
    );
  }

  if (!quiz) return <div className="text-center py-10">লোড হচ্ছে...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
      <p className="text-gray-600 mb-6">{quiz.type === 'exam' ? 'পরীক্ষা' : 'কুইজ'} - মোট প্রশ্ন: {quiz.questions.length}</p>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="mb-6 p-4 border rounded">
            <p className="font-medium mb-3">{idx+1}. {q.questionText}</p>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} className="flex items-center space-x-2">
                  <input type="radio" name={`q${idx}`} value={opt} onChange={() => handleAnswerChange(idx, opt)} className="h-4 w-4 text-green-600" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" disabled={submitting} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400">
          {submitting ? 'সাবমিট হচ্ছে...' : 'সাবমিট করুন'}
        </button>
      </form>
    </div>
  );
};

export default TakeQuiz;
