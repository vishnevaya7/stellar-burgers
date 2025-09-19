import {
  FC,
  SyntheticEvent,
  useEffect,
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction
} from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { useForm } from '../../utils/hooks/useForm';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [values, handleChange] = useForm({ password: '', token: '' });
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    resetPasswordApi({ password: values.password, token: values.token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => setError(err));
  };

  const handlePasswordChange: Dispatch<SetStateAction<string>> = (value) => {
    const finalValue =
      typeof value === 'function' ? value(values.password) : value;
    const event = {
      target: { name: 'password', value: finalValue }
    } as ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  const handleTokenChange: Dispatch<SetStateAction<string>> = (value) => {
    const finalValue =
      typeof value === 'function' ? value(values.token) : value;
    const event = {
      target: { name: 'token', value: finalValue }
    } as ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={values.password}
      token={values.token}
      setPassword={handlePasswordChange}
      setToken={handleTokenChange}
      handleSubmit={handleSubmit}
    />
  );
};
