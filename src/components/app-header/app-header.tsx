import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectUser,
  selectIsAuthenticated,
  logoutUser
} from '../../services/slices/authSlice';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleConstructorClick = () => {
    navigate('/');
  };

  const handleFeedClick = () => {
    navigate('/feed');
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <AppHeaderUI
      userName={isAuthenticated && user ? user.name : undefined}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
      onProfileClick={handleProfileClick}
      onLogout={isAuthenticated ? handleLogout : undefined}
    />
  );
};
