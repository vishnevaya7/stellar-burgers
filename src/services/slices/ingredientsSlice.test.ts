import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import * as api from '@api';

// Мокаем API
jest.mock('@api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('ingredientsSlice', () => {
  const createTestStore = () =>
    configureStore({
      reducer: {
        ingredients: ingredientsReducer
      }
    });

  type TestStore = ReturnType<typeof createTestStore>;
  let store: TestStore;

  const mockIngredients = [
    {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'bun.png',
      image_mobile: 'bun_mobile.png',
      image_large: 'bun_large.png'
    }
  ];

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('fetchIngredients async thunk', () => {
    it('должно устанавливать isLoading в true при вызове Request экшена', () => {
      // Мокаем API чтобы промис не резолвился сразу
      mockedApi.getIngredientsApi.mockImplementation(
        () => new Promise(() => {})
      );

      // Диспатчим экшен
      store.dispatch(fetchIngredients());

      // Проверяем что isLoading стал true
      const state = store.getState().ingredients;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должно записывать данные в store и устанавливать isLoading в false при Success экшене', async () => {
      // Мокаем успешный ответ API
      mockedApi.getIngredientsApi.mockResolvedValue(mockIngredients);

      // Диспатчим экшен и ждем его выполнения
      await store.dispatch(fetchIngredients());

      // Проверяем что данные записались в store и isLoading стал false
      const state = store.getState().ingredients;
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('должно записывать ошибку в store и устанавливать isLoading в false при Failed экшене', async () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      // Мокаем ошибку API
      mockedApi.getIngredientsApi.mockRejectedValue(new Error(errorMessage));

      // Диспатчим экшен и ждем его выполнения
      await store.dispatch(fetchIngredients());

      // Проверяем что ошибка записалась в store и isLoading стал false
      const state = store.getState().ingredients;
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual([]);
    });
  });
});
