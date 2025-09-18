import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/authSlice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onlyUnAuth?: boolean;
}

const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();
  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (onlyUnAuth && isAuthenticated) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from.pathname || '/'} replace />;
  }
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
