import {
  FC,
  SyntheticEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction
} from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUser,
  selectAuthError,
  clearError
} from '../../services/slices/authSlice';
import { useForm } from '../../utils/hooks/useForm';

export const Login: FC = () => {
  const [values, handleChange] = useForm({ email: '', password: '' });
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (values.email && values.password) {
      dispatch(loginUser({ email: values.email, password: values.password }));
    }
  };

  const handleEmailChange: Dispatch<SetStateAction<string>> = (value) => {
    const finalValue =
      typeof value === 'function' ? value(values.email) : value;
    const event = {
      target: { name: 'email', value: finalValue }
    } as ChangeEvent<HTMLInputElement>;
    handleChange(event);
    if (error) {
      dispatch(clearError());
    }
  };

  const handlePasswordChange: Dispatch<SetStateAction<string>> = (value) => {
    const finalValue =
      typeof value === 'function' ? value(values.password) : value;
    const event = {
      target: { name: 'password', value: finalValue }
    } as ChangeEvent<HTMLInputElement>;
    handleChange(event);
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={values.email}
      setEmail={handleEmailChange}
      password={values.password}
      setPassword={handlePasswordChange}
      handleSubmit={handleSubmit}
    />
  );
};
