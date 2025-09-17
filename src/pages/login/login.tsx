import { FC, SyntheticEvent, useState, SetStateAction } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUser,
  selectAuthError,
  clearError
} from '../../services/slices/authSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (email && password) {
      dispatch(loginUser({ email, password }));
    }
  };

  const handleEmailChange = (value: SetStateAction<string>) => {
    setEmail(value);
    if (error) {
      dispatch(clearError());
    }
  };

  const handlePasswordChange = (value: SetStateAction<string>) => {
    setPassword(value);
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={handleEmailChange}
      password={password}
      setPassword={handlePasswordChange}
      handleSubmit={handleSubmit}
    />
  );
};
