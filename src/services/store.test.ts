import store, { RootState } from './store';

describe('store', () => {
  it('должен правильно инициализироваться с начальными состояниями всех слайсов', () => {
    const state = store.getState();

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
    const state: RootState = store.getState();

    // Проверяем, что состояние содержит только ожидаемые ключи
    const expectedKeys = ['ingredients', 'auth', 'orders', 'burgerConstructor'];
    const actualKeys = Object.keys(state);

    expect(actualKeys.sort()).toEqual(expectedKeys.sort());
  });

  it('должен корректно работать с Redux store', () => {
    // Проверяем, что store создается с правильной конфигурацией
    expect(store).toBeDefined();
    expect(typeof store.getState).toBe('function');
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.subscribe).toBe('function');
    expect(typeof store.replaceReducer).toBe('function');
  });

  it('должен экспортировать правильные типы', () => {
    // Проверяем, что типы правильно экспортируются
    const state: RootState = store.getState();

    expect(state.ingredients).toBeDefined();
    expect(state.auth).toBeDefined();
    expect(state.orders).toBeDefined();
    expect(state.burgerConstructor).toBeDefined();
  });
});
