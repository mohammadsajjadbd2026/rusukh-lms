import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-700">রুসুখ অনলাইন একাডেমি</Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-green-600">হোম</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-green-600">ড্যাশবোর্ড</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-green-600">অ্যাডমিন</Link>
              )}
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800">লগআউট</button>
              <span className="text-gray-600">স্বাগতম, {user.name}</span>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-green-600">লগইন</Link>
              <Link to="/register" className="text-gray-700 hover:text-green-600">রেজিস্টার</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
