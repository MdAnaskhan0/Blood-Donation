import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken, selectUser } from '../features/auth/authSlice';

// <ProtectedRoute roles={['admin']} /> - omit roles to allow any logged-in user.
export default function ProtectedRoute({ roles }) {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
