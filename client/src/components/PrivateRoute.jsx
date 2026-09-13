import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function PrivateRoute() {
  const { userInfo } = useAuth();
  const location = useLocation();

  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  );
}

export default PrivateRoute;
