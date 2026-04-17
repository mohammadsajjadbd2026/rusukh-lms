import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import TakeQuiz from './pages/TakeQuiz';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AppContent() {
  const { token } = useAuth();
  const [fontFamily, setFontFamily] = useState("'Hind Siliguri', 'Noto Sans Bengali', sans-serif");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/settings/public');
        setFontFamily(res.data.fontFamily);
        document.documentElement.style.setProperty('--font-family', res.data.fontFamily);
      } catch (error) {
        console.error('Failed to load settings');
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/course/:id" element={<PrivateRoute><CourseDetails /></PrivateRoute>} />
          <Route path="/quiz/:id" element={<PrivateRoute><TakeQuiz /></PrivateRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
