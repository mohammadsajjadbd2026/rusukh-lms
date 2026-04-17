import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-10">লোড হচ্ছে...</div>;
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;
