import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, { createOrder } from './ordersSlice';
import * as api from '@api';

// Мокаем API
jest.mock('@api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('ordersSlice', () => {
  const createTestStore = () =>
    configureStore({
      reducer: {
        orders: ordersReducer
      }
    });

  type TestStore = ReturnType<typeof createTestStore>;
  let store: TestStore;

  const mockOrder = {
    _id: '1',
    status: 'done' as const,
    name: 'Test Burger',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['ingredient1', 'ingredient2']
  };

  const mockOrderResponse = {
    success: true,
    order: mockOrder,
    name: 'Test Burger'
  };

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('createOrder async thunk', () => {
    it('должно устанавливать orderRequest в true при вызове Request экшена', () => {
      // Мокаем API чтобы промис не резолвился сразу
      mockedApi.orderBurgerApi.mockImplementation(() => new Promise(() => {}));

      // Диспатчим экшен
      store.dispatch(createOrder(['ingredient1', 'ingredient2']));

      // Проверяем что orderRequest стал true
      const state = store.getState().orders;
      expect(state.orderRequest).toBe(true);
      expect(state.orderError).toBeNull();
    });

    it('должно записывать данные в store и устанавливать orderRequest в false при Success экшене', async () => {
      // Мокаем успешный ответ API
      mockedApi.orderBurgerApi.mockResolvedValue(mockOrderResponse);

      // Диспатчим экшен и ждем его выполнения
      await store.dispatch(createOrder(['ingredient1', 'ingredient2']));

      // Проверяем что данные записались в store и orderRequest стал false
      const state = store.getState().orders;
      expect(state.newOrder).toEqual(mockOrder);
      expect(state.orderRequest).toBe(false);
      expect(state.orderError).toBeNull();
    });

    it('должно записывать ошибку в store и устанавливать orderRequest в false при Failed экшене', async () => {
      const errorMessage = 'Ошибка создания заказа';

      // Мокаем ошибку API
      mockedApi.orderBurgerApi.mockRejectedValue(new Error(errorMessage));

      // Диспатчим экшен и ждем его выполнения
      await store.dispatch(createOrder(['ingredient1', 'ingredient2']));

      // Проверяем что ошибка записалась в store и orderRequest стал false
      const state = store.getState().orders;
      expect(state.orderError).toBe(errorMessage);
      expect(state.orderRequest).toBe(false);
      expect(state.newOrder).toBeNull();
    });
  });
});
