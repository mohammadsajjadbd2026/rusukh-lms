import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axios.get(`/courses/${id}`);
        setCourse(courseRes.data.course);
        setLessons(courseRes.data.lessons);
        setQuizzes(courseRes.data.quizzes);
        
        if (user) {
          const enrolledRes = await axios.get('/courses/enrolled/my');
          const enrolled = enrolledRes.data.some(c => c._id === id);
          setIsEnrolled(enrolled);
          
          // Fetch quiz submissions
          const subs = {};
          for (const quiz of courseRes.data.quizzes) {
            try {
              const subRes = await axios.get(`/quizzes/${quiz._id}/my-submission`);
              if (subRes.data) subs[quiz._id] = subRes.data;
            } catch (err) {}
          }
          setSubmissions(subs);
        }
      } catch (error) {
        console.error('Failed to fetch course details');
      }
    };
    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    try {
      await axios.post(`/enrollments/${id}`);
      setIsEnrolled(true);
      alert('সফলভাবে এনরোল সম্পন্ন হয়েছে!');
    } catch (error) {
      alert('এনরোল করতে ব্যর্থ হয়েছে');
    }
  };

  if (!course) return <div className="text-center py-10">লোড হচ্ছে...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-700 mb-4">{course.description}</p>
        {!isEnrolled && (
          <button onClick={handleEnroll} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">এই কোর্সে এনরোল করুন</button>
        )}
      </div>

      {isEnrolled && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">ভিডিও লেসন</h2>
            {lessons.map((lesson, idx) => (
              <div key={lesson._id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h3 className="text-xl font-medium mb-2">{idx+1}. {lesson.title}</h3>
                <div className="aspect-w-16 aspect-h-9 mb-3">
                  <iframe src={lesson.videoUrl} className="w-full h-96" allowFullScreen title={lesson.title}></iframe>
                </div>
                {lesson.sheetLink && (
                  <a href={lesson.sheetLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">শীট দেখুন (PDF/Drive)</a>
                )}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">কুইজ ও পরীক্ষা</h2>
            {quizzes.map(quiz => {
              const submission = submissions[quiz._id];
              return (
                <div key={quiz._id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <h3 className="text-xl font-medium mb-2">{quiz.title} ({quiz.type === 'exam' ? 'পরীক্ষা' : 'কুইজ'})</h3>
                  <p>মোট প্রশ্ন: {quiz.questions.length}</p>
                  {submission ? (
                    <div>
                      <p className="text-green-600 font-semibold">আপনার স্কোর: {submission.score.toFixed(0)}%</p>
                      <button disabled className="bg-gray-400 text-white px-4 py-2 rounded mt-2">ইতিমধ্যে সম্পন্ন</button>
                    </div>
                  ) : (
                    <button onClick={() => navigate(`/quiz/${quiz._id}`)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2">স্টার্ট {quiz.type === 'exam' ? 'পরীক্ষা' : 'কুইজ'}</button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseDetails;
