import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/slices/authSlice';

interface OnlyUnAuthRouteProps {
  children: React.ReactNode;
}

const OnlyUnAuthRoute = ({ children }: OnlyUnAuthRouteProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default OnlyUnAuthRoute;
