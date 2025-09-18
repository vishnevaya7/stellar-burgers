import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectUser,
  selectAuthLoading,
  selectAuthError,
  updateUser
} from '../../services/slices/authSlice';
import { useForm } from '../../utils/hooks/useForm';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [formValue, handleInputChange, { setValue, resetForm }] = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('password', '');
    }
  }, [user, setValue]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged) {
      const updateData: { name?: string; email?: string; password?: string } =
        {};

      if (formValue.name !== user?.name) {
        updateData.name = formValue.name;
      }
      if (formValue.email !== user?.email) {
        updateData.email = formValue.email;
      }
      if (formValue.password) {
        updateData.password = formValue.password;
      }

      dispatch(updateUser(updateData));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('password', '');
    }
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={error || undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
