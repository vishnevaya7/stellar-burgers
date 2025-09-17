import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchUserOrders,
  selectUserOrders,
  selectUserOrdersLoading,
  selectUserOrdersError
} from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectUserOrdersLoading);
  const error = useSelector(selectUserOrdersError);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // показываем загрузку во время первичной загрузки заказов
  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  // показываем ошибку, если что-то пошло не так
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Произошла ошибка при загрузке заказов: {error}</p>
        <button onClick={() => dispatch(fetchUserOrders())}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
