import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { selectIsAuthenticated } from '../../services/slices/authSlice';
import {
  createOrder,
  selectNewOrder,
  selectOrderRequest,
  clearNewOrder,
  fetchFeeds
} from '../../services/slices/ordersSlice';
import {
  selectConstructorItems,
  clearConstructor
} from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const newOrder = useSelector(selectNewOrder);
  const orderRequest = useSelector(selectOrderRequest);
  const constructorItems = useSelector(selectConstructorItems);

  // очищаем конструктор после успешного создания заказа
  useEffect(() => {
    if (newOrder) {
      dispatch(clearConstructor());
      dispatch(fetchFeeds());
    }
  }, [newOrder, dispatch]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // проверяем авторизацию перед оформлением заказа
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // создаем массив ID ингредиентов для заказа
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      ),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearNewOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={newOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
