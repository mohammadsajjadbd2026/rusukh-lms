import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/courses');
        setCourses(res.data);
      } catch (error) {
        console.error('Failed to fetch courses');
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">রুসুখ অনলাইন একাডেমি</h1>
        <p className="text-xl text-gray-600">শিখুন, অনুশীলন করুন, এবং নিজেকে প্রমাণ করুন</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={course.thumbnail || 'https://via.placeholder.com/400x200?text=Course'} alt={course.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description.substring(0, 100)}...</p>
              {user ? (
                <Link to={`/course/${course._id}`} className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">কোর্স দেখুন</Link>
              ) : (
                <Link to="/login" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">এনরোল করতে লগইন করুন</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
