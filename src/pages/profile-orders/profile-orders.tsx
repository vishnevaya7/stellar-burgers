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
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isOrdersLoading = useSelector(selectUserOrdersLoading);
  const error = useSelector(selectUserOrdersError);
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  console.log('ProfileOrders component rendered', {
    ordersCount: orders.length,
    ingredientsCount: ingredients.length,
    isOrdersLoading,
    isIngredientsLoading
  });

  useEffect(() => {
    console.log('ProfileOrders useEffect - fetching user orders');
    dispatch(fetchUserOrders());
  }, [dispatch]);
  if (isOrdersLoading || isIngredientsLoading || ingredients.length === 0) {
    return <Preloader />;
  }

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
