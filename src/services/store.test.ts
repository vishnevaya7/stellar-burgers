import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import authReducer from './slices/authSlice';
import ordersReducer from './slices/ordersSlice';
import constructorReducer from './slices/constructorSlice';

// Создаем тип для нашего тестового store
const createTestStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsReducer,
      auth: authReducer,
      orders: ordersReducer,
      burgerConstructor: constructorReducer
    }
  });

type TestStore = ReturnType<typeof createTestStore>;
type TestRootState = ReturnType<TestStore['getState']>;

describe('rootReducer', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('должен правильно инициализировать rootReducer с начальными состояниями всех слайсов', () => {
    const state: TestRootState = store.getState();

    // Проверяем, что все слайсы присутствуют в состоянии
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('burgerConstructor');

    // Проверяем правильную инициализацию ingredientsSlice
    expect(state.ingredients).toEqual({
      ingredients: [],
      buns: [],
      mains: [],
      sauces: [],
      isLoading: false,
      error: null
    });

    // Проверяем правильную инициализацию authSlice
    expect(state.auth).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isAuthChecked: false
    });

    // Проверяем правильную инициализацию ordersSlice
    expect(state.orders).toEqual({
      feeds: [],
      feedsTotal: 0,
      feedsTotalToday: 0,
      feedsLoading: false,
      feedsError: null,
      userOrders: [],
      userOrdersLoading: false,
      userOrdersError: null,
      newOrder: null,
      orderRequest: false,
      orderError: null,
      currentOrder: null,
      currentOrderLoading: false,
      currentOrderError: null
    });

    // Проверяем правильную инициализацию constructorSlice
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('должен иметь правильную структуру RootState', () => {
    const state: TestRootState = store.getState();

    // Проверяем, что состояние содержит только ожидаемые ключи
    const expectedKeys = ['ingredients', 'auth', 'orders', 'burgerConstructor'];
    const actualKeys = Object.keys(state);

    expect(actualKeys.sort()).toEqual(expectedKeys.sort());
  });

  it('должен корректно работать с Redux store', () => {
    // Проверяем, что store создается с правильной конфигурацией
    expect(store).toBeDefined();
    expect(store.getState).toBeDefined();
    expect(store.dispatch).toBeDefined();
    expect(store.subscribe).toBeDefined();
  });
});
