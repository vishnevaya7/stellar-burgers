import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser } from './authSlice';
import * as api from '@api';

// Мокаем API
jest.mock('@api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('authSlice', () => {
  const createTestStore = () =>
    configureStore({
      reducer: {
        auth: authReducer
      }
    });

  type TestStore = ReturnType<typeof createTestStore>;
  let store: TestStore;

  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockAuthResponse = {
    success: true,
    user: mockUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token'
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
    jest.clearAllMocks();
  });

  describe('loginUser async thunk', () => {
    it('должно устанавливать isLoading в true при вызове Request экшена', () => {
      // Мокаем API чтобы промис не резолвился сразу
      mockedApi.loginUserApi.mockImplementation(() => new Promise(() => {}));

      // Диспатчим экшен
      store.dispatch(
        loginUser({ email: 'test@example.com', password: 'password' })
      );

      // Проверяем что isLoading стал true
      const state = store.getState().auth;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должно записывать данные в store и устанавливать isLoading в false при Success экшене', async () => {
      // Мокаем успешный ответ API
      mockedApi.loginUserApi.mockResolvedValue(mockAuthResponse);

      // Диспатчим экшен и ждем его выполнения
      await store.dispatch(
        loginUser({ email: 'test@example.com', password: 'password' })
      );

      // Проверяем что данные записались в store и isLoading стал false
      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('должно записывать ошибку в store и устанавливать isLoading в false при Failed экшене', async () => {
      const errorMessage = 'Ошибка авторизации';

      // Мокаем ошибку API
      mockedApi.loginUserApi.mockRejectedValue(new Error(errorMessage));

      // Диспатчим экшен и ждем его выполнения
      await store.dispatch(
        loginUser({ email: 'test@example.com', password: 'password' })
      );

      // Проверяем что ошибка записалась в store и isLoading стал false
      const state = store.getState().auth;
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
