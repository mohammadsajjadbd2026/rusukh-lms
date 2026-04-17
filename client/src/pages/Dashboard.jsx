import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await axios.get('/courses/enrolled/my');
        setEnrolledCourses(coursesRes.data);
        const progressRes = await axios.get('/enrollments/progress');
        setProgress(progressRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">আমার ড্যাশবোর্ড</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">এনরোলড কোর্স</h2>
        {enrolledCourses.length === 0 ? (
          <p>আপনি এখনো কোনো কোর্স এনরোল করেননি। <Link to="/" className="text-green-600">কোর্স ব্রাউজ করুন</Link></p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrolledCourses.map(course => {
              const prog = progress.find(p => p.courseId === course._id);
              return (
                <div key={course._id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-2">{course.description.substring(0, 100)}</p>
                  <div className="mb-2">
                    <div className="bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${prog?.percentage || 0}%` }}></div>
                    </div>
                    <span className="text-sm">অগ্রগতি: {prog?.percentage?.toFixed(0) || 0}% ({prog?.completedQuizzes || 0}/{prog?.totalQuizzes || 0} কুইজ)</span>
                  </div>
                  <Link to={`/course/${course._id}`} className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">কোর্স চালিয়ে যান</Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
