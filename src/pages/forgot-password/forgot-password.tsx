import {
  FC,
  useState,
  SyntheticEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction
} from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useForm } from '../../utils/hooks/useForm';

export const ForgotPassword: FC = () => {
  const [values, handleChange] = useForm({ email: '' });
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    forgotPasswordApi({ email: values.email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err));
  };

  const handleEmailChange: Dispatch<SetStateAction<string>> = (value) => {
    const finalValue =
      typeof value === 'function' ? value(values.email) : value;
    const event = {
      target: { name: 'email', value: finalValue }
    } as ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={values.email}
      setEmail={handleEmailChange}
      handleSubmit={handleSubmit}
    />
  );
};
