import {
  FC,
  SyntheticEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction
} from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser, selectAuthError } from '../../services/slices/authSlice';
import { useForm } from '../../utils/hooks/useForm';

export const Register: FC = () => {
  const [values, handleChange] = useForm({
    userName: '',
    email: '',
    password: ''
  });
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (values.userName && values.email && values.password) {
      dispatch(
        registerUser({
          name: values.userName,
          email: values.email,
          password: values.password
        })
      );
    }
  };

  const handleEmailChange: Dispatch<SetStateAction<string>> = (value) => {
    const finalValue =
      typeof value === 'function' ? value(values.email) : value;
    const event = {
      target: { name: 'email', value: finalValue }
    } as ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  const handlePasswordChange: Dispatch<SetStateAction<string>> = (value) => {
    const finalValue =
      typeof value === 'function' ? value(values.password) : value;
    const event = {
      target: { name: 'password', value: finalValue }
    } as ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  const handleUserNameChange: Dispatch<SetStateAction<string>> = (value) => {
    const finalValue =
      typeof value === 'function' ? value(values.userName) : value;
    const event = {
      target: { name: 'userName', value: finalValue }
    } as ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={handleEmailChange}
      setPassword={handlePasswordChange}
      setUserName={handleUserNameChange}
      handleSubmit={handleSubmit}
    />
  );
};
